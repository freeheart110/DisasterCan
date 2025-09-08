import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useQuestStore } from '../src/state/questStore';
import * as Notifications from 'expo-notifications';
import { registerBackgroundTaskAsync } from '../src/services/notificationService';

// Configure how notifications are handled when the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // Show as a banner (iOS)
    shouldShowList: true,     // Add to notification center list (iOS)
    shouldPlaySound: false,   // Set to true for sound for foreground notifications
    shouldSetBadge: false,    // No app icon badge updates
  }),
});

export default function RootLayout() {
  const initializeQuests = useQuestStore((state) => state.initializeQuests);

  // This effect hook runs once when the application starts.
  useEffect(() => {
    // Initialize the gamified quests from the store.
    initializeQuests();
    // Register the background task that will periodically check for new alerts.
    registerBackgroundTaskAsync();
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