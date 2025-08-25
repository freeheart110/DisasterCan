import type { Quest } from '../types';

/**
 * @file familyPlan.ts
 * @description Defines the "Make a Family Plan" quest, a common preparedness task for all Canadians.
 * The checklist items are based on official guidance from Public Safety Canada.
 */

export const familyPlanQuest: Quest = {
  id: 'plan-1',
  title: 'Make a Family Plan',
  categories: [
    {
      title: '📞 Communication Plan',
      items: [
        { id: 'plan-comm-1', text: 'Establish an out-of-province contact person', completed: false },
        { id: 'plan-comm-2', text: 'Ensure all family members have the contact\'s info', completed: false },
        { id: 'plan-comm-3', text: 'Designate a local friend or relative as a secondary contact', completed: false },
        { id: 'plan-comm-4', text: 'Create a group chat for emergency updates', completed: false },
      ],
    },
    {
      title: '📍 Meeting Places',
      items: [
        { id: 'plan-meet-1', text: 'Designate a safe meeting place right outside your home', completed: false },
        { id: 'plan-meet-2', text: 'Designate a safe meeting place in your neighbourhood', completed: false },
        { id: 'plan-meet-3', text: 'Ensure everyone knows the address and location of both places', completed: false },
      ],
    },
    {
      title: '🏠 Household Information',
      items: [
        { id: 'plan-info-1', text: 'Know how to shut off water, gas, and electricity', completed: false },
        { id: 'plan-info-2', text: 'Have a floor plan of your home showing escape routes', completed: false },
        { id: 'plan-info-3', text: 'Keep a list of emergency numbers near the phone', completed: false },
      ],
    },
    {
      title: '🐾 Special Considerations',
      items: [
        { id: 'plan-special-1', text: 'Create a specific plan for members with disabilities or medical needs', completed: false },
        { id: 'plan-special-2', text: 'Include a plan for your pets (food, carrier, etc.)', completed: false },
        { id: 'plan-special-3', text: 'Review and practice your plan with all household members twice a year', completed: false },
      ],
    },
  ],
};
