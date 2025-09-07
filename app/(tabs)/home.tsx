import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { useLocations } from '../../src/hooks/useLocations';
import { Link } from 'expo-router';
import { formatTimeAgo } from '../../src/utils/dateUtils';
import { useQuestStore } from '../../src/state/questStore';

// A simple, cross-platform progress bar component
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default function HomeScreen(): React.JSX.Element {
  const { alerts, loading: alertsLoading, error: alertsError } = useAlerts();
  const { locationInfo, loading: locationLoading, error: locationError } = useLocations();
  const preparednessProgress = useQuestStore(state => state.getTotalProgress());

  const renderAlertSummary = (): React.JSX.Element => {
    if (alertsLoading) return <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />;
    if (alertsError) return <Text style={styles.errorText}>Could not load alerts: {alertsError}</Text>;
    if (alerts.length === 0) return <Text style={styles.noAlertsText}>No active alerts for your area.</Text>;

    return (
      <FlatList
        data={alerts.slice(0, 3)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href={`/alert-detail/${item.id}`} asChild>
            <TouchableOpacity>
              <View style={styles.alertSummaryCard}>
                <View style={styles.alertTextContainer}>
                  <Text style={styles.alertEvent}>{item.event}</Text>
                  <Text style={styles.alertTitle}>{item.title}</Text>
                </View>
                <Text style={styles.alertTime}>{formatTimeAgo(item.published)}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        scrollEnabled={false}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* --- LOCATION DEBUG CARD --- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location Debug Info</Text>
        {locationLoading && <ActivityIndicator />}
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        {locationInfo && (
          <View>
            <Text style={styles.debugText}>Lat: {locationInfo.latitude.toFixed(4)}</Text>
            <Text style={styles.debugText}>Lon: {locationInfo.longitude.toFixed(4)}</Text>
            {/* Display the full address string from the geocoder */}
            <Text style={styles.debugText}>Address: {locationInfo.fullAddress}</Text>
            <Text style={styles.debugText}>Alert Region Code: {locationInfo.regionCode}</Text>
          </View>
        )}
      </View>
      {/* ------------------------- */}
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preparedness Progress</Text>
        <ProgressBar progress={preparednessProgress} />
        <Text style={styles.progressText}>{preparednessProgress}% Ready</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Latest Alerts</Text>
        {renderAlertSummary()}
      </View>
    </ScrollView>
  );
}

// Add ScrollView to the imports
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  // ... existing styles
  container: { flex: 1, backgroundColor: '#f4f4f9' }, // Note: container styling might need adjustment for ScrollView
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2c3e50', paddingTop: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 20, 
    marginHorizontal: 16,
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#34495e' },
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
  alertEvent: { fontSize: 16, fontWeight: 'bold', color: '#c0392b' },
  alertTitle: { fontSize: 14, color: '#7f8c8d' },
  alertTime: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  errorText: { color: '#c0392b', textAlign: 'center', marginTop: 10 },
  noAlertsText: { color: '#7f8c8d', textAlign: 'center', marginTop: 10 },
  debugText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

