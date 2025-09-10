import { wildfireQuest } from './hazards/wildfire';
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
  // Provinces with high wildfire risk
  'AB': [wildfireQuest],
  'BC': [wildfireQuest],
  'SK': [wildfireQuest],
  'NT': [wildfireQuest],
  'YT': [wildfireQuest],

};
