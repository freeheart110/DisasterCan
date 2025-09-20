import { wildfireSmokeQuest } from './hazards/wildfire_smoke';
import { wildfireQuest } from './hazards/wildfire';
import { blizzardQuest } from './hazards/blizzard';
import { floodQuest } from './hazards/flood';
import { earthquakeQuest } from './hazards/earthquake';
import { tornadoQuest } from './hazards/tornado';
import { hurricaneQuest } from './hazards/hurricane';
import { heatwaveQuest } from './hazards/heatwave';

import type { Quest } from './questConfig';

/**
 * @file hazardMap.ts
 * @description Maps province codes to their relevant hazard-specific quests.
 * This is the single source of truth for regional personalization.
 */

export const hazardMap: Record<string, Quest[]> = {
  // British Columbia
  'BC': [
    wildfireQuest,
    wildfireSmokeQuest,
    earthquakeQuest,
    floodQuest,
    heatwaveQuest,
  ],

  // Alberta
  'AB': [
    wildfireQuest,
    wildfireSmokeQuest,
    tornadoQuest,
    floodQuest,
    blizzardQuest,
    heatwaveQuest,
  ],

  // Saskatchewan
  'SK': [
    wildfireSmokeQuest,
    tornadoQuest,
    floodQuest,
    blizzardQuest,
    heatwaveQuest,
  ],

  // Manitoba
  'MB': [
    wildfireSmokeQuest,
    tornadoQuest,
    floodQuest,
    blizzardQuest,
    heatwaveQuest,
  ],

  // Ontario
  'ON': [
    wildfireSmokeQuest,
    tornadoQuest,
    floodQuest,
    blizzardQuest,
    heatwaveQuest,
  ],

  // Quebec
  'QC': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
    heatwaveQuest,
  ],

  // New Brunswick
  'NB': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
    hurricaneQuest,
    heatwaveQuest,
  ],

  // Nova Scotia
  'NS': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
    hurricaneQuest,
    heatwaveQuest,
  ],

  // Prince Edward Island
  'PE': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
    hurricaneQuest,
    heatwaveQuest,
  ],

  // Newfoundland and Labrador
  'NL': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
    hurricaneQuest,
    heatwaveQuest,
  ],

  // Yukon
  'YT': [
    wildfireQuest,
    wildfireSmokeQuest,
    earthquakeQuest,
    floodQuest,
    blizzardQuest,
  ],

  // Northwest Territories
  'NT': [
    wildfireQuest,
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
  ],

  // Nunavut
  'NU': [
    wildfireSmokeQuest,
    floodQuest,
    blizzardQuest,
  ],
};