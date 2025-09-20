import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Quest } from '../constants/quests/questConfig';

/**
 * Represents a single completed checklist item with timestamp and expiration data.
 */
export interface CompletedItem {
  id: string;                 // The checklist item ID
  completedAt: string;       // ISO timestamp of when the item was completed
  expiryDays: number;        // Number of days before this item expires
}

/**
 * Represents a user's profile and progress in the gamified app.
 */
export interface UserProfile {
  userId: string;
  point: number;
  level: number;
  badges: string[];
  completedQuests: Record<
    string, // questId
    {
      completedItems: Record<string, CompletedItem[]>; // categoryTitle -> array of completed items
      completedDaysAgo?: number; // used only for quizzes (whole-quest expiration)
    }
  >;
}

/**
 * Fetches a user's profile from Firestore. If it doesn't exist, initializes it with default values.
 * @param userId The Firebase UID of the user
 * @returns The full UserProfile object
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    console.log('📛 userId passed to getUserProfile:', userId);
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      // New user: create a default profile
      const defaultProfile: UserProfile = {
        userId,
        point: 0,
        level: 1,
        badges: [],
        completedQuests: {},
      };
      await setDoc(userDocRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('❌ Failed to get or create user profile:', error);
    throw error;
  }
};

/**
 * Saves checklist quest progress to Firestore using each item's `expiryDays`.
 * Only items that explicitly define `expiryDays` will be saved.
 *
 * @param userId Firebase UID of the user
 * @param quest The checklist quest to save progress for
 */
export const saveQuestProgress = async (userId: string, quest: Quest) => {
  if (quest.format !== 'checklist' || !quest.categories) {
    console.warn(`⚠️ Attempted to save non-checklist quest "${quest.id}"`);
    return;
  }

  const userDocRef = doc(db, 'users', userId);

  const completedItems: Record<string, CompletedItem[]> = {};

  quest.categories.forEach((category) => {
    const itemsToSave = category.items
      .filter((item) => item.completed)
      .map((item) => {
        if (item.expiryDays === undefined) {
          throw new Error(
            `❌ Missing expiryDays for item "${item.id}" in quest "${quest.id}"`
          );
        }

        return {
          id: item.id,
          completedAt: item.completedAt ?? new Date().toISOString(),
          expiryDays: item.expiryDays,
        };
      });

    if (itemsToSave.length > 0) {
      completedItems[category.title] = itemsToSave;
    }
  });

  // Save progress to Firestore using merge to avoid overwriting other fields
  await setDoc(
    userDocRef,
    {
      completedQuests: {
        [quest.id]: {
          completedItems,
          completedDaysAgo: 0, // still used for quizzes
        },
      },
    },
    { merge: true }
  );
};

/**
 * Sets up a real-time listener on the user profile document in Firestore.
 * Whenever the data changes, the callback will be called with the new profile.
 *
 * @param userId Firebase UID of the user
 * @param callback Callback that receives the updated UserProfile
 * @returns A function to unsubscribe from the listener
 */
export const onProfileUpdate = (
  userId: string,
  callback: (profile: UserProfile) => void
) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserProfile);
    }
  });
};