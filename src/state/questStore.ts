import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seventyTwoHourKitQuest } from '../constants/quests';
import type { Quest, ChecklistItem } from '../constants/quests';

/**
 * @file questStore.ts
 * @description Manages the global state for all gamified preparedness quests.
 * This store uses Zustand for state management and includes persistence middleware
 * to ensure user progress is saved locally for offline resilience.
 */

// --- STATE AND ACTION DEFINITIONS ---

interface QuestState {
  /** An array holding all quest objects, both common and region-specific. */
  quests: Quest[];
  /** Action to toggle the completion status of a specific checklist item within a quest. */
  toggleItemCompleted: (questId: string, categoryTitle: string, itemId: string) => void;
  /** Selector to compute the completion percentage for a single quest. */
  getQuestProgress: (questId: string) => number;
  /** Selector to compute the average progress across all available quests for the main dashboard. */
  getTotalProgress: () => number;
}

/** Helper type for a category within a Quest object. */
type QuestCategory = {
  title: string;
  items: ChecklistItem[];
}

// --- ZUSTAND STORE IMPLEMENTATION ---

export const useQuestStore = create<QuestState>()(
  // The persist middleware automatically saves and rehydrates the state.
  persist(
    (set, get) => ({
      // The initial state of the store, loaded with the default 72-hour kit quest.
      // On subsequent app loads, this state will be overwritten by data from AsyncStorage.
      quests: [seventyTwoHourKitQuest],

      /**
       * Immutably updates the state by finding a specific quest and checklist item
       * by their IDs and toggling its 'completed' property.
       */
      toggleItemCompleted: (questId: string, categoryTitle: string, itemId: string) => {
        set((state) => {
          const newQuests = state.quests.map(quest => {
            // Find the correct quest to modify based on its unique ID.
            if (quest.id === questId) {
              // A deep copy is created to ensure the original state object is not mutated directly.
              const newQuest = JSON.parse(JSON.stringify(quest));
              const category = newQuest.categories.find((c: QuestCategory) => c.title === categoryTitle);
              if (category) {
                const item = category.items.find((i: ChecklistItem) => i.id === itemId);
                if (item) {
                  item.completed = !item.completed;
                }
              }
              return newQuest;
            }
            return quest; // Return unmodified quests
          });
          return { quests: newQuests };
        });
      },

      /**
       * Calculates the completion percentage for a single quest, identified by its ID.
       * This is used for displaying progress on the "Prepare" screen.
       */
      getQuestProgress: (questId: string) => {
        const { quests } = get();
        const quest = quests.find(q => q.id === questId);
        if (!quest) return 0;

        const allItems = quest.categories.flatMap(c => c.items);
        const completedItems = allItems.filter(item => item.completed);
        if (allItems.length === 0) return 0;
        return Math.round((completedItems.length / allItems.length) * 100);
      },

      /**
       * Calculates the overall preparedness score by averaging the progress
       * of all quests. This is used for the main progress bar on the Dashboard.
       */
      getTotalProgress: () => {
        const { quests } = get();
        if (quests.length === 0) return 0;

        const totalProgressSum = quests.reduce((sum, quest) => {
          const allItems = quest.categories.flatMap(c => c.items);
          const completedItems = allItems.filter(item => item.completed);
          const progress = allItems.length > 0 ? (completedItems.length / allItems.length) : 0;
          return sum + progress;
        }, 0);

        return Math.round((totalProgressSum / quests.length) * 100);
      }
    }),
    {
      // Configuration for the persistence middleware.
      name: 'disastercan-quest-storage', // The key used to store the data in AsyncStorage.
      storage: createJSONStorage(() => AsyncStorage), // Specifies AsyncStorage as the storage engine.
    }
  )
);
