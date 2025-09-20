import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from './profileService';

// Game rules: point awards per action
const POINT_VALUES = {
  CHECKLIST_ITEM: 1,
  QUIZ_QUESTION_CORRECT: 5,
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

// Public API
export const awardPointForChecklistItem = async (userId: string, amount = POINT_VALUES.CHECKLIST_ITEM) => {
  await awardPoints(userId, amount);
};

export const awardPointForQuizAnswer = async (userId: string) => {
  await awardPoints(userId, POINT_VALUES.QUIZ_QUESTION_CORRECT);
};