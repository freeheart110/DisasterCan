import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from './profileService';

// Game rules: point awards per action
const POINT_VALUES = {
  CHECKLIST_ITEM: 1,            // +1 per checklist item
  CHECKLIST_COMPLETE: 5,        // +5 for completing entire checklist
  QUIZ_QUESTION_CORRECT: 1,     // +1 per correct quiz answer
  QUIZ_COMPLETE: 5,             // +5 for getting all quiz questions correct
};
// Points required for each level (cumulative)
export const POINTS_FOR_NEXT_LEVEL = (level: number): number => level * 100;

export const calculateLevel = (totalPoints: number): number => {
  let level = 1;
  while (totalPoints >= POINTS_FOR_NEXT_LEVEL(level + 1)) {
    level++;
  }
  return level;
};

const awardPoints = async (userId: string, amount: number) => {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    point: increment(amount),
  });

  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const updatedProfile = snap.data() as UserProfile;
  const newLevel = calculateLevel(updatedProfile.point);

  if (newLevel > updatedProfile.level) {
    await updateDoc(userRef, {
      level: newLevel,
    });
    console.log(`🎉 User ${userId} leveled up to Level ${newLevel}`);
  }
};

// Public API for gamification actions

/**
 * Awards points for a checklist item or a full checklist.
 * @param userId The Firebase user ID
 * @param isComplete Whether the entire checklist is completed (default false)
 */
export const awardPointForChecklistItem = async (
  userId: string,
  isComplete: boolean = false,
  isUncheck: boolean = false
) => {
  let amount = isComplete
    ? POINT_VALUES.CHECKLIST_COMPLETE
    : POINT_VALUES.CHECKLIST_ITEM;

  if (isUncheck) amount = -amount;

  await awardPoints(userId, amount);
};

/**
 * Awards points for a quiz question or completing the entire quiz.
 * @param userId The Firebase user ID
 * @param isComplete Whether the full quiz is completed (default false)
 */
export const awardPointForQuizAnswer = async (
  userId: string,
  isComplete: boolean = false
) => {
  const amount = isComplete
    ? POINT_VALUES.QUIZ_COMPLETE
    : POINT_VALUES.QUIZ_QUESTION_CORRECT;
  await awardPoints(userId, amount);
};