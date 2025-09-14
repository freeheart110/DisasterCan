import { familyPlanQuest } from '../constants/quests/common/familyPlan';
import { seventyTwoHourKitQuest } from '../constants/quests/common/seventyTwoHourKit';
import { hazardMap } from '../constants/quests/hazardRegionMap';
import type { Quest } from '../constants/quests/types';

/**
 * @file questService.ts
 * @description A service responsible for dynamically loading the correct set of quests
 * based on the user's location (province).
 */

/**
 * Loads all quests that are common to every user in Canada.
 * @returns An array of common quest objects.
 */
const loadCommonQuests = (): Quest[] => {
  return [seventyTwoHourKitQuest, familyPlanQuest];
};

/**
 * Dynamically loads all relevant quests for a given province.
 * It combines the common quests with any hazard-specific quests from the hazardMap.
 * @param {string} provinceCode - The 2-letter postal code for the user's province (e.g., "SK").
 * @returns {Quest[]} An array of all relevant quest objects for that province.
 */
export const loadQuestsForProvince = (provinceCode: string): Quest[] => {
  // Always start with the quests that are common to all Canadians.
  const commonQuests = loadCommonQuests();

  // Look up the province code in the hazard map to find any relevant hazard quests.
  // If the province isn't in the map, default to an empty array.
  const regionalHazardQuests = hazardMap[provinceCode] || [];
  console.log("Province passed to loadQuestsForProvince:", provinceCode);
  console.log("Regional hazard quests:", regionalHazardQuests.map(q => q.id));
  // Combine the common and regional quests into a single list.
  return [...commonQuests, ...regionalHazardQuests];
};

