import type { Quest } from '../types';

/**
 * @file heatwave.ts
 * @description Defines the heatwave-specific preparedness quest, focusing on common hazards across Canada like extreme heat events. 
 * Checklist items are based on official guidance from multiple sources, including Health Canada (canada.ca extreme heat protection), the Canadian Red Cross (heat wave safety tips), and BC Centre for Disease Control (bccdc.ca heat event preparation).
 */

export const heatwaveQuest: Quest = {
  id: 'hazard-heatwave-1',
  title: 'Prepare for Heatwaves',
  categories: [
    {
      title: '🏠 Home Cooling',
      items: [
        { id: 'heatwave-home-1', text: 'Install fans, air conditioning, or heat pumps if possible', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-home-2', text: 'Use blinds, curtains, or reflective coverings on windows to block sunlight', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'heatwave-home-3', text: 'Insulate your home and seal drafts to maintain cool air', completed: false }, // Source: BC Centre for Disease Control (bccdc.ca)
        { id: 'heatwave-home-4', text: 'Create cross-breezes by opening windows at night when cooler', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-home-5', text: 'Avoid using heat-generating appliances like ovens during peak heat', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '🛡️ Personal Health',
      items: [
        { id: 'heatwave-health-1', text: 'Stay hydrated by drinking plenty of water (avoid caffeine and alcohol)', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-health-2', text: 'Wear lightweight, light-colored, loose-fitting clothing', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'heatwave-health-3', text: 'Apply sunscreen and stay in shade during outdoor activities', completed: false }, // Source: BC Centre for Disease Control (bccdc.ca)
        { id: 'heatwave-health-4', text: 'Recognize signs of heat illness (dizziness, nausea) and seek cool areas', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-health-5', text: 'Schedule strenuous activities for cooler times of day', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📋 Planning for Vulnerable',
      items: [
        { id: 'heatwave-plan-1', text: 'Identify at-risk individuals (elderly, children, those with chronic illnesses)', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-plan-2', text: 'Check on neighbors, family, and friends regularly during heat events', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'heatwave-plan-3', text: 'Prepare cooling options for pets (shade, water, avoid hot pavement)', completed: false }, // Source: BC Centre for Disease Control (bccdc.ca)
        { id: 'heatwave-plan-4', text: 'Know locations of public cooling centers or air-conditioned spaces', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-plan-5', text: 'Stock medications and ensure access to medical help if needed', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📡 Monitoring & Insurance',
      items: [
        { id: 'heatwave-monitor-1', text: 'Sign up for heat alerts and monitor weather forecasts via apps or radio', completed: false }, // Source: Health Canada (canada.ca)
        { id: 'heatwave-monitor-2', text: 'Review insurance for heat-related damage (e.g., to AC units or spoiled food)', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'heatwave-monitor-3', text: 'Prepare for power outages with batteries and portable fans', completed: false }, // Source: BC Centre for Disease Control (bccdc.ca)
        { id: 'heatwave-monitor-4', text: 'Participate in community heat response programs if available', completed: false }, // Source: Health Canada (canada.ca)
      ],
    },
  ],
};

// References
// BC Centre for Disease Control. (n.d.). Preparing for heat events. BCCDC. https://www.bccdc.ca/health-info/prevention-public-health/preparing-for-heat-events
// Canadian Red Cross. (n.d.). Heat waves. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/types-of-emergencies/heat-waves
// Health Canada. (2024, July 22). How to protect yourself from the health effects of extreme heat. Canada.ca. https://www.canada.ca/en/health-canada/services/climate-change-health/extreme-heat/how-protect-yourself.html
// Health Canada. (2024, May 7). Extreme heat events: Overview. Canada.ca. https://www.canada.ca/en/health-canada/services/climate-change-health/extreme-heat.html
// Public Safety Canada. (2025, August 6). Get prepared. Canada.ca. https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared.html