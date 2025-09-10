/**
 * @file alertQuestMap.ts
 * @description Maps alert event types from CAP files to their corresponding quest IDs.
 * This is the central logic for linking live alerts to actionable preparedness quests.
 * Note: The event keys (e.g., 'wildfire') should be lowercase to match the parsed CAP data.
 */

export const alertToQuestMap: Record<string, string> = {
  'wildfire': 'hazard-wildfire-1',
  // Future mappings can be added here
  // 'flood': 'hazard-flood-1',
  // 'thunderstorm': 'hazard-storm-1',
};
