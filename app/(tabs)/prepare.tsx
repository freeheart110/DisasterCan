import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuestStore } from '../../src/state/questStore';
import QuestCard from '../../src/components/QuestCard';
import type { Quest } from '../../src/constants/quests/questConfig';

export default function PrepareScreen(): React.JSX.Element {
  // Get all quests from global state (Zustand)
  const quests = useQuestStore(state => state.quests);

  // Separate quests by their format type
  const checklistQuests = quests.filter((q: Quest) => q.format === 'checklist');
  const quizQuests = quests.filter((q: Quest) => q.format === 'quiz');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Screen header */}
        <Text style={styles.header}>Preparedness Quests</Text>
        <Text style={styles.subHeader}>
          Complete these quests to become more resilient.
        </Text>

        {/* Checklist Quests Section */}
        {checklistQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Checklists</Text>
            {checklistQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </View>
        )}

        {/* Quiz Quests Section */}
        {quizQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Quizzes</Text>
            {quizQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4, // keep header closer to subheader
  },
  subHeader: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
});
