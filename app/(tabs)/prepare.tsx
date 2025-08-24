import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuestStore } from '../../src/state/questStore';

export default function PrepareScreen(): React.JSX.Element {
  const getQuestProgress = useQuestStore(state => state.getQuestProgress);
  const kitQuestId = 'kit-1'; // The ID from constants/quests.ts file
  const progress = getQuestProgress(kitQuestId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Preparedness Quests</Text>
        <Text style={styles.subHeader}>Complete these quests to become more resilient.</Text>

        {/* Quest Card for the 72-Hour Kit */}
        <Link href="/kit-checklist" asChild>
          <TouchableOpacity style={styles.questCard}>
            <View>
              <Text style={styles.questTitle}>Build a 72-Hour Kit</Text>
              <Text style={styles.questProgress}>{progress}% Complete</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#3498db" />
          </TouchableOpacity>
        </Link>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
  subHeader: { fontSize: 16, color: '#7f8c8d', marginBottom: 24 },
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
