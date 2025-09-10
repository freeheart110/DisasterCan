import type { Quest } from '../types';

/**
 * @file wildfire.ts
 * @description Defines the reusable "Wildfire Preparedness" quest.
 * This single file will be used for any province that faces a wildfire risk.
 */

export const wildfireQuest: Quest = {
  id: 'hazard-wildfire-1', // A generic ID
  title: 'Wildfire Preparedness',
  categories: [
    {
      title: '🔥 Create a FireSmart Home',
      items: [
        { id: 'wf-fs-1', text: 'Move firewood piles at least 10 metres away from your home', completed: false },
        { id: 'wf-fs-2', text: 'Clean roof and gutters of pine needles and dry leaves', completed: false },
        { id: 'wf-fs-3', text: 'Mow grass and weeds within 10 metres of the house', completed: false },
        { id: 'wf-fs-4', text: 'Ensure driveway is wide enough for emergency vehicle access', completed: false },
        { id: 'wf-fs-5', text: 'Store propane tanks and flammable materials away from the house', completed: false },
      ],
    },
    {
      title: '💨 Prepare for Smoke',
      items: [
        { id: 'wf-smoke-1', text: 'Have a supply of N95 masks for all household members', completed: false },
        { id: 'wf-smoke-2', text: 'Use a portable air cleaner with a HEPA filter indoors', completed: false },
        { id: 'wf-smoke-3', text: 'Know how to set your home\'s HVAC system to recirculate air', completed: false },
        { id: 'wf-smoke-4', text: 'Seal windows and doors with tape or towels if smoke is heavy', completed: false },
      ],
    },
    {
      title: '🏃 Evacuation Readiness',
      items: [
        { id: 'wf-evac-1', text: 'Include N95 masks and goggles in your 72-hour kit', completed: false },
        { id: 'wf-evac-2', text: 'Plan and practice your primary and secondary evacuation routes', completed: false },
        { id: 'wf-evac-3', text: 'Arrange a place to stay with family or friends outside the risk area', completed: false },
        { id: 'wf-evac-4', text: 'Keep your vehicle\'s gas tank at least half full during wildfire season', completed: false },
      ],
    },
  ],
};
