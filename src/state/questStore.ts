import { create } from 'zustand';
import { loadQuestsForProvince } from '../services/questService';
import { getUserProfile, saveQuestProgress } from '../services/profileService';
import {
  awardXpForChecklistItem,
  XP_FOR_NEXT_LEVEL,
  calculateLevel,
} from '../services/gamificationService';
import type { UserProfile } from '../services/profileService';
import type { Quest } from '../constants/quests/types';

/**
 * Zustand store for managing quests, user progress, and XP/leveling.
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
  getXpBarProgress: () => {
    currentXp: number;
    requiredXp: number;
    level: number;
    progress: number;
  };
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  userProfile: null,
  isLoading: true,

  /**
   * Initializes quests and user profile for the given region.
   * Loads the quests, merges them with saved progress, and stores them in state.
   */
  initializeQuests: async (userId, provinceCode) => {
    if (!get().isLoading) return;

    const baseQuests = loadQuestsForProvince(provinceCode);
    const profile = await getUserProfile(userId);
    set({ userProfile: profile });

    // Merge saved progress into quest data
    const questsWithProgress = baseQuests.map((quest) => {
      const savedQuestProgress = profile.completedQuests[quest.id];
      if (!savedQuestProgress) return quest;

      const newCategories = quest.categories.map((category) => {
        const completedItemIds =
          savedQuestProgress.completedItems[category.title] || [];
        const newItems = category.items.map((item) => ({
          ...item,
          completed: completedItemIds.includes(item.id),
        }));
        return { ...category, items: newItems };
      });

      return { ...quest, categories: newCategories };
    });

    set({ quests: questsWithProgress, isLoading: false });
  },

  /**
   * Toggles the completion state of a checklist item in a quest.
   * Updates local state immediately for a responsive UI,
   * then saves progress and awards XP if the item was newly completed.
   */
  toggleItemCompleted: async (userId, questId, categoryId, itemId) => {
    let updatedQuest: Quest | undefined;
    let wasJustCompleted = false;

    // Locally toggle the item for immediate UI response
    const newQuests = get().quests.map((quest) => {
      if (quest.id === questId) {
        const newCategories = quest.categories.map((category) => {
          if (category.title === categoryId) {
            const newItems = category.items.map((item) => {
              if (item.id === itemId) {
                if (!item.completed) wasJustCompleted = true;
                return { ...item, completed: !item.completed };
              }
              return item;
            });
            return { ...category, items: newItems };
          }
          return category;
        });
        updatedQuest = { ...quest, categories: newCategories };
        return updatedQuest;
      }
      return quest;
    });

    set({ quests: newQuests });

    // Save the updated quest to Firestore
    if (updatedQuest) {
      await saveQuestProgress(userId, updatedQuest);

      // If the item was newly completed, award XP and refresh profile
      if (wasJustCompleted) {
        await awardXpForChecklistItem(userId);
        const updatedProfile = await getUserProfile(userId);
        set({ userProfile: updatedProfile });
      }
    }
  },

  /**
   * Updates the userProfile in local state manually.
   */
  updateProfile: (newProfile) => {
    set({ userProfile: newProfile });
  },

  /**
   * Calculates the user's XP progress toward the next level.
   * Returns progress as a percentage and metadata for rendering progress bars.
   */
  getXpBarProgress: () => {
    const profile = get().userProfile;
    if (!profile) return { currentXp: 0, requiredXp: 100, level: 1, progress: 0 };

    const totalXp = profile.xp;
    const level = calculateLevel(totalXp);

    const xpAtPreviousLevel = XP_FOR_NEXT_LEVEL(level - 1);
    const xpAtNextLevel = XP_FOR_NEXT_LEVEL(level);

    const xpThisLevel = totalXp - xpAtPreviousLevel;
    const xpToNext = xpAtNextLevel - xpAtPreviousLevel;

    const rawProgress = xpToNext > 0 ? xpThisLevel / xpToNext : 0;
    const progress = Math.max(0, Math.min(100, Math.round(rawProgress * 100)));

    return {
      currentXp: xpThisLevel,
      requiredXp: xpToNext,
      level,
      progress,
    };
  },
}));