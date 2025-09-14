/**
 * @file alertQuestMap.ts
 * @description Maps alert event types from CAP files to their corresponding quest IDs.
 * This is the central logic for linking live alerts to actionable preparedness quests.
 * Note: The event keys (e.g., 'wildfire') should be lowercase to match the parsed CAP data.
 */

export const alertQuestMap: Record<string, string> = {
  'blizzard': 'hazard-blizzard-1',
  'winter storm': 'hazard-blizzard-1',
  'earthquake': 'hazard-earthquake-1',
  'flood': 'hazard-flood-1',

  'heat warning': 'hazard-heatwave-1',
  'hurricane': 'hazard-hurricane-1',
  'tornado': 'hazard-tornado-1',
  'wildfire': 'hazard-wildfire-1', 
  'air quality': 'hazard-wildfire-smoke-1', 
};

