import type { Quest } from '../types';

/**
 * @file earthquake.ts
 * @description Defines the earthquake-specific preparedness quest, focusing on common hazards across Canada like earthquakes. 
 * Checklist items are based on official guidance from multiple sources, including Public Safety Canada (getprepared.gc.ca earthquake resources), the Canadian Red Cross (earthquake safety tips), Natural Resources Canada (earthquakescanada.nrcan.gc.ca), and PreparedBC (earthquake preparedness guide).
 */

export const earthquakeQuest: Quest = {
  id: 'hazard-earthquake-1',
  title: 'Prepare for Earthquakes',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'earthquake-home-1', text: 'Secure heavy furniture, appliances, and shelves to walls to prevent tipping', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'earthquake-home-2', text: 'Install latches on cabinets and secure hanging items like pictures or mirrors', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'earthquake-home-3', text: 'Identify and fix potential hazards like unsecured water heaters or gas lines', completed: false }, // Source: Natural Resources Canada (earthquakescanada.nrcan.gc.ca)
        { id: 'earthquake-home-4', text: 'Know how to shut off utilities (gas, water, electricity) post-earthquake', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'earthquake-home-5', text: 'Conduct a home hazard hunt and retrofit if in a high-risk area', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'earthquake-evac-1', text: 'Develop a family emergency plan with reunion points and out-of-area contacts', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'earthquake-evac-2', text: 'Prepare a grab-and-go bag with essentials like water, food, medications, and documents', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'earthquake-evac-3', text: 'Include plans for pets and family members with special needs', completed: false }, // Source: Natural Resources Canada (earthquakescanada.nrcan.gc.ca)
        { id: 'earthquake-evac-4', text: 'Practice "Drop, Cover, and Hold On" drills regularly', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'earthquake-evac-5', text: 'Know tsunami evacuation routes if in a coastal area', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'earthquake-safety-1', text: 'Stock non-perishable food, water (4L per person/day), and a first-aid kit for 72 hours', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'earthquake-safety-2', text: 'Have flashlights, batteries, and a battery-powered radio for aftershocks', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'earthquake-safety-3', text: 'Wear sturdy shoes and gloves to protect against debris post-earthquake', completed: false }, // Source: Natural Resources Canada (earthquakescanada.nrcan.gc.ca)
        { id: 'earthquake-safety-4', text: 'Avoid elevators, bridges, and overpasses during and after shaking', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'earthquake-safety-5', text: 'Check on neighbors, especially vulnerable individuals, after the event', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'earthquake-monitor-1', text: 'Sign up for earthquake alerts and early warning systems where available', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'earthquake-monitor-2', text: 'Review your insurance policy for earthquake coverage', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'earthquake-monitor-3', text: 'Document your property with photos and inventory for claims', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'earthquake-monitor-4', text: 'Participate in community earthquake drills or Great ShakeOut events', completed: false }, // Source: Natural Resources Canada (earthquakescanada.nrcan.gc.ca)
      ],
    },
  ],
};

// References
// Canadian Red Cross. (n.d.). Earthquakes: Before, during & after. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/earthquakes
// Natural Resources Canada. (n.d.). Preparing for earthquakes. Earthquakes Canada. https://www.earthquakescanada.nrcan.gc.ca/info-gen/prepare-preparer/index-en.php
// Province of British Columbia. (2025, September 2). Get prepared for an earthquake. PreparedBC. https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/know-your-hazards/earthquakes-tsunamis/earthquakes
// Public Safety Canada. (2005). Your emergency preparedness guide. Publications.gc.ca. https://publications.gc.ca/collections/Collection/PS4-26-2005E.pdf
// Public Safety Canada. (2025, August 6). Earthquakes – Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/earthquakes/how-prepare.html