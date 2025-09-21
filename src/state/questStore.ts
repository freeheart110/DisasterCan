import { create } from 'zustand';
import { loadQuestsForProvince } from '../services/questService';
import {
  getUserProfile,
  saveQuestProgress,
  CompletedItem,
  saveQuizCompletion,
  saveChecklistCompletion,
  updateUserProfileField,
} from '../services/profileService';
import {
  awardPointForChecklistItem,
  POINTS_FOR_NEXT_LEVEL,
  calculateLevel,
} from '../services/gamificationService';
import type { UserProfile } from '../services/profileService';
import type { Quest } from '../constants/quests/questConfig';
import { getEarnedBadges } from '../services/badgeService';

// Zustand store interface
interface QuestState {
  quests: Quest[]; // All loaded quests
  userProfile: UserProfile | null; // Fetched user profile
  isLoading: boolean; // Loading flag

  // Actions
  initializeQuests: (userId: string, provinceCode: string) => Promise<void>;
  toggleItemCompleted: (
    userId: string,
    questId: string,
    categoryId: string,
    itemId: string
  ) => void;
  updateProfile: (newProfile: UserProfile) => void;
  getLevelBarProgress: () => {
    currentPoint: number;
    requiredPoint: number;
    level: number;
    progress: number;
  };
  awardPoint: (userId: string, amount: number) => Promise<void>;
  getQuestProgress: (questId: string) => number;
  makeQuizCompleted: (quest: Quest) => void;
  makeChecklistCompleted: (quest: Quest) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  userProfile: null,
  isLoading: true,

  // Load quests and initialize user progress
  async initializeQuests(userId, provinceCode) {
    if (!get().isLoading) return;

    const baseQuests = loadQuestsForProvince(provinceCode);
    const profile = await getUserProfile(userId);
    set({ userProfile: profile });

    const now = new Date();

    const questsWithProgress = baseQuests.map((quest) => {
      const saved = profile.completedQuests[quest.id];
      if (!saved) return quest;

      if (quest.format === 'quiz') return quest;

      if (quest.format === 'checklist' && quest.categories) {
        const updatedCategories = quest.categories.map((category) => {
          const savedItems: CompletedItem[] =
            saved.checklistItems?.[category.title] ?? [];

          const updatedItems = category.items.map((item) => {
            const matched = savedItems.find((i) => i.id === item.id);

            let isExpired = true;
            let expiryDays: number | undefined = undefined;

            if (matched?.completedAt && matched.expiryDays !== undefined) {
              expiryDays = matched.expiryDays;
              const daysSince =
                (now.getTime() - new Date(matched.completedAt).getTime()) /
                (1000 * 60 * 60 * 24);
              isExpired = daysSince >= expiryDays;
            }

            return {
              ...item,
              completed: matched ? !isExpired : false,
              completedAt: matched?.completedAt,
              expiryDays,
            };
          });

          return { ...category, items: updatedItems };
        });

        return { ...quest, categories: updatedCategories };
      }

      return quest;
    });

    set({ quests: questsWithProgress, isLoading: false });
  },

  // Toggle a checklist item and update backend
  async toggleItemCompleted(userId, questId, categoryId, itemId) {
    let updatedQuest: Quest | undefined;
    let wasJustCompleted = false;

    const updatedQuests = get().quests.map((quest) => {
      if (quest.id === questId && quest.format === 'checklist' && quest.categories) {
        const newCategories = quest.categories.map((category) => {
          if (category.title !== categoryId) return category;

          const newItems = category.items.map((item) => {
            if (item.id !== itemId) return item;

            const newCompleted = !item.completed;
            if (newCompleted) wasJustCompleted = true;

            return {
              ...item,
              completed: newCompleted,
              completedAt: newCompleted ? new Date().toISOString() : undefined,
              expiryDays: item.expiryDays,
            };
          });

          return { ...category, items: newItems };
        });

        updatedQuest = { ...quest, categories: newCategories };
        return updatedQuest;
      }
      return quest;
    });

    set({ quests: updatedQuests });

    // Save updated checklist to Firestore
    if (updatedQuest) {
      await saveQuestProgress(userId, updatedQuest);

      const allItems = updatedQuest.categories?.flatMap((cat) => cat.items) ?? [];
      const allCompleted = allItems.length > 0 && allItems.every((item) => item.completed);

      if (wasJustCompleted) {
        await awardPointForChecklistItem(userId, allCompleted, false);

        if (allCompleted) {
          console.log(`🎯 All items completed for "${updatedQuest.title}"`);
          get().makeChecklistCompleted(updatedQuest);
        }
      } else {
        await awardPointForChecklistItem(userId, false, true);
      }

      const updatedProfile = await getUserProfile(userId);
      set({ userProfile: updatedProfile });
    }
  },

  // Manually update the profile in store
  updateProfile(newProfile) {
    set({ userProfile: newProfile });
  },

  // Level bar UI helper
  getLevelBarProgress() {
    const profile = get().userProfile;
    if (!profile) {
      return {
        currentPoint: 0,
        requiredPoint: 100,
        level: 1,
        progress: 0,
      };
    }

    const totalPoints = profile.point;
    const level = calculateLevel(totalPoints);
    const prev = POINTS_FOR_NEXT_LEVEL(Math.max(0, level - 1));
    const next = POINTS_FOR_NEXT_LEVEL(level);
    const earnedThisLevel = totalPoints - prev;
    const required = next - prev;
    const progress = Math.round((earnedThisLevel / required) * 100);

    return {
      currentPoint: earnedThisLevel,
      requiredPoint: required,
      level,
      progress: Math.max(0, Math.min(100, progress)),
    };
  },

  // Award generic points and update profile
  async awardPoint(userId, amount) {
    const isComplete = amount > 1;
    await awardPointForChecklistItem(userId, isComplete);
    const updatedProfile = await getUserProfile(userId);
    set({ userProfile: updatedProfile });
  },

  // Compute quest progress percentage
  getQuestProgress: (questId: string) => {
    const { quests, userProfile } = get();
    const quest = quests.find((q) => q.id === questId);
    if (!quest || !userProfile) return 0;

    const completedQuest = userProfile.completedQuests?.[questId];
    if (quest.format === 'quiz') {
      return completedQuest?.quizCompleted ? 100 : 0;
    }

    if (quest.format === 'checklist' && quest.categories) {
      const totalItems = quest.categories.reduce((count, cat) => count + cat.items.length, 0);
      const completedItems = quest.categories.reduce((count, cat) => {
        const categoryId = cat.title;
        const items = completedQuest?.checklistItems?.[categoryId] || [];
        return count + items.length;
      }, 0);
      return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    return 0;
  },

  // Mark a checklist quest as fully completed
  makeChecklistCompleted(quest: Quest) {
    const { userProfile } = get();
    if (!userProfile) return;

    const prevData = userProfile.completedQuests?.[quest.id] || {};
    const hasChecklist = !!prevData.checklistItems;
    if (!hasChecklist) return;

    const updatedProfile: UserProfile = {
      ...userProfile,
      completedQuests: {
        ...userProfile.completedQuests,
        [quest.id]: {
          ...prevData,
          title: quest.title,
          checklistItems: prevData.checklistItems,
        },
      },
    };

    set({ userProfile: updatedProfile });
    saveChecklistCompletion(userProfile.userId, quest);
    evaluateAndAssignBadges(userProfile.userId);
  },

  // Mark a quiz quest as completed
  makeQuizCompleted(quest: Quest) {
    const { userProfile } = get();
    if (!userProfile) return;

    const alreadyCompleted = userProfile.completedQuests?.[quest.id]?.quizCompleted === true;
    if (alreadyCompleted) return;

    const updatedProfile: UserProfile = {
      ...userProfile,
      completedQuests: {
        ...userProfile.completedQuests,
        [quest.id]: {
          ...userProfile.completedQuests[quest.id],
          title: quest.title,
          quizCompleted: true,
        },
      },
    };

    set({ userProfile: updatedProfile });
    saveQuizCompletion(userProfile.userId, quest);
    evaluateAndAssignBadges(userProfile.userId);
  },
}));

// Evaluate and assign badges, and update Firestore + state if changed
export const evaluateAndAssignBadges = async (userId: string) => {
  const state = useQuestStore.getState();
  const profile = state.userProfile;
  if (!profile) return;

  const earnedBadges = getEarnedBadges(profile);

  const existing = profile.badges || [];
  const changed =
    JSON.stringify([...existing].sort()) !== JSON.stringify([...earnedBadges].sort());

  if (changed) {
    await updateUserProfileField(userId, 'badges', earnedBadges);
    useQuestStore.setState({
      userProfile: { ...profile, badges: earnedBadges },
    });
    console.log('🏅 Updated badges in Firestore:', earnedBadges);
  }
};