// App.tsx - Gamified "Build a Safety Kit" Feature Prototype

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable, // We'll use Pressable for our list items
} from 'react-native';
// Import the checkbox component you just installed
import Checkbox from 'expo-checkbox'; 

// --- Data for the Safety Kit ---
// This array represents the items needed for a basic 72-hour emergency kit.
const INITIAL_KIT_ITEMS = [
  { id: '1', name: 'Water (4L per person per day)', checked: false },
  { id: '2', name: 'Non-perishable food (3-day supply)', checked: false },
  { id: '3', name: 'Flashlight and extra batteries', checked: false },
  { id: '4', name: 'First-aid kit', checked: false },
  { id: '5', name: 'Medications and prescriptions', checked: false },
  { id: '6', name: 'Copies of important documents', checked: false },
  { id: '7', name: 'Cash in small bills', checked: false },
  { id: '8', name: 'Emergency blankets', checked: false },
  { id: '9', name: 'Whistle (to signal for help)', checked: false },
  { id: '10', name: 'Battery-powered or crank radio', checked: false },
];

// --- Type Definition ---
interface KitItem {
  id: string;
  name: string;
  checked: boolean;
}

export default function App() {
  // --- State Management ---
  const [kitItems, setKitItems] = useState<KitItem[]>(INITIAL_KIT_ITEMS);
  const [progress, setProgress] = useState<number>(0);
  
  const isDarkMode = useColorScheme() === 'dark';

  // --- Gamification Logic ---

  // This effect recalculates the progress whenever the kitItems state changes.
  useEffect(() => {
    const checkedCount = kitItems.filter(item => item.checked).length;
    const newProgress = (checkedCount / kitItems.length) * 100;
    setProgress(newProgress);
  }, [kitItems]);

  // This function handles the user tapping on a checklist item.
  const handleToggleItem = (id: string) => {
    // Find the item that was tapped and flip its 'checked' status
    const updatedItems = kitItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setKitItems(updatedItems);
  };

  // --- UI Rendering ---
  
  // A component to render the progress bar
  const ProgressBar = () => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
    </View>
  );

  // A component to render the completion badge
  const CompletionBadge = () => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeEmoji}>🏆</Text>
      <Text style={styles.badgeText}>Congratulations!</Text>
      <Text style={styles.badgeSubText}>Your 72-Hour Emergency Kit is ready!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text style={styles.header}>Gamified Task Prototype</Text>
          <Text style={styles.subHeader}>Build Your 72-Hour Emergency Kit</Text>

          <ProgressBar />

          {/* Render the checklist */}
          <View style={styles.checklistContainer}>
            {kitItems.map(item => (
              <Pressable key={item.id} onPress={() => handleToggleItem(item.id)} style={styles.checklistItem}>
                <Checkbox
                  style={styles.checkbox}
                  value={item.checked}
                  onValueChange={() => handleToggleItem(item.id)}
                  color={item.checked ? '#46a049' : undefined}
                />
                <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
          
          {/* Conditionally render the completion badge */}
          {progress === 100 && <CompletionBadge />}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  subHeader: { fontSize: 18, color: '#34495e', textAlign: 'center', marginBottom: 25 },
  
  // Progress Bar Styles
  progressBarContainer: {
    height: 40,
    width: '100%',
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    marginBottom: 25,
    justifyContent: 'center',
    overflow: 'hidden', // Ensures the fill doesn't bleed out of the corners
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 20,
    position: 'absolute', // Allows text to be overlaid
  },
  progressText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: 16,
  },

  // Checklist Styles
  checklistContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  checkbox: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1, // Ensures text wraps correctly
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },

  // Completion Badge Styles
  badgeContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3e6cb'
  },
  badgeEmoji: {
    fontSize: 50,
  },
  badgeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#155724',
    marginTop: 10,
  },
  badgeSubText: {
    fontSize: 16,
    color: '#155724',
    marginTop: 5,
  }
});

