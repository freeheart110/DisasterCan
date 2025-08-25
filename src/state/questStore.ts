import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCommonQuests } from '../services/questService'; // Use the new simplified function
import type { Quest, ChecklistItem } from '../constants/quests/types';

// --- STATE AND ACTION DEFINITIONS ---
interface QuestState {
  quests: Quest[];
  isLoading: boolean;
  initializeQuests: () => Promise<void>; // No longer needs a province parameter
  toggleItemCompleted: (questId: string, categoryTitle: string, itemId: string) => void;
  getQuestProgress: (questId: string) => number;
  getTotalProgress: () => number;
}

type QuestCategory = {
  title: string;
  items: ChecklistItem[];
}

// --- ZUSTAND STORE IMPLEMENTATION ---
export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      isLoading: true,

      /**
       * Asynchronously loads the common quests and populates the store.
       */
      initializeQuests: async () => {
        if (get().quests.length === 0) {
          const loadedQuests = await loadCommonQuests();
          set({ quests: loadedQuests, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      toggleItemCompleted: (questId: string, categoryTitle: string, itemId: string) => {
        set((state) => {
          const newQuests = state.quests.map(quest => {
            if (quest.id === questId) {
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
            return quest;
          });
          return { quests: newQuests };
        });
      },

      getQuestProgress: (questId: string) => {
        const { quests } = get();
        const quest = quests.find(q => q.id === questId);
        if (!quest) return 0;
        const allItems = quest.categories.flatMap(c => c.items);
        const completedItems = allItems.filter(item => item.completed);
        if (allItems.length === 0) return 0;
        return Math.round((completedItems.length / allItems.length) * 100);
      },

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
      name: 'disastercan-quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ quests: state.quests }),
    }
  )
);
