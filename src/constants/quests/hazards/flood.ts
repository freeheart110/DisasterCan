import type { Quest } from '../types';

/**
 * @file flood.ts
 * @description Defines the flood-specific preparedness quest, focusing on common hazards across Canada like floods. 
 * Checklist items are based on official guidance from multiple sources, including the Canadian Red Cross (flood preparedness checklists), PreparedBC (flood preparedness guide), and Public Safety Canada (getprepared.gc.ca flood resources).
 */

export const floodQuest: Quest = {
  id: 'hazard-flood-1',
  title: 'Prepare for Floods',
  categories: [
    {
      title: '🏠 Home Protection',
      items: [
        { id: 'flood-home-1', text: 'Install sump pumps with battery backup and backwater valves in your basement', completed: false }, // Source: PreparedBC (www2.gov.bc.ca) and Canadian Red Cross (redcross.ca)
        { id: 'flood-home-2', text: 'Elevate valuables, appliances, and electrical panels above potential flood levels', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'flood-home-3', text: 'Clear debris from gutters, drains, and downspouts to prevent water buildup', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'flood-home-4', text: 'Seal cracks in foundation walls and basement windows', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'flood-home-5', text: 'Store chemicals and hazardous materials above ground level', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
      ],
    },
    {
      title: '📋 Evacuation Planning',
      items: [
        { id: 'flood-evac-1', text: 'Know your flood risk zone and local evacuation routes', completed: false }, // Source: Canadian Red Cross (redcross.ca) and PreparedBC (www2.gov.bc.ca)
        { id: 'flood-evac-2', text: 'Prepare a grab-and-go bag with essentials like water, food, medications, and documents', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'flood-evac-3', text: 'Develop a family plan including pets and members with special needs', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'flood-evac-4', text: 'Practice turning off utilities (gas, electricity, water) before evacuating', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'flood-evac-5', text: 'Avoid walking or driving through flood waters', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '🛡️ Personal Safety',
      items: [
        { id: 'flood-safety-1', text: 'Monitor weather forecasts and sign up for flood alerts', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'flood-safety-2', text: 'Have sandbags or barriers ready to divert water from entry points', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'flood-safety-3', text: 'Stock non-perishable food, water (4L per person/day), and a first-aid kit', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'flood-safety-4', text: 'Prepare for power outages with flashlights and batteries', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'flood-safety-5', text: 'Check on vulnerable neighbors during flood warnings', completed: false }, // Source: Canadian Red Cross (redcross.ca)
      ],
    },
    {
      title: '📄 Insurance & Recovery',
      items: [
        { id: 'flood-insure-1', text: 'Review your insurance policy for flood coverage (including overland and sewer backup)', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
        { id: 'flood-insure-2', text: 'Document your property with photos and inventory for claims', completed: false }, // Source: Canadian Red Cross (redcross.ca)
        { id: 'flood-insure-3', text: 'Know how to safely clean up after a flood to prevent mold', completed: false }, // Source: Public Safety Canada (getprepared.gc.ca)
        { id: 'flood-insure-4', text: 'Participate in community flood mapping or mitigation programs', completed: false }, // Source: PreparedBC (www2.gov.bc.ca)
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