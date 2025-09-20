import type { Quest } from '../questConfig';

/**
 * @file wildfire_smoke.ts
 * @description Defines the wildfire smoke and air quality-specific preparedness quest, focusing on hazards related to poor air quality from wildfires across Canada. 
 * Checklist items are based on official guidance from multiple sources, including Public Health Canada (wildfire smoke toolkit), Health Canada (guidance for cleaner air spaces), and the Canadian Red Cross (breathing emergencies from smoke).
 */

export const wildfireSmokeQuest: Quest = {
  id: 'hazard-wildfire-smoke-1',
  title: 'Prepare for Wildfire Smoke and Air Quality Issues',
  format: 'checklist',
  category: 'hazard',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'smoke-home-1', text: 'Seal doors, windows, and vents with weather stripping or tape to prevent smoke entry', completed: false, expiryDays: 180 }, // Source: Health Canada (canada.ca)
        { id: 'smoke-home-2', text: 'Install or upgrade air filters (HEPA or MERV 13+) in HVAC systems', completed: false, expiryDays: 365 }, // Source: Public Health Canada (canada.ca)
        { id: 'smoke-home-3', text: 'Create a clean air room with a portable air purifier and no outdoor air intake', completed: false, expiryDays: 365 }, // Source: Health Canada (canada.ca)
        { id: 'smoke-home-4', text: 'Avoid using exhaust fans, fireplaces, or dryers that pull in outdoor air', completed: false, expiryDays: 90 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-home-5', text: 'Keep indoor humidity between 30-50% to reduce irritation from dry air', completed: false, expiryDays: 90 }, // Source: Public Health Canada (canada.ca)
      ],
    },
    {
      title: '🛡️ Personal Health',
      items: [
        { id: 'smoke-health-1', text: 'Stock N95 or P100 masks/respirators for outdoor exposure (fit-tested if possible)', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-health-2', text: 'Stay hydrated and avoid strenuous activities during poor air quality', completed: false, expiryDays: 30 }, // Source: Public Health Canada (canada.ca)
        { id: 'smoke-health-3', text: 'Recognize symptoms of smoke exposure (cough, dizziness, headache) and seek medical help', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-health-4', text: 'Limit time outdoors and schedule activities for times with better air quality', completed: false, expiryDays: 30 }, // Source: Health Canada (canada.ca)
        { id: 'smoke-health-5', text: 'Use eye drops and nasal sprays to relieve irritation from smoke', completed: false, expiryDays: 180 }, // Source: Public Health Canada (canada.ca)
      ],
    },
    {
      title: '📋 Planning for Vulnerable',
      items: [
        { id: 'smoke-plan-1', text: 'Identify at-risk individuals (elderly, children, those with respiratory conditions)', completed: false, expiryDays: 365 }, // Source: Public Health Canada (canada.ca)
        { id: 'smoke-plan-2', text: 'Check on neighbors and family regularly during smoke events', completed: false, expiryDays: 30 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-plan-3', text: 'Prepare relocation options (e.g., to air-conditioned public spaces) for severe episodes', completed: false, expiryDays: 365 }, // Source: Health Canada (canada.ca)
        { id: 'smoke-plan-4', text: 'Stock medications like inhalers and ensure access to medical support', completed: false, expiryDays: 90 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-plan-5', text: 'Plan for pets (keep indoors, provide cool areas and water)', completed: false, expiryDays: 90 }, // Source: Public Health Canada (canada.ca)
      ],
    },
    {
      title: '📡 Monitoring & Response',
      items: [
        { id: 'smoke-monitor-1', text: 'Sign up for air quality alerts and monitor indices (e.g., AQHI) via apps or websites', completed: false, expiryDays: 90 }, // Source: Health Canada (canada.ca)
        { id: 'smoke-monitor-2', text: 'Have a battery-powered air quality monitor for indoor checks', completed: false, expiryDays: 365 }, // Source: Public Health Canada (canada.ca)
        { id: 'smoke-monitor-3', text: 'Prepare for power outages with batteries and portable purifiers', completed: false, expiryDays: 180 }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'smoke-monitor-4', text: 'Participate in community air quality programs or wildfire smoke response plans', completed: false, expiryDays: 365 }, // Source: Health Canada (canada.ca)
      ],
    },
  ],
};

// References
// Government of Canada. (2024, July 15). Wildfires in Canada: Toolkit for Public Health Authorities. Canada.ca. https://www.canada.ca/en/public-health/services/publications/healthy-living/wildfires-canada-toolkit-public-health-authorities.html
// Health Canada. (2024, June 20). Guidance for Cleaner Air Spaces during Wildfire Smoke Events. Canada.ca. https://www.canada.ca/en/health-canada/services/publications/healthy-living/guidance-cleaner-air-spaces-during-wildfire-smoke-events.html
// Canadian Red Cross. (2024, May 16). Breathing Emergencies: Wildfire Smoke and Poor Air Quality. Redcross.ca. https://www.redcross.ca/blog/2024/5/breathing-emergencies-wildfire-smoke-and-poor-air-quality