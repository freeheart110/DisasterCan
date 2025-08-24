import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* <Provider store={AlertStore}> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="alerts/[region]" options={{ title: 'Alert Details' }} />
        </Stack>
      {/* </Provider> */}
    </SafeAreaProvider>
  );
}