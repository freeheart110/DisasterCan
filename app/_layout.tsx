import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useQuestStore } from '../src/state/questStore';
// We no longer need the location service here for now.

export default function RootLayout() {
  const initializeQuests = useQuestStore((state) => state.initializeQuests);

  // This effect runs once when the app loads.
  useEffect(() => {
    // We now call initializeQuests without a province.
    initializeQuests();
  }, [initializeQuests]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="quests/[questId]" />
    </Stack>
  );
}
