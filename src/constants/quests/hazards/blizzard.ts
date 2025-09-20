import type { Quest } from '../questConfig';

/**
 * @file blizzard.ts
 * @description Defines the blizzard-specific preparedness quest, focusing on common hazards across Canada like blizzards. 
 * Checklist items are based on official guidance from multiple sources, including Public Safety Canada (getprepared.gc.ca winter weather resources), the Canadian Red Cross (winter storms checklists), and PreparedBC (winter weather preparedness guide).
 */

export const blizzardQuest: Quest = {
  id: 'hazard-blizzard-1',
  title: 'Prepare for Blizzards',
  format: 'checklist',
  category: 'hazard',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'blizzard-home-1', text: 'Insulate pipes and seal drafts to prevent freezing', completed: false, expiryDays: 30 }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'blizzard-home-2', text: 'Clear snow from roofs and around your home to prevent buildup', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-home-3', text: 'Install snow fences or barriers to reduce drifting snow', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-home-4', text: 'Stock alternative heating sources like wood stoves (with proper ventilation)', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
        { id: 'blizzard-home-5', text: 'Have shovels, ice melt, and roof rakes ready for snow removal', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'blizzard-evac-1', text: 'Develop a family plan for staying put or evacuating if needed', completed: false, expiryDays: 30 }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'blizzard-evac-2', text: 'Prepare a vehicle emergency kit with blankets, food, and flares', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-evac-3', text: 'Know how to shut off utilities in case of damage', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
        { id: 'blizzard-evac-4', text: 'Identify safe shelters or warming centers in your area', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-evac-5', text: 'Practice dressing in layers and using emergency signals', completed: false, expiryDays: 30 }, // Source: Public Safety Canada (getprepared.gc.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'blizzard-safety-1', text: 'Stock non-perishable food, water (4L per person/day), and medications for at least 72 hours', completed: false, expiryDays: 30 }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'blizzard-safety-2', text: 'Have blankets, warm clothing, and hand warmers for extreme cold', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-safety-3', text: 'Prepare for power outages with flashlights, batteries, and a crank radio', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
        { id: 'blizzard-safety-4', text: 'Avoid travel; if stranded in a vehicle, stay inside and run the engine sparingly', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-safety-5', text: 'Check on vulnerable neighbors, especially the elderly or those with medical needs', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'blizzard-monitor-1', text: 'Sign up for weather alerts and monitor forecasts via apps or radio', completed: false, expiryDays: 30 }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'blizzard-monitor-2', text: 'Review insurance for winter storm damage coverage', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'blizzard-monitor-3', text: 'Document your property with photos for potential claims', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
        { id: 'blizzard-monitor-4', text: 'Install winter tires and keep your vehicle maintained', completed: false, expiryDays: 30 }, // Source: PreparedBC (preparedbc.ca)
      ],
    },
  ],
};

// References
// Canadian Red Cross. (n.d.). Winter storms. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/winter-storms
// Environment and Climate Change Canada. (2018, August 23). Be prepared for winter weather. Canada.ca. https://www.canada.ca/en/environment-climate-change/services/seasonal-weather-hazards/be-prepared-for-winter.html
// Province of British Columbia. (2024, December 24). Get prepared for winter weather and storms. PreparedBC. https://www.preparedbc.ca/WinterWeather
// Public Safety Canada. (2005). Your emergency preparedness guide. Publications.gc.ca. https://publications.gc.ca/collections/Collection/PS4-26-2005E.pdf
// Public Safety Canada. (2025, August 6). Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html10