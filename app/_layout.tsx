import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useQuestStore } from '../src/state/questStore';
import { useLocations } from '../src/hooks/useLocations'; 

// --- Notification code is disabled for Expo Go development ---

export default function RootLayout() {
  const initializeQuests = useQuestStore((state) => state.initializeQuests);
  // Get the user's location information when the app starts.
  const { locationInfo } = useLocations();

  // This effect hook runs when the app starts and whenever locationInfo changes.
  useEffect(() => {
    // Wait until the user's location has been successfully determined.
    if (locationInfo?.province) {
      // Once the province is known, initialize the quest store with it.
      // This will load both common quests and the correct regional quests.
      initializeQuests(locationInfo.province);
    }
  }, [locationInfo, initializeQuests]); // This runs when location is found.

  return (
    // The Stack navigator is the root of the app's navigation.
    <Stack>
      {/* This screen represents the main tab bar interface. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* This screen is for the dynamic quest checklist pages. */}
      <Stack.Screen name="quests/[questId]" />

      {/* This screen is for the new alert detail page with the map. */}
      <Stack.Screen name="alert-detail/[alertId]" />
    </Stack>
  );
}

