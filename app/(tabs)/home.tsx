import React, { useEffect } from 'react';
import { View, Text, ProgressBarAndroid, FlatList, StyleSheet } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';

export default function HomeScreen(): React.JSX.Element {
  const { alerts, loading, error } = useAlerts();
  // For demonstration, hardcode progress (0-100%); replace with actual state later
  const preparednessProgress = 75;

  // Log the full first alert object for debugging (remove after checking)
  useEffect(() => {
    if (alerts.length > 0) {
      console.log('Full first alert data:', JSON.stringify(alerts[0], null, 2));
    }
  }, [alerts]);

  const renderAlertSummary = (): React.JSX.Element => {
    if (loading) return <Text>Loading latest alerts...</Text>;
    if (error) return <Text>Error loading alerts: {error}</Text>;
    if (alerts.length === 0) return <Text>No active alerts</Text>;

    return (
      <FlatList
        data={alerts.slice(0, 3)} // Show top 3 latest alerts for dashboard
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertSummaryCard}>
            <Text style={styles.alertEvent}>{item.event}</Text>
            <Text style={styles.alertTitle}>{item.title}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DisasterCan Dashboard</Text>
      
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Preparedness Progress</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={preparednessProgress / 100}
          color="#4CAF50"
        />
        <Text style={styles.progressText}>{preparednessProgress}% Ready</Text>
      </View>
      
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Latest Alerts</Text>
        {renderAlertSummary()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f9' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  progressSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  progressText: { textAlign: 'center', marginTop: 5 },
  alertsSection: { flex: 1 },
  alertSummaryCard: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  alertEvent: { fontSize: 16, fontWeight: 'bold', color: '#d9534f' },
  alertTitle: { fontSize: 14 },
});