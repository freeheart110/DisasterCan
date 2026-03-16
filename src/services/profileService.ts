import { doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Quest } from '../constants/quests/questConfig';

export interface CompletedItem {
  id: string;
  completedAt: string;
  expiryDays?: number;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  point: number;
  level: number;
  badges: string[];
  completedQuests: Record<
    string,
    {
      checklistItems?: Record<string, CompletedItem[]>;
      quizCompleted?: boolean;
      title?: string;
    }
  >;
}

/**
 * Loads a user profile or creates it if not found.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      return data;
    } else {
      const defaultProfile: UserProfile = {
        userId,
        point: 0,
        level: 1,
        badges: [],
        completedQuests: {},
      };
      await setDoc(userDocRef, defaultProfile);
      console.log('🆕 Created new user profile:', defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('❌ Failed to get or create user profile:', error);
    throw error;
  }
};

/**
 * Saves checklist quest progress with `expiryDays` tracking.
 */
export const saveQuestProgress = async (userId: string, quest: Quest) => {
  if (quest.format !== 'checklist' || !quest.categories) {
    console.warn(`⚠️ Attempted to save non-checklist quest "${quest.id}"`);
    return;
  }

  const userDocRef = doc(db, 'users', userId);
  const checklistItems: Record<string, CompletedItem[]> = {};

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
      checklistItems[category.title] = itemsToSave;
    }
  });

  if (Object.keys(checklistItems).length === 0) {
    console.warn(`⚠️ No completed items to save for "${quest.id}"`);
    return;
  }

  const existingDoc = await getDoc(userDocRef);
  const existingData = existingDoc.exists() ? existingDoc.data() : {};
  const existingQuest = existingData?.completedQuests?.[quest.id] ?? {};

  const updatedQuestData: any = {
    checklistItems,
    title: quest.title,
  };

  if (existingQuest.quizCompleted !== undefined) {
    updatedQuestData.quizCompleted = existingQuest.quizCompleted;
  }

  await setDoc(
    userDocRef,
    {
      completedQuests: {
        [quest.id]: updatedQuestData,
      },
    },
    { merge: true }
  );

  // console.log(`Saved checklist progress for "${quest.id}"`);
};

/**
 * Saves quiz completion flag (full score) for a quiz quest and stores its title.
 */
export const saveQuizCompletion = async (userId: string, quest: Quest) => {
  const userDocRef = doc(db, 'users', userId);

  await setDoc(
    userDocRef,
    {
      completedQuests: {
        [quest.id]: {
          quizCompleted: true,
          title: quest.title,
        },
      },
    },
    { merge: true }
  );

  console.log(`🎉 Saved quiz completion for "${quest.title}"`);
};

/**
 * Saves checklist title only, useful when all items are complete.
 */
export const saveChecklistCompletion = async (userId: string, quest: Quest) => {
  const userDocRef = doc(db, 'users', userId);

  await setDoc(
    userDocRef,
    {
      completedQuests: {
        [quest.id]: {
          title: quest.title,
        },
      },
    },
    { merge: true }
  );

  console.log(`📝 Saved checklist completion title for "${quest.title}"`);
};

/**
 * Real-time listener for profile updates.
 */
export const onProfileUpdate = (
  userId: string,
  callback: (profile: UserProfile) => void
) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const profile = doc.data() as UserProfile;
      // console.log(' Real-time update received:', profile);
      callback(profile);
    } else {
      console.warn(`⚠️ No user profile found for ID "${userId}"`);
    }
  });
};

// Limit updatable fields for type safety
type UpdatableField = 'point' | 'level' | 'badges' | 'completedQuests' | 'displayName';

/**
 * Generic updater for a single top-level user profile field.
 */
export const updateUserProfileField = async (
  userId: string,
  field: UpdatableField,
  value: any
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { [field]: value });
  console.log(`✏️ Updated field "${field}" for user "${userId}"`);
};
