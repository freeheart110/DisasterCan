import type { Quest } from '../types';

export const seventyTwoHourKitQuest: Quest = {
  id: 'kit-1',
  title: 'Build a 72-Hour Kit',
  categories: [
    {
      title: '💧 Water',
      items: [
        { id: 'water-1', text: '4 litres of water per person, per day', completed: false },
        { id: 'water-2', text: 'Small bottles that can be carried easily', completed: false },
        { id: 'water-3', text: 'Water purification tablets', completed: false },
      ],
    },
    {
      title: '🍔 Food',
      items: [
        { id: 'food-1', text: 'Non-perishable food for 3 days', completed: false },
        { id: 'food-2', text: 'Manual can opener', completed: false },
        { id: 'food-3', text: 'Energy bars and dried foods', completed: false },
      ],
    },
    {
      title: '🔦 Tools & Supplies',
      items: [
        { id: 'tools-1', text: 'Flashlight and extra batteries', completed: false },
        { id: 'tools-2', text: 'Radio (crank or battery-powered)', completed: false },
        { id: 'tools-3', text: 'First-aid kit', completed: false },
        { id: 'tools-4', text: 'Medications and prescriptions', completed: false },
        { id: 'tools-5', text: 'Whistle to signal for help', completed: false },
        { id: 'tools-6', text: 'Dust mask to filter contaminated air', completed: false },
      ],
    },
    {
      title: '📄 Documents',
      items: [
        { id: 'docs-1', text: 'Copies of important documents (ID, insurance)', completed: false },
        { id: 'docs-2', text: 'Emergency contact list', completed: false },
        { id: 'docs-3', text: 'Cash in small bills', completed: false },
      ],
    },
  ],
};
