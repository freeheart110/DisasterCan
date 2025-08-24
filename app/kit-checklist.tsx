import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuestStore } from '../src/state/questStore';
import type { ChecklistItem } from '../src/constants/quests';

// Reusable Checklist Item Component
const ChecklistItemComponent = ({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onToggle}>
    <Ionicons
      name={item.completed ? 'checkbox' : 'square-outline'}
      size={24}
      color={item.completed ? '#27ae60' : '#bdc3c7'}
    />
    <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
      {item.text}
    </Text>
  </TouchableOpacity>
);

export default function KitChecklistScreen(): React.JSX.Element {
  const router = useRouter();
  
  // 1. Get the functions and the entire quests array from the store.
  const quests = useQuestStore(state => state.quests);
  const toggleItemCompleted = useQuestStore(state => state.toggleItemCompleted);
  const getQuestProgress = useQuestStore(state => state.getQuestProgress);

  // 2. Find the specific quest we want to display on this screen.
  const kitQuestId = 'kit-1'; // The ID from constants/quests.ts file
  const kitQuest = quests.find(q => q.id === kitQuestId);

  // 3. Calculate the progress for this specific quest.
  const progress = getQuestProgress(kitQuestId);

  // Handle the case where the quest might not be found.
  if (!kitQuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Error: 72-Hour Kit quest not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          headerTitle: '72-Hour Kit',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="chevron-back" size={28} color="#007AFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      <FlatList
        data={kitQuest.categories}
        keyExtractor={(category) => category.title}
        renderItem={({ item: category }) => (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item) => (
              <ChecklistItemComponent
                key={item.id}
                item={item}
                // 4. Pass the questId to the toggle function.
                onToggle={() => toggleItemCompleted(kitQuestId, category.title, item.id)}
              />
            ))}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.progressText}>Overall Progress: {progress}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
  listContent: { padding: 20 },
  headerContainer: { marginBottom: 20 },
  progressText: { fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 8 },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#27ae60' },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#34495e',
    flex: 1,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#bdc3c7',
  },
});
