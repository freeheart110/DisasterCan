import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, icon: IoniconName, outlineIcon: IoniconName) {
  return ({ color }: { color: string }) => (
    <Ionicons name={focused ? icon : outlineIcon} size={24} color={color} />
  );
}

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2471a3',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) =>
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) =>
            <Ionicons name={focused ? 'warning' : 'warning-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prepare"
        options={{
          title: 'Prepare',
          tabBarIcon: ({ focused, color }) =>
            <Ionicons name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused, color }) =>
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) =>
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
