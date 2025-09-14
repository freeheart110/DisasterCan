import { wildfireSmokeQuest } from './hazards/wildfire_smoke';
// Import other hazard quests here in the future
// import { blizzardQuest } from './hazards/blizzard';

import type { Quest } from './types';

/**
 * @file hazardMap.ts
 * @description Maps province codes to their relevant hazard-specific quests.
 * This is the single source of truth for regional personalization.
 */

// A map where the key is the 2-letter province code and the value is an array of quest objects.
export const hazardMap: Record<string, Quest[]> = {
  // Provinces with significant wildfire risk now map to the wildfire quest.
  'AB': [wildfireSmokeQuest],
  'BC': [wildfireSmokeQuest],
  'SK': [wildfireSmokeQuest],
  'MB': [wildfireSmokeQuest],
  'NT': [wildfireSmokeQuest],
  'YT': [wildfireSmokeQuest],
};
