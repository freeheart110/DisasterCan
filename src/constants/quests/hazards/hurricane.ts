import type { Quest } from '../questConfig';

/**
 * @file hurricane.ts
 * @description Defines the hurricane-specific preparedness quest, focusing on common hazards across Canada like hurricanes (often as post-tropical storms). 
 * Checklist items are based on official guidance from multiple sources, including Public Safety Canada (getprepared.gc.ca hurricane resources), the Canadian Red Cross (hurricane safety tips), and Government of Nova Scotia (hurricane support checklists).
 */

export const hurricaneQuest: Quest = {
  id: 'hazard-hurricane-1',
  title: 'Prepare for Hurricanes',
  format: 'checklist',
  category: 'hazard',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'hurricane-home-1', text: 'Secure outdoor items like furniture, garbage bins, and planters to prevent them becoming projectiles', completed: false, expiryDays: 90 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-home-2', text: 'Trim trees and branches that could fall on your home or power lines', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'hurricane-home-3', text: 'Install storm shutters or board up windows with plywood', completed: false, expiryDays: 365 }, // Source: Government of Nova Scotia (novascotia.ca)
        { id: 'hurricane-home-4', text: 'Clear gutters and drains to prevent water buildup', completed: false, expiryDays: 180 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-home-5', text: 'Reinforce garage doors and check roof for loose shingles', completed: false, expiryDays: 365 }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'hurricane-evac-1', text: 'Know your evacuation zone and routes, especially in coastal areas prone to storm surges', completed: false, expiryDays: 365 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-evac-2', text: 'Prepare a grab-and-go bag with essentials like water, food, medications, and documents', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'hurricane-evac-3', text: 'Include plans for pets and family members with special needs', completed: false, expiryDays: 180 }, // Source: Government of Nova Scotia (novascotia.ca)
        { id: 'hurricane-evac-4', text: 'Practice your evacuation plan and know how to shut off utilities', completed: false, expiryDays: 180 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-evac-5', text: 'Fill your vehicle with gas and have cash on hand for travel', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'hurricane-safety-1', text: 'Stock non-perishable food, water (4L per person/day), and a first-aid kit for at least 72 hours', completed: false, expiryDays: 180 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-safety-2', text: 'Have flashlights, batteries, and a battery-powered radio for power outages', completed: false, expiryDays: 365 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'hurricane-safety-3', text: 'Stay indoors away from windows during the storm', completed: false, expiryDays: 30 }, // Source: Government of Nova Scotia (novascotia.ca)
        { id: 'hurricane-safety-4', text: 'Avoid using candles; use battery-powered lights to prevent fires', completed: false, expiryDays: 90 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-safety-5', text: 'Check on vulnerable neighbors before and after the storm', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'hurricane-monitor-1', text: 'Sign up for weather alerts and monitor forecasts via apps or radio', completed: false, expiryDays: 90 }, // Source: Public Safety Canada (canada.ca)
        { id: 'hurricane-monitor-2', text: 'Review your insurance policy for wind, water, and flood damage coverage', completed: false, expiryDays: 365 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'hurricane-monitor-3', text: 'Document your property with photos and inventory for claims', completed: false, expiryDays: 365 }, // Source: Government of Nova Scotia (novascotia.ca)
        { id: 'hurricane-monitor-4', text: 'Participate in community hurricane preparedness programs if available', completed: false, expiryDays: 365 }, // Source: Public Safety Canada (canada.ca)
      ],
    },
  ],
};

// References
// Canadian Red Cross. (n.d.). Hurricanes. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/hurricanes
// Government of Nova Scotia. (n.d.). Hurricane emergency updates and support. Nova Scotia. https://novascotia.ca/hurricane-support/
// Public Safety Canada. (2024, October 9). Prepare for hurricanes. Get Prepared. https://www.getprepared.gc.ca/cnt/hzd/hrcns-en.aspx
// Public Safety Canada. (2005). Your emergency preparedness guide. Publications.gc.ca. https://publications.gc.ca/collections/Collection/PS4-26-2005E.pdf
// Public Safety Canada. (2025, August 6). Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html