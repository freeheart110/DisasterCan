import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from './profileService';

// --- GAME RULES ---

// Define how much XP is awarded for different actions.
const XP_VALUES = {
  CHECKLIST_ITEM: 20,
  QUIZ_QUESTION_CORRECT: 5,
};

// XP required to reach each level (cumulative)
export const XP_FOR_NEXT_LEVEL = (level: number) => level * 100;

/**
 * Calculates the user's level based on total XP.
 * @param totalXP The user's total XP in history.
 */
export const calculateLevel = (totalXP: number): number => {
  let level = 1;
  while (totalXP >= XP_FOR_NEXT_LEVEL(level + 1)) {
    level++;
  }
  return level;
};

/**
 * Atomically adds XP to the user and checks if they leveled up.
 * @param userId The unique ID of the user.
 * @param xpAmount The XP to award.
 */
const awardXP = async (userId: string, xpAmount: number) => {
  const userDocRef = doc(db, 'users', userId);

  // Atomically increment XP
  await updateDoc(userDocRef, {
    xp: increment(xpAmount),
  });

  // Re-fetch the updated user profile
  const snap = await getDoc(userDocRef);
  if (!snap.exists()) return;

  const updatedProfile = snap.data() as UserProfile;
  const newLevel = calculateLevel(updatedProfile.xp);

  // Update level if needed
  if (newLevel > updatedProfile.level) {
    await updateDoc(userDocRef, {
      level: newLevel,
      // badges: arrayUnion(`Level ${newLevel} Reached`)
    });
    console.log(`🎉 User ${userId} leveled up to Level ${newLevel}`);
  }
};

// --- PUBLIC API ---

export const awardXpForChecklistItem = async (userId: string) => {
  await awardXP(userId, XP_VALUES.CHECKLIST_ITEM);
};

export const awardXpForQuizAnswer = async (userId: string) => {
  await awardXP(userId, XP_VALUES.QUIZ_QUESTION_CORRECT);
};