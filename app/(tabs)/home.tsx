import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import { formatTimeAgo } from '../../src/utils/dateUtils';
import { severityColors } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { alertIcons } from '../../src/constants/alertIcons';
import { GamificationCard } from '../../src/components/GamificationCard';
import { useWeather } from '../../src/hooks/useWeather';
import { WeatherCard, WeatherCardSkeleton } from '../../src/components/WeatherCard';
import { useQuestStore } from '../../src/state/questStore';
import { useLocalResources } from '../../src/hooks/useLocalResources';

// ── Types ─────────────────────────────────────────────────────────────────────

type AlertItem = ReturnType<typeof useAlerts>['alerts'][number];

// ── Status Banner (only shown when there are active alerts) ───────────────────

type BannerConfig = {
  bg: string;
  color: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
};

function getStatusBanner(alerts: AlertItem[], loading: boolean): BannerConfig | null {
  if (loading) return null;
  const active = alerts.filter((a) => a.isActive);
  if (active.some((a) => ['extreme', 'severe'].includes(a.severity?.toLowerCase()))) {
    return {
      bg: '#fdecea',
      color: '#c0392b',
      icon: 'warning',
      text: 'Active Warnings in Your Area',
    };
  }
  if (active.some((a) => ['moderate', 'minor'].includes(a.severity?.toLowerCase()))) {
    return {
      bg: '#fef9e7',
      color: '#f39c12',
      icon: 'alert-circle',
      text: 'Active Watches in Your Area',
    };
  }
  return null;
}

function StatusBanner({ alerts, loading }: { alerts: AlertItem[]; loading: boolean }) {
  const banner = getStatusBanner(alerts, loading);
  if (!banner) return null;
  return (
    <View style={[styles.banner, { backgroundColor: banner.bg, borderColor: banner.color }]}>
      <Ionicons name={banner.icon} size={20} color={banner.color} style={styles.bannerIcon} />
      <Text style={[styles.bannerText, { color: banner.color }]}>{banner.text}</Text>
    </View>
  );
}

// ── Alert List ────────────────────────────────────────────────────────────────

function AlertList({
  alerts,
  loading,
  error,
}: {
  alerts: AlertItem[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />;
  if (error) return <Text style={styles.errorText}>Could not load alerts: {error}</Text>;

  const grouped: { [code: string]: AlertItem } = {};
  alerts.forEach((alert) => {
    if (alert.isActive && !grouped[alert.productCode]) {
      grouped[alert.productCode] = alert;
    }
  });

  const list = Object.values(grouped)
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, 3);

  if (list.length === 0) {
    return (
      <Text style={styles.noAlertsText}>No active alerts in the past 12 hours.</Text>
    );
  }

  return (
    <>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const severityColor = severityColors[item.severity?.toLowerCase()] || '#6c757d';
          const iconName = alertIcons[item.event?.toLowerCase()] || 'alert-circle-outline';
          return (
            <Link href={`/alert-detail/${item.id}`} asChild>
              <TouchableOpacity
                style={[styles.alertSummaryCard, { borderLeftColor: severityColor }]}
              >
                <Ionicons
                  name={iconName}
                  size={32}
                  color={severityColor}
                  style={styles.alertIcon}
                />
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertEvent, { color: severityColor }]}>
                    {item.event} ({item.severity})
                  </Text>
                  <Text style={styles.alertTitle} numberOfLines={1}>
                    {item.headline}
                  </Text>
                </View>
                <Text style={styles.alertTime}>{formatTimeAgo(item.published)}</Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      />
      <Link href="/(tabs)/alerts" asChild>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Alerts</Text>
        </TouchableOpacity>
      </Link>
    </>
  );
}

// ── Polling Status ────────────────────────────────────────────────────────────

function PollingStatus({
  loading,
  isPolling,
  lastChecked,
}: {
  loading: boolean;
  isPolling: boolean;
  lastChecked: Date | null;
}) {
  if (loading) return null;
  if (isPolling) return <Text style={styles.statusText}>Checking for new alerts...</Text>;
  if (lastChecked)
    return (
      <Text style={styles.statusText}>Last checked: {lastChecked.toLocaleTimeString()}</Text>
    );
  return null;
}

// ── Badges Card ───────────────────────────────────────────────────────────────

const ALL_BADGES: { id: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'Prepared Citizen', label: 'Prepared Citizen', icon: 'shield-checkmark' },
  { id: 'Wildfire Smoke Ready', label: 'Wildfire Smoke Ready', icon: 'flame' },
];

function BadgesCard({ earnedBadges }: { earnedBadges: string[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgeRow}>
        {ALL_BADGES.map((badge) => {
          const earned = earnedBadges.includes(badge.id);
          return (
            <View key={badge.id} style={[styles.badge, earned ? styles.badgeEarned : styles.badgeLocked]}>
              <Ionicons
                name={earned ? badge.icon : 'lock-closed'}
                size={22}
                color={earned ? '#f39c12' : '#bdc3c7'}
              />
              <Text style={[styles.badgeLabel, !earned && styles.badgeLabelLocked]}>
                {badge.label}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.badgeHint}>
        {earnedBadges.length}/{ALL_BADGES.length} earned — complete quests to unlock more
      </Text>
    </View>
  );
}

// ── Quest Progress Card ───────────────────────────────────────────────────────

function QuestProgressCard() {
  const quests = useQuestStore((state) => state.quests);
  const getQuestProgress = useQuestStore((state) => state.getQuestProgress);
  const isLoading = useQuestStore((state) => state.isLoading);

  if (isLoading) return null;
  if (quests.length === 0) return null;

  // Sort: incomplete first, then by progress descending (most started)
  const sorted = [...quests].sort((a, b) => {
    const pa = getQuestProgress(a.id);
    const pb = getQuestProgress(b.id);
    if (pa === 100 && pb !== 100) return 1;
    if (pb === 100 && pa !== 100) return -1;
    return pb - pa;
  });

  const top = sorted.slice(0, 3);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Preparedness Quests</Text>
      {top.map((quest) => {
        const progress = getQuestProgress(quest.id);
        const done = progress === 100;
        return (
          <Link key={quest.id} href={`/quests/${quest.id}`} asChild>
            <TouchableOpacity style={styles.questRow}>
              <View style={styles.questLeft}>
                <Ionicons
                  name={done ? 'checkmark-circle' : quest.format === 'quiz' ? 'help-circle-outline' : 'list-outline'}
                  size={20}
                  color={done ? '#27ae60' : '#3498db'}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.questTitle} numberOfLines={1}>{quest.title}</Text>
                  <View style={styles.questProgressBar}>
                    <View style={[styles.questProgressFill, { width: `${progress}%`, backgroundColor: done ? '#27ae60' : '#3498db' }]} />
                  </View>
                </View>
              </View>
              <Text style={[styles.questPct, { color: done ? '#27ae60' : '#3498db' }]}>{progress}%</Text>
            </TouchableOpacity>
          </Link>
        );
      })}
      <Link href="/(tabs)/prepare" asChild>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Quests</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

// ── Nearby Resources Card ─────────────────────────────────────────────────────

const FACILITY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  hospital: 'medkit',
  'hospital (emergency)': 'medkit',
  shelter: 'home',
  'mental health': 'heart',
  'walk-in clinic': 'fitness',
  clinic: 'fitness',
};

function NearbyResourcesCard() {
  const { resources, loading, error } = useLocalResources();

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nearby Emergency Resources</Text>
        <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />
      </View>
    );
  }

  if (error || resources.length === 0) return null;

  const top = resources.slice(0, 2);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Nearby Emergency Resources</Text>
      {top.map((r) => {
        const typeKey = r.odhf_facility_type?.toLowerCase() ?? '';
        const icon: React.ComponentProps<typeof Ionicons>['name'] =
          Object.keys(FACILITY_ICONS).find((k) => typeKey.includes(k))
            ? FACILITY_ICONS[Object.keys(FACILITY_ICONS).find((k) => typeKey.includes(k))!]
            : 'business-outline';
        return (
          <View key={r.id} style={styles.resourceRow}>
            <Ionicons name={icon} size={22} color="#2980b9" style={styles.resourceIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName} numberOfLines={1}>{r.facility_name}</Text>
              <Text style={styles.resourceType}>{r.odhf_facility_type} · {r.city}</Text>
            </View>
          </View>
        );
      })}
      <Link href="/(tabs)/resources" asChild>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Resources</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────

export default function HomeScreen(): React.JSX.Element {
  const { alerts, loading: alertsLoading, error: alertsError, isPolling, lastChecked } = useAlerts();
  const { weather, loading: weatherLoading } = useWeather();
  const userProfile = useQuestStore((state) => state.userProfile);

  return (
    <ScrollView style={styles.container}>
      <GamificationCard />

      <StatusBanner alerts={alerts} loading={alertsLoading} />

      {/* Weather */}
      {weatherLoading ? (
        <WeatherCardSkeleton />
      ) : weather ? (
        <WeatherCard weather={weather} />
      ) : null}

      {/* Latest Alerts */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Latest Alerts</Text>
        <AlertList alerts={alerts} loading={alertsLoading} error={alertsError} />
        <View style={styles.statusContainer}>
          <PollingStatus loading={alertsLoading} isPolling={isPolling} lastChecked={lastChecked} />
        </View>
      </View>

      {/* Badges */}
      {userProfile && <BadgesCard earnedBadges={userProfile.badges ?? []} />}

      {/* Quest Progress */}
      <QuestProgressCard />

      {/* Nearby Resources */}
      <NearbyResourcesCard />
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f9' },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  bannerIcon: { marginRight: 8 },
  bannerText: { fontSize: 15, fontWeight: '600' },

  // Shared card
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#34495e',
  },

  // Alert card
  alertSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginLeft: -16,
    paddingRight: 0,
  },
  alertIcon: { marginRight: 12 },
  alertTextContainer: { flex: 1 },
  alertEvent: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  alertTitle: { fontSize: 14, color: '#7f8c8d' },
  alertTime: { fontSize: 12, fontWeight: '500', color: '#7f8c8d', marginLeft: 8 },

  // Shared button
  viewAllButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: { color: 'white', fontWeight: '600', fontSize: 16 },

  errorText: { color: '#c0392b', textAlign: 'center', marginTop: 10 },
  noAlertsText: { color: '#7f8c8d', textAlign: 'center', marginTop: 10 },
  statusContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusText: { textAlign: 'center', fontStyle: 'italic', color: '#7f8c8d' },

  // Badges
  badgeRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  badgeEarned: { backgroundColor: '#fef9e7', borderWidth: 1, borderColor: '#f39c12' },
  badgeLocked: { backgroundColor: '#f2f3f4', borderWidth: 1, borderColor: '#d5dbdb' },
  badgeLabel: { fontSize: 13, fontWeight: '600', color: '#d68910' },
  badgeLabelLocked: { color: '#aab7b8' },
  badgeHint: { fontSize: 12, color: '#95a5a6', marginTop: 10 },

  // Quests
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  questTitle: { fontSize: 14, fontWeight: '500', color: '#2c3e50', marginBottom: 4 },
  questProgressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  questProgressFill: { height: '100%', borderRadius: 3 },
  questPct: { fontSize: 13, fontWeight: '600', marginLeft: 10, minWidth: 36, textAlign: 'right' },

  // Resources
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resourceIcon: { marginRight: 12 },
  resourceName: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  resourceType: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
});
