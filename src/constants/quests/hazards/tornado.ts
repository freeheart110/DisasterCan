import type { Quest } from '../types';

/**
 * @file tornado.ts
 * @description Defines the tornado-specific preparedness quest, focusing on common hazards across Canada like tornadoes. 
 * Checklist items are based on official guidance from multiple sources, including Public Safety Canada (getprepared.gc.ca tornado resources), the Canadian Red Cross (severe storms and tornado safety tips), Environment and Climate Change Canada (canada.ca weather hazards), and PreparedBC (severe weather preparedness guide).
 */

export const tornadoQuest: Quest = {
  id: 'hazard-tornado-1',
  title: 'Prepare for Tornadoes',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'tornado-home-1', text: 'Reinforce your home by securing loose items like shingles and fences', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'tornado-home-2', text: 'Trim trees and branches that could break and cause damage', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'tornado-home-3', text: 'Identify a safe room (basement, storm cellar, or interior room without windows)', completed: false }, // Source: Environment and Climate Change Canada (canada.ca)
        { id: 'tornado-home-4', text: 'Secure outdoor furniture, garbage cans, and other loose items', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'tornado-home-5', text: 'Install impact-resistant windows or shutters if in a high-risk area', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'tornado-evac-1', text: 'Develop a family plan with safe spots and emergency contacts', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'tornado-evac-2', text: 'Prepare a grab-and-go bag with essentials like water, food, medications, and documents', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'tornado-evac-3', text: 'Include plans for pets and family members with special needs', completed: false }, // Source: Environment and Climate Change Canada (canada.ca)
        { id: 'tornado-evac-4', text: 'Practice moving to your safe room quickly upon warning', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'tornado-evac-5', text: 'Know community siren systems and evacuation routes if needed', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'tornado-safety-1', text: 'Stock non-perishable food, water (4L per person/day), and a first-aid kit', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'tornado-safety-2', text: 'Have helmets, sturdy shoes, and gloves for protection from debris', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'tornado-safety-3', text: 'Prepare for power outages with flashlights, batteries, and a radio', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'tornado-safety-4', text: 'Stay away from windows, doors, and outside walls during a tornado', completed: false }, // Source: Environment and Climate Change Canada (canada.ca)
        { id: 'tornado-safety-5', text: 'Check on neighbors after the event, avoiding downed power lines', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'tornado-monitor-1', text: 'Sign up for weather alerts and monitor forecasts via apps or radio', completed: false }, // Source: Environment and Climate Change Canada (canada.ca)
        { id: 'tornado-monitor-2', text: 'Review your insurance policy for wind and hail damage coverage', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'tornado-monitor-3', text: 'Document your property with photos and inventory for claims', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'tornado-monitor-4', text: 'Participate in community tornado drills if available', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
      ],
    },
  ],
};

// References
// Canadian Red Cross. (n.d.). Severe storms. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/severe-storms
// Environment and Climate Change Canada. (n.d.). Tornadoes. Canada.ca. https://www.canada.ca/en/services/environment/weather/severeweather/tornadoes.html
// Province of British Columbia. (2024, June 28). Get prepared for severe weather. PreparedBC. https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/know-your-hazards/severe-weather
// Public Safety Canada. (2024, October 9). Prepare for tornadoes. Get Prepared. https://www.getprepared.gc.ca/cnt/hzd/trnds-en.aspx
// Public Safety Canada. (2025, August 6). Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html