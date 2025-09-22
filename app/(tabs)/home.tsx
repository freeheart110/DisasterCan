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
import { useQuestStore } from '../../src/state/questStore';
import { useLocations } from '../../src/hooks/useLocations';
import { severityColors } from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { alertIcons } from '../../src/constants/alertIcons';
import { GamificationCard } from '../../src/components/GamificationCard'; 
import { useWeather } from '../../src/hooks/useWeather';
import { WeatherCard } from '../../src/components/WeatherCard';

export default function HomeScreen(): React.JSX.Element {
  // Fetch alerts (polling, loading, error, timestamps)
  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
    isPolling,
    lastChecked,
  } = useAlerts();
  
  // Fetch weather card
  const { weather, loading: weatherLoading } = useWeather();

  // Fetch location debug info
  // const {
  //   locationInfo,
  //   loading: locationLoading,
  //   error: locationError,
  // } = useLocations();

  // === Alert List Renderer ===
  const renderAlertSummary = (): React.JSX.Element => {
    if (alertsLoading)
      return <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />;
    if (alertsError)
      return (
        <Text style={styles.errorText}>Could not load alerts: {alertsError}</Text>
      );

    // Group active alerts by productCode to avoid duplicates
    const groupedActiveAlerts: { [code: string]: typeof alerts[0] } = {};
    alerts.forEach((alert) => {
      if (alert.isActive && !groupedActiveAlerts[alert.productCode]) {
        groupedActiveAlerts[alert.productCode] = alert;
      }
    });

    // Take most recent 3 alerts
    const activeAlertList = Object.values(groupedActiveAlerts)
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
      .slice(0, 3);

    if (activeAlertList.length === 0)
      return (
        <Text style={styles.noAlertsText}>
          No active alerts in the past 12 hours.
        </Text>
      );

    return (
      <>
        <FlatList
          data={activeAlertList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Lookup icon and severity color
            const severityColor =
              severityColors[item.severity?.toLowerCase()] || '#6c757d'; // fallback to gray
            const iconName =
              alertIcons[item.event?.toLowerCase()] || 'alert-circle-outline';

            return (
              <Link href={`/alert-detail/${item.id}`} asChild>
                <TouchableOpacity style={styles.alertSummaryCard}>
                  {/* Severity-colored icon */}
                  <Ionicons
                    name={iconName}
                    size={32}
                    color={severityColor}
                    style={styles.alertIcon}
                  />

                  {/* Event + Severity label and Headline */}
                  <View style={styles.alertTextContainer}>
                    <Text style={[styles.alertEvent, { color: severityColor }]}>
                      {item.event} ({item.severity})
                    </Text>
                    <Text style={styles.alertTitle} numberOfLines={1}>
                      {item.headline}
                    </Text>
                  </View>

                  {/* Time since published */}
                  <Text style={styles.alertTime}>
                    {formatTimeAgo(item.published)}
                  </Text>
                </TouchableOpacity>
              </Link>
            );
          }}
          scrollEnabled={false}
        />

        {/* Link to full alert page */}
        <Link href="/(tabs)/alerts" asChild>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Alerts</Text>
          </TouchableOpacity>
        </Link>
      </>
    );
  };

  // === Alert Polling Status (Last Checked) ===
  const renderPollingStatus = (): React.JSX.Element | null => {
    if (alertsLoading) return null;
    if (isPolling)
      return <Text style={styles.statusText}>Checking for new alerts...</Text>;
    if (lastChecked)
      return (
        <Text style={styles.statusText}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </Text>
      );
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <GamificationCard />
      {/* Weather Section (if available) */}
      {!weatherLoading && weather && <WeatherCard weather={weather} />}

      {/* Location Debug Info
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location Debug Info</Text>
        {locationLoading && <ActivityIndicator />}
        {locationError && (
          <Text style={styles.errorText}>{locationError}</Text>
        )}
        {locationInfo && (
          <View>
            <Text style={styles.debugText}>
              Lat: {locationInfo.latitude.toFixed(4)}
            </Text>
            <Text style={styles.debugText}>
              Lon: {locationInfo.longitude.toFixed(4)}
            </Text>
            <Text style={styles.debugText}>
              Address: {locationInfo.fullAddress}
            </Text>
            <Text style={styles.debugText}>
              Region Code: {locationInfo.regionCode}
            </Text>
          </View>
        )}
      </View> */}

      {/* Latest Alerts */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Latest Alerts</Text>
        {renderAlertSummary()}
        <View style={styles.statusContainer}>{renderPollingStatus()}</View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f9' },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
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

  // --- ALERT CARD STYLES ---
  alertSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1, // Allows text to take up available space
  },
  alertEvent: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  alertTitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  alertTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
    marginLeft: 8,
  },
  // -----------------------------

  viewAllButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 10,
  },
  noAlertsText: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
  },
  debugText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
    fontFamily: 'Menlo',
  },
  statusContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#7f8c8d',
  },
});