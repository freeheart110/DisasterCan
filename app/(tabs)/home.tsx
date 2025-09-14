import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import { formatTimeAgo } from '../../src/utils/dateUtils';
import { useQuestStore } from '../../src/state/questStore';
import { useLocations } from '../../src/hooks/useLocations';

// A simple, cross-platform progress bar component.
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default function HomeScreen(): React.JSX.Element {
  // Fetches both alert and location data using their respective hooks.
  const { alerts, loading, isPolling, error, lastChecked } = useAlerts();
  // Correctly destructure and rename properties from the useLocations hook.
  const { locationInfo: location, loading: isLocationLoading, error: locationError } = useLocations();
  const preparednessProgress = useQuestStore(state => state.getTotalProgress());

  /**
   * Renders the status of the alert feed, showing when the app is actively polling
   * for new data or when the last check was performed.
   */
  const renderFeedStatus = () => {
    if (isPolling) {
      return <Text style={styles.feedStatusText}>Checking for new alerts...</Text>;
    }
    if (lastChecked) {
      return <Text style={styles.feedStatusText}>Last checked: {lastChecked.toLocaleTimeString()}</Text>;
    }
    return null;
  };

  /**
   * Renders a summary list of the top 3 latest alerts.
   * Handles loading, error, and empty states.
   */
  const renderAlertSummary = (): React.JSX.Element => {
    if (loading) return <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />;
    if (error) return <Text style={styles.errorText}>Could not load alerts: {error}</Text>;
    if (alerts.length === 0) return <Text style={styles.noAlertsText}>No active alerts for your area.</Text>;

    return (
      <FlatList
        data={alerts.slice(0, 3)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`/alert-detail/${item.id}`} asChild>
            <View style={styles.alertSummaryCard}>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertEvent}>{item.event}</Text>
                <Text style={styles.alertTitle}>{item.title}</Text>
              </View>
              <Text style={styles.alertTime}>{formatTimeAgo(item.published)}</Text>
            </View>
          </Link>
        )}
        scrollEnabled={false}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* Card for displaying live location data for debugging purposes. */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location Debug Info</Text>
        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : (
          isLocationLoading ? <ActivityIndicator /> : (
            location ? (
              <>
                <Text>Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</Text>
                <Text>Address: {location.fullAddress}</Text>
                <Text>Region Code: {location.regionCode}</Text>
              </>
            ) : <Text>Unable to determine location.</Text>
          )
        )}
      </View>
      
      {/* Card displaying the user's overall preparedness progress. */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preparedness Progress</Text>
        <ProgressBar progress={preparednessProgress} />
        <Text style={styles.progressText}>{preparednessProgress}% Ready</Text>
      </View>
      
      {/* Card displaying the latest alerts and the polling status. */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Alerts</Text>
        </View>
        {renderAlertSummary()}
        <View style={styles.feedStatusContainer}>
          {renderFeedStatus()}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f9' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2c3e50' },
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#34495e' },
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
  progressText: { textAlign: 'right', marginTop: 8, color: '#27ae60', fontWeight: '500' },
  alertSummaryCard: { 
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  alertEvent: { fontSize: 16, fontWeight: 'bold', color: '#c0392b', textTransform: 'capitalize' },
  alertTitle: { fontSize: 14, color: '#7f8c8d' },
  alertTime: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  errorText: { color: '#c0392b', textAlign: 'center', marginTop: 10 },
  noAlertsText: { color: '#7f8c8d', textAlign: 'center', marginTop: 10 },
  feedStatusContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  feedStatusText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});

