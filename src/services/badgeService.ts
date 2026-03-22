import { UserProfile } from './profileService';
import type { Quest } from '../constants/quests/questConfig';

// Returns true only if every item in every category of the quest is completed.
// Uses the in-memory quest state (item.completed flags) which is the authoritative
// source — the Firestore saved data only stores completed items and can't be
// used to verify all items are done without knowing the total item count.
function isQuestFullyCompleted(questId: string, quests: Quest[]): boolean {
  const quest = quests.find((q) => q.id === questId);
  if (!quest?.categories) return false;
  const allItems = quest.categories.flatMap((cat) => cat.items);
  return allItems.length > 0 && allItems.every((item) => item.completed);
}

export const getEarnedBadges = (profile: UserProfile, quests: Quest[]): string[] => {
  const earnedBadges: string[] = [];

  // Badge: Prepared Citizen — both common checklists fully completed
  const kitDone  = isQuestFullyCompleted('kit-1',  quests);
  const planDone = isQuestFullyCompleted('plan-1', quests);
  if (kitDone && planDone) {
    earnedBadges.push('Prepared Citizen');
  }

  // Badge: Wildfire Smoke Ready — smoke checklist + air quality quiz
  const smokeDone = isQuestFullyCompleted('hazard-wildfire-smoke-1', quests);
  const hasQuiz   = profile.completedQuests['quiz-airquality-1']?.quizCompleted === true;
  if (smokeDone && hasQuiz) {
    earnedBadges.push('Wildfire Smoke Ready');
  }

  return earnedBadges;
};
