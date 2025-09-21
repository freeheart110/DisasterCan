import { create } from 'zustand';
import { loadQuestsForProvince } from '../services/questService';
import {
  getUserProfile,
  saveQuestProgress,
  CompletedItem,
} from '../services/profileService';
import {
  awardPointForChecklistItem,
  POINTS_FOR_NEXT_LEVEL,
  calculateLevel,
} from '../services/gamificationService';
import type { UserProfile } from '../services/profileService';
import type { Quest } from '../constants/quests/questConfig';

// Define the shape of the QuestState managed by Zustand
interface QuestState {
  quests: Quest[];
  userProfile: UserProfile | null;
  isLoading: boolean;

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

  // New method to track completed quiz questions per quest
  markQuestionCompleted: (questId: string, questionId: string) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  userProfile: null,
  isLoading: true,

  // Load quests and initialize progress based on the saved user profile
  async initializeQuests(userId, provinceCode) {
    if (!get().isLoading) return;

    const baseQuests = loadQuestsForProvince(provinceCode);
    const profile = await getUserProfile(userId);
    set({ userProfile: profile });

    const now = new Date();

    const questsWithProgress = baseQuests.map((quest) => {
      const saved = profile.completedQuests[quest.id];
      if (!saved) return quest;

      // Skip quiz progress (handled separately)
      if (quest.format === 'quiz') return quest;

      // Process checklist quests and mark items as completed or expired
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

  // Toggle the completion status of a checklist item and update profile/XP
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

    // Save updated quests into store state
    set({ quests: updatedQuests });

    if (updatedQuest) {
      // Save to Firestore
      await saveQuestProgress(userId, updatedQuest);

      // Determine if entire checklist is now completed
      const allItems = updatedQuest.categories?.flatMap((cat) => cat.items) ?? [];
      const allCompleted = allItems.length > 0 && allItems.every((item) => item.completed);

      // Award points based on type: +1 or -1 for single item, +5 if checklist completed
      if (wasJustCompleted) {
        await awardPointForChecklistItem(userId, allCompleted, false); // normal award
      } else {
        await awardPointForChecklistItem(userId, false, true); // subtract 1
      }

      // Refresh user profile after awarding points
      const updatedProfile = await getUserProfile(userId);
      set({ userProfile: updatedProfile });
    }
  },

  // Replace the current in-memory profile with a new one
  updateProfile(newProfile) {
    set({ userProfile: newProfile });
  },

  // Return level progress bar values for display in UI
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

  // Award a number of points and refresh the user profile
  async awardPoint(userId, amount) {
    const isComplete = amount > 1; // Treat 5 or more as full completion bonus
    await awardPointForChecklistItem(userId, isComplete);
    const updatedProfile = await getUserProfile(userId);
    set({ userProfile: updatedProfile });
  },

  // Return the percentage of completed checklist items in a given quest
  getQuestProgress(questId: string) {
    const quest = get().quests.find((q) => q.id === questId);
    if (!quest || quest.format !== 'checklist' || !quest.categories) return 0;

    const total = quest.categories.reduce((sum, c) => sum + c.items.length, 0);
    const done = quest.categories.reduce(
      (sum, c) => sum + c.items.filter((i) => i.completed).length,
      0
    );

    return total > 0 ? Math.round((done / total) * 100) : 0;
  },

  // Mark a specific quiz question as completed to prevent awarding again
  markQuestionCompleted(questId, questionId) {
    const { userProfile } = get();
    if (!userProfile) return;

    // Get previously completed quiz question IDs for this quest
    const prevIds =
      userProfile.completedQuests?.[questId]?.completedQuizQuestionIds || [];

    // Do nothing if already completed
    if (prevIds.includes(questionId)) return;

    // Construct updated profile with new quiz question ID added
    const updatedProfile: UserProfile = {
      ...userProfile,
      completedQuests: {
        ...userProfile.completedQuests,
        [questId]: {
          ...userProfile.completedQuests[questId],
          completedQuizQuestionIds: [...prevIds, questionId],
        },
      },
    };

    // Save updated profile to Zustand store
    set({ userProfile: updatedProfile });
  },
}));