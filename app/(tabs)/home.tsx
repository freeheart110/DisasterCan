import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import { formatTimeAgo } from '../../src/utils/dateUtils';
import { useQuestStore } from '../../src/state/questStore';

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

export default function HomeScreen(): React.JSX.Element {
  const { alerts, loading, error } = useAlerts();
  const preparednessProgress = useQuestStore(state => state.getTotalProgress());

  const renderAlertSummary = (): React.JSX.Element => {
    if (loading) return <ActivityIndicator color="#007AFF" style={{ marginTop: 10 }} />;
    if (error) return <Text style={styles.errorText}>Could not load alerts: {error}</Text>;
    if (alerts.length === 0) return <Text style={styles.noAlertsText}>No active alerts for your area.</Text>;

    return (
      <FlatList
        data={alerts.slice(0, 3)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Link href="/(tabs)/alerts" asChild>
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
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preparedness Progress</Text>
        <ProgressBar progress={preparednessProgress} />
        <Text style={styles.progressText}>{preparednessProgress}% Ready</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Latest Alerts</Text>
        {renderAlertSummary()}
      </View>
    </View>
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
});
