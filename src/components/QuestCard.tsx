import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuestStore } from '../state/questStore';
import type { Quest } from '../constants/quests/questConfig';

// A reusable component for displaying a single quest card with progress
const QuestCard = ({ quest }: { quest: Quest }) => {
  const getQuestProgress = useQuestStore(state => state.getQuestProgress);
  const progress = getQuestProgress(quest.id); // e.g., 60%

  return (
    <Link href={`/quests/${quest.id}`} asChild>
      <TouchableOpacity style={styles.questCard}>
        <View>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questProgress}>{progress}% Complete</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#3498db" />
      </TouchableOpacity>
    </Link>
  );
};

export default QuestCard;

const styles = StyleSheet.create({
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  questTitle: { fontSize: 18, fontWeight: '600', color: '#34495e' },
  questProgress: { fontSize: 14, color: '#27ae60', marginTop: 4 },
});