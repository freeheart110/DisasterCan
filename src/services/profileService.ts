    import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
    import { db, auth } from '../firebase/config';
    import { Quest } from '../constants/quests/types';

    // Defines the shape of the user's profile data in Firestore
    export interface UserProfile {
      userId: string;
      xp: number;
      level: number;
      badges: string[];
      completedQuests: Record<string, {
        completedItems: Record<string, string[]>; // { categoryId: [itemId, itemId] }
      }>;
    }

    /**
     * Creates or retrieves a user's profile from Firestore.
     * @param userId The unique ID of the user.
     * @returns The user's profile data.
     */
    export const getUserProfile = async (userId: string): Promise<UserProfile> => {
      try {
        console.log('📛 userId passed to getUserProfile:', userId); 
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        } else {
          // If the user is new, create a default profile for them.
          const defaultProfile: UserProfile = {
            userId,
            xp: 0,
            level: 1,
            badges: [],
            completedQuests: {},
          };
          await setDoc(userDocRef, defaultProfile);
          return defaultProfile;
        }
      } catch (error) {
        console.error("Failed to get or create user profile:", error);
        throw error;
      }
    };

    /**
     * Saves the user's progress for a specific quest to Firestore.
     * @param userId The unique ID of the user.
     * @param quest The quest object with the latest progress.
     */
    export const saveQuestProgress = async (userId: string, quest: Quest) => {
      const userDocRef = doc(db, 'users', userId);
      const completedItems: Record<string, string[]> = {};

      quest.categories.forEach(category => {
        const completedIds = category.items
          .filter(item => item.completed)
          .map(item => item.id);
        if (completedIds.length > 0) {
          completedItems[category.title] = completedIds;
        }
      });

      // Use `setDoc` with `merge: true` to only update the specific quest's progress.
      await setDoc(userDocRef, {
        completedQuests: {
          [quest.id]: { completedItems }
        }
      }, { merge: true });
    };

    /**
     * Sets up a real-time listener for a user's profile.
     * @param userId The unique ID of the user.
     * @param callback A function that will be called with the latest profile data.
     * @returns The unsubscribe function for the listener.
     */
    export const onProfileUpdate = (userId: string, callback: (profile: UserProfile) => void) => {
      const userDocRef = doc(db, 'users', userId);
      // onSnapshot creates a live connection to the database.
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data() as UserProfile);
        }
      });
      return unsubscribe;
    };
    
