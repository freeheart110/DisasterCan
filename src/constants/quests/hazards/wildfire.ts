import type { Quest } from '../questConfig';

/**
 * @file wildfire.ts
 * @description Defines the wildfire-specific preparedness quest, focusing on common hazards across Canada like wildfires. 
 * Checklist items are based on official guidance from multiple sources, including FireSmart Canada/BC (emergency preparedness checklist), Alberta.ca (wildfire preparedness guidelines), and the Canadian Red Cross (wildfire safety tips).
 */

export const wildfireQuest: Quest = {
  id: 'hazard-wildfire-1',
  title: 'Prepare for Wildfires',
  format: 'checklist',
  category: 'hazard',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'wildfire-home-1', text: 'Create a 10-30 meter defensible space by clearing flammable vegetation around your home', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
        { id: 'wildfire-home-2', text: 'Use fire-resistant materials for roofing, siding, and decks', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca) and Alberta.ca
        { id: 'wildfire-home-3', text: 'Install spark arrestors on chimneys and clean gutters of debris', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'wildfire-home-4', text: 'Move firewood, propane tanks, and combustibles at least 10 meters from your home', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
        { id: 'wildfire-home-5', text: 'Seal vents and eaves to prevent embers from entering', completed: false, expiryDays: 180 }, // Source: Alberta.ca
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'wildfire-evac-1', text: 'Develop a family evacuation plan with multiple routes and meeting points', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca) and Public Safety Canada (canada.ca)
        { id: 'wildfire-evac-2', text: 'Prepare a grab-and-go bag with essentials like water, food, medications, and documents', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
        { id: 'wildfire-evac-3', text: 'Include pet supplies and plans for animals in your evacuation strategy', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'wildfire-evac-4', text: 'Practice your evacuation plan and know how to shut off utilities', completed: false, expiryDays: 180 }, // Source: Alberta.ca
        { id: 'wildfire-evac-5', text: 'Keep your vehicle fueled and parked facing the exit for quick departure', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'wildfire-safety-1', text: 'Stock N95 masks or respirators to protect against smoke inhalation', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'wildfire-safety-2', text: 'Monitor air quality and stay indoors during heavy smoke', completed: false, expiryDays: 180 }, // Source: Alberta.ca
        { id: 'wildfire-safety-3', text: 'Have a battery-powered or hand-crank radio for updates', completed: false, expiryDays: 180 }, // Source: Public Safety Canada (canada.ca)
        { id: 'wildfire-safety-4', text: 'Prepare for power outages with flashlights, batteries, and portable chargers', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
        { id: 'wildfire-safety-5', text: 'Check on vulnerable neighbors during heat and smoke events', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'wildfire-monitor-1', text: 'Sign up for local alert systems and monitor wildfire apps or websites', completed: false, expiryDays: 180 }, // Source: Alberta.ca and Public Safety Canada (canada.ca)
        { id: 'wildfire-monitor-2', text: 'Review your insurance policy for wildfire coverage', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
        { id: 'wildfire-monitor-3', text: 'Document your property with photos for insurance claims', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'wildfire-monitor-4', text: 'Participate in community FireSmart programs if available', completed: false, expiryDays: 180 }, // Source: FireSmart Canada (firesmartcanada.ca)
      ],
    },
  ],
};

// References
// Canadian Red Cross. (2019, March 21). Be ready for flooding checklist. Canadian Red Cross. https://www.redcross.ca/blog/2019/3/be-ready-for-flooding-checklist
// Canadian Red Cross. (2025, March 27). How to prepare for floods: A step-by-step guide. Canadian Red Cross. https://www.redcross.ca/blog/2025/3/how-to-prepare-for-floods-a-step-by-step-guide
// Public Safety Canada. (2024, October 9). Prepare for floods. Get Prepared. https://www.getprepared.gc.ca/cnt/hzd/flds-en.aspx
// Public Safety Canada. (2025, August 6). Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html
// Province of British Columbia. (n.d.). Flood preparedness guide. PreparedBC. https://www2.gov.bc.ca/assets/gov/public-safety-and-emergency-services/emergency-preparedness-response-recovery/embc/preparedbc/preparedbc-guides/preparedbc_flood_preparedness_guide_fillable.pdf