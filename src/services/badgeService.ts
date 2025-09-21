import { UserProfile } from './profileService';

export const getEarnedBadges = (profile: UserProfile): string[] => {
  const earnedBadges: string[] = [];

  // Common checklist quest IDs
  const commonChecklistIds = ['kit-1', 'plan-1'];

  let commonChecklistsCompleted = 0;

  for (const questId of commonChecklistIds) {
    const questData = profile.completedQuests[questId];
    if (!questData || !questData.checklistItems) continue;

    const allItemsCompleted = Object.values(questData.checklistItems).every(
      (items) => items.length > 0
    );

    if (allItemsCompleted) {
      commonChecklistsCompleted++;
    }
  }

  // Badge: Prepared Citizen
  if (commonChecklistsCompleted >= 2) {
    earnedBadges.push('Prepared Citizen');
  }

  // Wildfire Smoke checklist + quiz
  const wildfireChecklist = profile.completedQuests['hazard-wildfire-smoke-1'];
  const wildfireQuiz = profile.completedQuests['quiz-airquality-1'];

  const hasChecklist =
    wildfireChecklist &&
    wildfireChecklist.checklistItems &&
    Object.values(wildfireChecklist.checklistItems).every(
      (items) => items.length > 0
    );

  const hasQuiz = wildfireQuiz?.quizCompleted === true;

  if (hasChecklist && hasQuiz) {
    earnedBadges.push('Wildfire Smoke Ready');
  }

  return earnedBadges;
};