import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadQuestsForProvince } from '../services/questService';
import type { Quest } from '../constants/quests/types';

// Defines the shape of the Zustand store, including its state and actions.
interface QuestState {
  quests: Quest[];
  isLoading: boolean;
  initializeQuests: (provinceCode: string) => Promise<void>;
  toggleItemCompleted: (questId: string, categoryId: string, itemId: string) => void;
  getQuestProgress: (questId: string) => number;
  getTotalProgress: () => number;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      isLoading: true,
      
      initializeQuests: async (provinceCode: string) => {
        const loadedQuests = loadQuestsForProvince(provinceCode);
        set({ quests: loadedQuests, isLoading: false });
      },

      toggleItemCompleted: (questId, categoryId, itemId) => {
        set(state => {
          const newQuests = state.quests.map(quest => {
            if (quest.id === questId) {
              const newCategories = quest.categories.map(category => {
                if (category.title === categoryId) {
                  const newItems = category.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, completed: !item.completed };
                    }
                    return item;
                  });
                  return { ...category, items: newItems };
                }
                return category;
              });
              return { ...quest, categories: newCategories };
            }
            return quest;
          });
          return { quests: newQuests };
        });
      },

      getQuestProgress: (questId) => {
        const quest = get().quests.find(q => q.id === questId);
        if (!quest) return 0;
        
        let totalItems = 0;
        let completedItems = 0;
        quest.categories.forEach(category => {
          totalItems += category.items.length;
          completedItems += category.items.filter(item => item.completed).length;
        });

        if (totalItems === 0) return 0;
        return Math.round((completedItems / totalItems) * 100);
      },

      getTotalProgress: () => {
        const { quests } = get();
        if (quests.length === 0) return 0;

        const totalProgressSum = quests.reduce((sum, quest) => {
          return sum + get().getQuestProgress(quest.id);
        }, 0);

        return Math.round(totalProgressSum / quests.length);
      },
    }),
    {
      name: 'disastercan-quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

