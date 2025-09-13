import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useQuestStore } from '../src/state/questStore';
// import * as Notifications from 'expo-notifications'; 
// import { registerBackgroundTaskAsync } from '../src/services/notificationService'; 

// --- Temporarily disabled for Expo Go development ---
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });
// ----------------------------------------------------

export default function RootLayout() {
  const initializeQuests = useQuestStore((state) => state.initializeQuests);

  // This effect hook runs once when the application starts.
  useEffect(() => {
    // Initialize the gamified quests from the store.
    initializeQuests();

    // --- Temporarily disabled for Expo Go development ---
    // registerBackgroundTaskAsync();
    // ----------------------------------------------------

  }, [initializeQuests]); // The dependency array ensures this runs only once.

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

