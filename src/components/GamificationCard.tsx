import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuestStore } from '../state/questStore';

// Simple horizontal progress bar component
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

/**
 * GamificationCard displays the user's points, level, and progress to the next level.
 * It reads profile data from the global quest store.
 */
export const GamificationCard = () => {
  const { userProfile, getLevelBarProgress } = useQuestStore();
  const pointProgress = getLevelBarProgress();

  if (!userProfile) return null;

  // Display name fallback
  const displayName = userProfile.userId || 'Anonymous';

  // Clamp current points to 0 to avoid negative numbers
  const currentPoint = Math.max(pointProgress.currentPoint, 0);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.username}>User: {displayName}</Text>
      </View>

      <Text style={styles.level}>Level {pointProgress.level}</Text>

      <ProgressBar progress={pointProgress.progress} />

      <Text style={styles.progressText}>
        Points: {currentPoint} / {pointProgress.requiredPoint}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  username: {
    fontSize: 16,
    color: '#2c3e50',
  },
  level: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2980b9',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  progressText: {
    textAlign: 'right',
    marginTop: 8,
    color: '#27ae60',
    fontWeight: '500',
  },
});