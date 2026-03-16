import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuestStore } from '../state/questStore';
import { formatUserId } from '../utils/userUtils';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * GamificationCard displays the user's greeting, level badge, and XP progress bar.
 */
export const GamificationCard = () => {
  const { userProfile, getLevelBarProgress } = useQuestStore();
  const pointProgress = getLevelBarProgress();

  if (!userProfile) return null;

  const displayName = userProfile.displayName || formatUserId(userProfile.userId);
  const currentPoint = Math.max(pointProgress.currentPoint, 0);
  const pointsToNext = pointProgress.requiredPoint - currentPoint;

  return (
    <LinearGradient
      colors={['#1a3a5c', '#2471a3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Top row: greeting + level badge */}
      <View style={styles.topRow}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username} numberOfLines={1}>{displayName}</Text>
        </View>

        {/* Level badge */}
        <View style={styles.levelBadge}>
          <Ionicons name="shield-checkmark" size={18} color="#f39c12" />
          <Text style={styles.levelNumber}>{pointProgress.level}</Text>
          <Text style={styles.levelLabel}>LVL</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* XP progress */}
      <View style={styles.xpRow}>
        <Ionicons name="star" size={13} color="#f1c40f" style={{ marginRight: 5 }} />
        <Text style={styles.xpLabel}>XP Progress</Text>
        <Text style={styles.xpCount}>{currentPoint} / {pointProgress.requiredPoint}</Text>
      </View>

      <View style={styles.barTrack}>
        <LinearGradient
          colors={['#f39c12', '#f1c40f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${pointProgress.progress}%` }]}
        />
      </View>

      <Text style={styles.nextLevel}>
        {pointsToNext > 0 ? `${pointsToNext} pts to Level ${pointProgress.level + 1}` : 'Level up ready!'}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1a3a5c',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingBlock: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 48,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 20,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 14,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    flex: 1,
  },
  xpCount: {
    fontSize: 12,
    color: '#f1c40f',
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextLevel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 6,
    textAlign: 'right',
  },
});
