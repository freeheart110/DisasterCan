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

/**
 * Zustand store for managing quest state, user profile, and gamified logic
 */
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
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  userProfile: null,
  isLoading: true,

  /**
   * Loads quests for the selected province and applies user's saved progress.
   * Expired checklist items are filtered using completedAt + expiryDays from each item.
   */
  async initializeQuests(userId, provinceCode) {
    if (!get().isLoading) return;

    const baseQuests = loadQuestsForProvince(provinceCode);
    const profile = await getUserProfile(userId);
    set({ userProfile: profile });

    const now = new Date();

    const questsWithProgress = baseQuests.map((quest) => {
      const saved = profile.completedQuests[quest.id];
      if (!saved) return quest;

      // --- Handle quiz expiration (whole quest expiry) ---
      if (quest.format === 'quiz') {
        const expiryDays = quest.category === 'common' ? 180 : 30;
        if ((saved.completedDaysAgo ?? 0) >= expiryDays) {
          return quest; // Expired, reset progress
        }
        return quest; // Quiz still valid
      }

      // --- Handle checklist item-by-item expiration ---
      if (quest.format === 'checklist' && quest.categories) {
        const updatedCategories = quest.categories.map((category) => {
          const savedItems: CompletedItem[] =
            saved.completedItems[category.title] ?? [];

          const updatedItems = category.items.map((item) => {
            const matched = savedItems.find((i) => i.id === item.id);

            let isExpired = true;
            let expiryDays: number | undefined = undefined;

            if (matched?.completedAt !== undefined && matched.expiryDays !== undefined) {
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

  /**
   * Toggles a checklist item's completion state and applies:
   * - Local state change
   * - Firestore persistence with completedAt & expiryDays
   * - XP reward logic (+1/-1)
   */
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
              expiryDays: newCompleted ? item.expiryDays : undefined,
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

    // Persist to Firestore
    if (updatedQuest) {
      await saveQuestProgress(userId, updatedQuest);

      const delta = wasJustCompleted ? 1 : -1;
      await awardPointForChecklistItem(userId, delta);

      const updatedProfile = await getUserProfile(userId);
      set({ userProfile: updatedProfile });
    }
  },

  /**
   * Updates the user profile in store (used after XP awards, etc.)
   */
  updateProfile(newProfile) {
    set({ userProfile: newProfile });
  },

  /**
   * Returns level progress data: current points, required points, level, %
   */
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

  /**
   * Awards or removes points manually (e.g., bonus points or testing).
   */
  async awardPoint(userId, amount) {
    await awardPointForChecklistItem(userId, amount);
    const updatedProfile = await getUserProfile(userId);
    set({ userProfile: updatedProfile });
  },

  /**
   * Calculates percentage completion of checklist items in a given quest.
   */
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
}));