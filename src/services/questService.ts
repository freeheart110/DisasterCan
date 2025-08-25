import { seventyTwoHourKitQuest } from '../constants/quests/common/seventyTwoHourKit';
import { familyPlanQuest } from '../constants/quests/common/familyPlan';
import type { Quest } from '../constants/quests/types';

/**
 * @file questService.ts
 * @description This service is responsible for loading the preparedness quests.
 */

/**
 * Fetches the list of common quests available to all users.
 * @returns A promise that resolves to an array of Quest objects.
 */
export const loadCommonQuests = async (): Promise<Quest[]> => {
  // For now, we will just return a static list of all common quests.
  const commonQuests = [seventyTwoHourKitQuest, familyPlanQuest];
  
  // We can add the dynamic, location-based logic back in later.
  return commonQuests;
};
