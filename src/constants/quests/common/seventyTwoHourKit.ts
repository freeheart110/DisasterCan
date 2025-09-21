import type { Quest } from '../questConfig';

/**
 * @file 72hourKit.ts
 * @description Defines the "Build a 72-Hour Emergency Kit" quest, a core common preparedness task recommended for all Canadians.
 * The checklist items follow official guidelines from Public Safety Canada and emphasize self-sufficiency during the first 72 hours of an emergency.
 */

export const seventyTwoHourKitQuest: Quest = {
  id: 'kit-1',
  title: 'Build a 72-Hour Emergency Kit',
  format: 'checklist',
  category: 'common',
  categories: [
    {
      title: '💧 Water',
      items: [
        {
          id: 'water-1',
          text: '4 litres of water per person, per day (for 3 days = 12 litres per person)',
          completed: false,
          expiryDays: 90, // Source: Public Safety Canada (getprepared.gc.ca) – Check seasonally
        },
        {
          id: 'water-2',
          text: 'Small, portable bottles or containers for easy carrying',
          completed: false,
          expiryDays: 180, // Source: Public Safety Canada (getprepared.gc.ca) – Check twice a year
        },
        {
          id: 'water-3',
          text: 'Water purification tablets or a portable filter',
          completed: false,
          expiryDays: 730, // Source: Canadian Red Cross (redcross.ca) – Most tablets expire in ~2 years
        },
      ],
    },
    {
      title: '🍔 Food',
      items: [
        {
          id: 'food-1',
          text: 'Non-perishable food for 3 days (e.g., canned goods, energy bars)',
          completed: false,
          expiryDays: 365, // Source: Public Safety Canada (getprepared.gc.ca) – Rotate annually
        },
        {
          id: 'food-2',
          text: 'Manual can opener (non-electric)',
          completed: false,
          expiryDays: 1825, // Source: PreparedBC (preparedbc.ca) – Long-term tool
        },
        {
          id: 'food-3',
          text: 'Dried foods or energy bars (high-calorie, easy to store)',
          completed: false,
          expiryDays: 365, // Source: Canadian Red Cross (redcross.ca) – Annual rotation
        },
      ],
    },
    {
      title: '🔦 Tools & Supplies',
      items: [
        {
          id: 'tools-1',
          text: 'Flashlight and extra batteries',
          completed: false,
          expiryDays: 730, // Source: Public Safety Canada (getprepared.gc.ca) – Batteries degrade
        },
        {
          id: 'tools-2',
          text: 'Battery-powered or hand-crank radio for emergency broadcasts',
          completed: false,
          expiryDays: 1825, // Source: Public Safety Canada (getprepared.gc.ca)
        },
        {
          id: 'tools-3',
          text: 'First-aid kit (with bandages, antiseptics, gloves)',
          completed: false,
          expiryDays: 365, // Source: Canadian Red Cross (redcross.ca) – Check annually
        },
        {
          id: 'tools-4',
          text: 'Medications (prescriptions for 3 days) and personal items',
          completed: false,
          expiryDays: 90, // Source: Public Safety Canada (getprepared.gc.ca) – Short shelf life
        },
        {
          id: 'tools-5',
          text: 'Whistle to signal for help',
          completed: false,
          expiryDays: 1825, // Source: Public Safety Canada (getprepared.gc.ca)
        },
        {
          id: 'tools-6',
          text: 'Dust masks or N95 respirators for contaminated air',
          completed: false,
          expiryDays: 730, // Source: Canadian Red Cross (redcross.ca) – 2 years is typical
        },
        {
          id: 'tools-7',
          text: 'Multi-tool or duct tape for repairs',
          completed: false,
          expiryDays: 1825, // Source: PreparedBC (preparedbc.ca)
        },
      ],
    },
    {
      title: '📄 Documents & Sanitation',
      items: [
        {
          id: 'docs-1',
          text: 'Copies of important documents (ID, insurance, passports in waterproof container)',
          completed: false,
          expiryDays: 365, // Source: Public Safety Canada (getprepared.gc.ca) – Recheck annually
        },
        {
          id: 'docs-2',
          text: 'Emergency contact list and family plan',
          completed: false,
          expiryDays: 180, // Source: Public Safety Canada (getprepared.gc.ca) – Semi-annual updates
        },
        {
          id: 'docs-3',
          text: 'Cash in small bills and coins',
          completed: false,
          expiryDays: 365, // Source: Public Safety Canada (getprepared.gc.ca) – No expiry, review as needed
        },
        {
          id: 'docs-4',
          text: 'Toilet paper, soap, hand sanitizer, and feminine supplies',
          completed: false,
          expiryDays: 365, // Source: Canadian Red Cross (redcross.ca)
        },
      ],
    },
    {
      title: '👕 Clothing & Comfort',
      items: [
        {
          id: 'clothing-1',
          text: 'Complete change of clothing (warm layers, sturdy shoes)',
          completed: false,
          expiryDays: 365, // Source: Public Safety Canada (getprepared.gc.ca) – Check annually
        },
        {
          id: 'clothing-2',
          text: 'Emergency blanket or sleeping bag',
          completed: false,
          expiryDays: 1825, // Source: PreparedBC (preparedbc.ca)
        },
      ],
    },
  ],
};

// References
// Public Safety Canada. (2024, October 9). Emergency kits. Get Prepared. https://www.getprepared.gc.ca/cnt/kts/index-en.aspx
// Public Safety Canada. (2005). Your emergency preparedness guide. Publications.gc.ca. https://publications.gc.ca/collections/Collection/PS4-26-2005E.pdf
// Canadian Red Cross. (n.d.). Get an emergency kit. Canadian Red Cross. https://www.redcross.ca/how-we-help/emergencies-and-disasters-in-canada/be-ready-emergency-preparedness-and-recovery/get-an-emergency-kit
// Province of British Columbia. (n.d.). Build an emergency kit and grab-and-go bag. PreparedBC. https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc/build-an-emergency-kit-and-grab-and-go-bag
// Alberta Government. (n.d.). Build an emergency kit. Alberta.ca. https://www.alberta.ca/build-an-emergency-kit