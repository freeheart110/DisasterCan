import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
      {/* Add others: prepare, resources */}
    </Tabs>
  );
}