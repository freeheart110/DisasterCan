// App.tsx - Basic Resource Hub Feature Prototype

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
  Alert, // To confirm actions
} from 'react-native';
// Import Linking for making calls and opening websites
import * as Linking from 'expo-linking';
// Import icons for a better UI
import { Feather } from '@expo/vector-icons'; 

// --- Type Definitions ---
type ResourceType = 'phone' | 'web';

interface ResourceItem {
  id: string;
  name: string;
  contact: string;
  type: ResourceType;
  description: string;
}

// FIX: Define the structure for a category to ensure type safety
interface ResourceCategory {
  title: string;
  data: ResourceItem[];
}

// --- Static Data for the Resource Hub ---
// This data is hard-coded for the prototype. In a full app, it could be
// fetched from a remote source and customized based on the user's location.
// FIX: Apply the ResourceCategory[] type to the constant
const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    title: 'Immediate Emergency',
    data: [
      {
        id: '1',
        name: 'Police, Fire, Ambulance',
        contact: '911',
        type: 'phone',
        description: 'For life-threatening emergencies only.'
      },
    ],
  },
  {
    title: 'Government of Canada Resources',
    data: [
      {
        id: '2',
        name: 'Get Prepared Website',
        contact: 'https://www.getprepared.gc.ca',
        type: 'web',
        description: 'Official emergency preparedness guides.'
      },
      {
        id: '3',
        name: 'Public Weather Alerts',
        contact: 'https://weather.gc.ca/warnings/index_e.html',
        type: 'web',
        description: 'Latest watches and warnings from ECCC.'
      },
    ],
  },
  {
    title: 'Saskatchewan Provincial Resources',
    data: [
        {
            id: '4',
            name: 'Saskatchewan Public Safety',
            contact: 'https://www.saskpublicsafety.ca/',
            type: 'web',
            description: 'Provincial emergency information and alerts.'
        },
        {
            id: '5',
            name: 'HealthLine',
            contact: '811',
            type: 'phone',
            description: 'For non-urgent health questions.'
        },
        {
            id: '6',
            name: 'SaskPower Outages',
            contact: 'https://www.saskpower.com/outages',
            type: 'web',
            description: 'Check for and report power outages.'
        },
        {
            id: '7',
            name: 'SaskEnergy Emergencies',
            contact: '1-888-700-0427',
            type: 'phone',
            description: 'Report gas leaks or other emergencies.'
        }
    ]
  },
];


// --- Main App Component ---
export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // --- Interaction Logic ---
  const handleResourcePress = (item: ResourceItem) => {
    if (item.type === 'phone') {
      // Create a confirmation prompt before calling
      Alert.alert(
        `Call ${item.name}?`,
        `You are about to call ${item.contact}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(`tel:${item.contact}`) }
        ]
      );
    } else if (item.type === 'web') {
      Linking.openURL(item.contact);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text style={styles.header}>Resource Hub Prototype</Text>
          <Text style={styles.subHeader}>Key Emergency Contacts & Links</Text>

          {RESOURCE_CATEGORIES.map(category => (
            <View key={category.title} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              {category.data.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => handleResourcePress(item)}
                  style={({ pressed }) => [styles.resourceItem, pressed && styles.resourceItemPressed]}
                >
                  <View style={styles.iconContainer}>
                    <Feather
                      name={item.type === 'phone' ? 'phone-call' : 'external-link'}
                      size={24}
                      color="#3498db"
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.resourceName}>{item.name}</Text>
                    <Text style={styles.resourceDescription}>{item.description}</Text>
                  </View>
                  <Feather name="chevron-right" size={24} color="#bdc3c7" />
                </Pressable>
              ))}
            </View>
          ))}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
  container: { padding: 15 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  subHeader: { fontSize: 18, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 },
  
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e6ed',
    marginBottom: 10,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resourceItemPressed: {
    backgroundColor: '#f8f9fa', // Visual feedback on press
  },
  iconContainer: {
    marginRight: 15,
    backgroundColor: '#eaf5fc',
    padding: 10,
    borderRadius: 50, // Makes it a circle
  },
  textContainer: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 3,
  },
});
