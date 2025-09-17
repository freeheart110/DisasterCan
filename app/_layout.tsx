import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../src/firebase/config';
import {UserProfile, getUserProfile } from '../src/services/profileService'; 
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
        console.log('No user found. Signing in anonymously...');
        await signInAnonymously(auth).catch(console.error);
      } else {
        console.log('User logged in with UID:', user.uid);
        const profile = await getUserProfile(user.uid);
        setProfile(profile);
        console.log('Fetched or created profile:', profile);
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
  if (profile) {
    console.log( 'Profile state updated:', profile);
  }
}, [profile]);
  // Load regional quests
  useEffect(() => {
    if (locationInfo?.province) {
      initializeQuests(locationInfo.province);
    }
  }, [locationInfo, initializeQuests]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="quests/[questId]" />
      <Stack.Screen name="alert-detail/[alertId]" />
    </Stack>
  );
}