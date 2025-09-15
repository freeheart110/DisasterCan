import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import { alertIcons } from '../../src/constants/alertIcons';
import { formatTimeAgo } from '../../src/utils/dateUtils';
import { alertQuestMap } from '../../src/constants/quests/alertQuestMap';
import { Ionicons } from '@expo/vector-icons';
import { severityColors } from '../../src/constants/colors';
import type { Alert } from '../../src/services/alertService';

export default function AlertsScreen(): React.JSX.Element {
  const { alerts, loading, error } = useAlerts();
  const [showPast, setShowPast] = useState(false);

  const activeAlerts = alerts.filter(a => a.isActive);
  const pastAlerts = alerts.filter(a => !a.isActive);

  const togglePastAlerts = () => setShowPast(prev => !prev);

  const renderAlertCard = (item: Alert) => {
    const iconName = alertIcons[item.event.toLowerCase()] || 'alert-circle-outline';
    const severityColor = severityColors[item.severity.toLowerCase()] || '#999';
    const questId = alertQuestMap[item.event.toLowerCase()];
    const isEnded = item.headline.toLowerCase().includes('ended');

    return (
      <Link href={`/alert-detail/${item.id}`} asChild>
        <TouchableOpacity style={styles.alertCard}>
          <View style={styles.iconRow}>
            <Ionicons name={iconName} size={26} color={severityColor} style={{ marginRight: 10 }} />
            <Text style={[styles.eventText, { color: severityColor }]}>
              {item.event} ({item.severity})
            </Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(item.published)}</Text>
          </View>
          <Text style={styles.headline} numberOfLines={2}>
            {item.headline}
          </Text>

          {/* Prepare Now button */}
          {questId && !isEnded && (
            <Link href={`/quests/${questId}`} asChild>
              <TouchableOpacity style={styles.prepareButton}>
                <Text style={styles.prepareButtonText}>Prepare Now</Text>
              </TouchableOpacity>
            </Link>
          )}
        </TouchableOpacity>
      </Link>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionTitle}>Active Alerts</Text>

      {/* Active Alerts List */}
      <FlatList
        data={activeAlerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderAlertCard(item)}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="checkmark-done-outline" size={48} color="#ccc" />
            <Text style={styles.noAlertsText}>No active alerts in the past 12 hours</Text>
          </View>
        }
      />

      {/* Toggle Button for Past Alerts */}
      {pastAlerts.length > 0 && (
        <Pressable onPress={togglePastAlerts} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {showPast ? 'Hide Past Alerts' : `Show ${pastAlerts.length} Past Alerts`}
          </Text>
        </Pressable>
      )}

      {/* Past Alerts */}
      {showPast && (
        <>
          <Text style={styles.sectionTitle}>Past Alerts</Text>
          <FlatList
            data={pastAlerts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderAlertCard(item)}
          />
        </>
      )}
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  noAlertsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textTransform: 'capitalize',
  },
  timeAgo: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  headline: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 8,
  },
  prepareButton: {
    backgroundColor: '#007aff',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  prepareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007aff',
  },
});