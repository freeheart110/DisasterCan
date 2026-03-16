import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../src/firebase/config';
import { UserProfile, getUserProfile } from '../src/services/profileService';
import { useQuestStore } from '../src/state/questStore';
import { useLocations } from '../src/hooks/useLocations';

export default function RootLayout() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const initializeQuests = useQuestStore((state) => state.initializeQuests);
  const { locationInfo } = useLocations();

  // Handle anonymous auth + user profile setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth).catch(console.error);
      } else {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load regional quests after profile and location are ready
  useEffect(() => {
    if (profile && locationInfo?.province) {
      initializeQuests(profile.userId, locationInfo.province);
    }
  }, [profile, locationInfo, initializeQuests]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      <Stack.Screen name="quests/[questId]" />
      <Stack.Screen name="alert-detail/[alertId]" />
    </Stack>
  );
}
