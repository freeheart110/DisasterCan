import { Tabs } from 'expo-router';

export default function Layout(): JSX.Element {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="prepare" options={{ title: 'Prepare' }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources' }} />
    </Tabs>
  );
}