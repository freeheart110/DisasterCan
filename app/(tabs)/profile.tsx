import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getEarnedBadges } from '../../src/services/badgeService';
import { useQuestStore } from '../../src/state/questStore';
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { formatUserId } from '../../src/utils/userUtils';
import { updateUserProfileField } from '../../src/services/profileService';

// ── Badge catalogue ───────────────────────────────────────────────────────────

const BADGE_CATALOGUE: {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  {
    id: 'Prepared Citizen',
    label: 'Prepared Citizen',
    description: 'Complete the 72-hour kit & family plan checklists',
    icon: 'shield-checkmark',
  },
  {
    id: 'Wildfire Smoke Ready',
    label: 'Wildfire Smoke Ready',
    description: 'Complete the wildfire smoke checklist & air quality quiz',
    icon: 'flame',
  },
];

// ── Stat tile ─────────────────────────────────────────────────────────────────

function StatTile({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────

const ProfileScreen = () => {
  const profile = useQuestStore((s) => s.userProfile);
  const updateProfile = useQuestStore((s) => s.updateProfile);
  const quests = useQuestStore((s) => s.quests);
  const getQuestProgress = useQuestStore((s) => s.getQuestProgress);
  const getLevelBarProgress = useQuestStore((s) => s.getLevelBarProgress);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);

  if (!profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2471a3" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const badges = getEarnedBadges(profile);
  const { level, progress, currentPoint, requiredPoint } = getLevelBarProgress();

  const preparednessScore =
    quests.length > 0
      ? Math.round(quests.reduce((sum, q) => sum + getQuestProgress(q.id), 0) / quests.length)
      : 0;

  const completedQuestCount = quests.filter((q) => getQuestProgress(q.id) === 100).length;

  const displayName = profile.displayName || formatUserId(profile.userId);
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2);

  const checklistQuests = quests.filter((q) => q.format === 'checklist');
  const quizQuests = quests.filter((q) => q.format === 'quiz');

  const openEdit = () => {
    setNameInput(profile.displayName || '');
    setEditModalVisible(true);
  };

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSaving(true);
    await updateUserProfileField(profile.userId, 'displayName', trimmed);
    updateProfile({ ...profile, displayName: trimmed });
    setSaving(false);
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* ── Edit name modal ── */}
      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.modalInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor="#bdc3c7"
              autoFocus
              maxLength={30}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, (!nameInput.trim() || saving) && { opacity: 0.5 }]}
                onPress={saveName}
                disabled={!nameInput.trim() || saving}
              >
                <Text style={styles.modalSaveText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Hero ── */}
      <LinearGradient
        colors={['#1a3a5c', '#2471a3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Name + edit button */}
        <View style={styles.nameRow}>
          <Text style={styles.heroUsername}>{displayName}</Text>
          <TouchableOpacity onPress={openEdit} style={styles.editBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="pencil" size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroSub}>Disaster Preparedness Member</Text>

        {/* XP bar */}
        <View style={styles.heroXpRow}>
          <Text style={styles.heroXpLabel}>Level {level}</Text>
          <Text style={styles.heroXpCount}>{currentPoint} / {requiredPoint} XP</Text>
        </View>
        <View style={styles.heroBarTrack}>
          <LinearGradient
            colors={['#f39c12', '#f1c40f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.heroBarFill, { width: `${progress}%` }]}
          />
        </View>
      </LinearGradient>

      {/* ── Stats grid ── */}
      <View style={styles.statsRow}>
        <StatTile icon="star" value={profile.point} label="Total XP" color="#f39c12" />
        <StatTile icon="layers" value={level} label="Level" color="#2471a3" />
        <StatTile icon="ribbon" value={badges.length} label="Badges" color="#8e44ad" />
        <StatTile icon="checkmark-done" value={`${preparednessScore}%`} label="Readiness" color="#27ae60" />
      </View>

      {/* ── Badges ── */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Badges</Text>
        {BADGE_CATALOGUE.map((b) => {
          const earned = badges.includes(b.id);
          return (
            <View key={b.id} style={[styles.badgeRow, earned ? styles.badgeRowEarned : styles.badgeRowLocked]}>
              <View style={[styles.badgeIconCircle, { backgroundColor: earned ? '#fef9e7' : '#f2f3f4' }]}>
                <Ionicons
                  name={earned ? b.icon : 'lock-closed'}
                  size={22}
                  color={earned ? '#f39c12' : '#bdc3c7'}
                />
              </View>
              <View style={styles.badgeTextBlock}>
                <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>{b.label}</Text>
                <Text style={styles.badgeDesc}>{b.description}</Text>
              </View>
              {earned && <Ionicons name="checkmark-circle" size={20} color="#27ae60" />}
            </View>
          );
        })}
        {badges.length === 0 && (
          <Text style={styles.emptyHint}>Complete quests to unlock your first badge!</Text>
        )}
      </View>

      {/* ── Quest progress ── */}
      {checklistQuests.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Checklists</Text>
          {checklistQuests.map((quest) => {
            const pct = getQuestProgress(quest.id);
            const done = pct === 100;
            return (
              <Link key={quest.id} href={`/quests/${quest.id}`} asChild>
                <TouchableOpacity style={styles.questRow}>
                  <View style={styles.questLeft}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'list-outline'}
                      size={20}
                      color={done ? '#27ae60' : '#2471a3'}
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={styles.questTitleRow}>
                        <Text style={styles.questTitle} numberOfLines={1}>{quest.title}</Text>
                        <Text style={[styles.questPct, { color: done ? '#27ae60' : '#2471a3' }]}>{pct}%</Text>
                      </View>
                      <View style={styles.questBarTrack}>
                        <View style={[styles.questBarFill, {
                          width: `${pct}%`,
                          backgroundColor: done ? '#27ae60' : '#2471a3',
                        }]} />
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#bdc3c7" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      )}

      {quizQuests.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quizzes</Text>
          {quizQuests.map((quest) => {
            const pct = getQuestProgress(quest.id);
            const done = pct === 100;
            return (
              <Link key={quest.id} href={`/quests/${quest.id}`} asChild>
                <TouchableOpacity style={styles.questRow}>
                  <View style={styles.questLeft}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'help-circle-outline'}
                      size={20}
                      color={done ? '#27ae60' : '#8e44ad'}
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={styles.questTitleRow}>
                        <Text style={styles.questTitle} numberOfLines={1}>{quest.title}</Text>
                        <Text style={[styles.questPct, { color: done ? '#27ae60' : '#8e44ad' }]}>
                          {done ? 'Done' : 'Incomplete'}
                        </Text>
                      </View>
                      {done && (
                        <View style={[styles.questBarTrack, { marginTop: 4 }]}>
                          <View style={[styles.questBarFill, { width: '100%', backgroundColor: '#27ae60' }]} />
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#bdc3c7" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      )}

      {/* ── Summary footer ── */}
      <View style={styles.summaryCard}>
        <Ionicons name="trophy" size={28} color="#f39c12" style={{ marginBottom: 6 }} />
        <Text style={styles.summaryTitle}>
          {completedQuestCount} of {quests.length} quests complete
        </Text>
        <Text style={styles.summaryHint}>
          Keep going — every completed quest makes your community safer.
        </Text>
      </View>

    </ScrollView>
  );
};

export default ProfileScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f4f9' },
  container: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#7f8c8d', fontSize: 15 },

  // Hero
  hero: {
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff' },
  heroUsername: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16 },
  heroXpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  heroXpLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  heroXpCount: { fontSize: 13, color: '#f1c40f', fontWeight: '600' },
  heroBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  heroBarFill: { height: '100%', borderRadius: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: '#2c3e50' },
  statLabel: { fontSize: 10, color: '#95a5a6', fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 14,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  badgeRowEarned: { backgroundColor: '#fdfaf0', borderWidth: 1, borderColor: '#f5cba7' },
  badgeRowLocked: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef' },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeTextBlock: { flex: 1 },
  badgeName: { fontSize: 14, fontWeight: '700', color: '#2c3e50', marginBottom: 2 },
  badgeNameLocked: { color: '#95a5a6' },
  badgeDesc: { fontSize: 12, color: '#7f8c8d' },
  emptyHint: { fontSize: 13, color: '#95a5a6', textAlign: 'center', paddingVertical: 8 },

  // Quests
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  questTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  questTitle: { fontSize: 14, fontWeight: '500', color: '#2c3e50', flex: 1, marginRight: 8 },
  questPct: { fontSize: 12, fontWeight: '700' },
  questBarTrack: { height: 5, backgroundColor: '#ecf0f1', borderRadius: 3, overflow: 'hidden' },
  questBarFill: { height: '100%', borderRadius: 3 },

  // Summary footer
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginBottom: 4 },
  summaryHint: { fontSize: 13, color: '#95a5a6', textAlign: 'center', lineHeight: 18 },

  // Name row + edit button
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, padding: 4,
  },

  // Edit name modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 24,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginBottom: 16 },
  modalInput: {
    borderWidth: 1, borderColor: '#d5dbdb', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 16, color: '#2c3e50', marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#d5dbdb', alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#7f8c8d' },
  modalSave: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    backgroundColor: '#2471a3', alignItems: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#fff' },

});
