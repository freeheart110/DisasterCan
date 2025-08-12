import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';

const AlertsScreen = (): JSX.Element => {
  const { alerts, loading, error } = useAlerts();

  if (loading) return <Text>Loading alerts...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={styles.event}>{item.event}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.detail}>Severity: {item.severity}</Text>
            <Text style={styles.detail}>Area: {item.areaDesc}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No active alerts</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  alertCard: { backgroundColor: '#fff', padding: 16, marginBottom: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  event: { fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 16, marginTop: 4 },
  detail: { fontSize: 14, color: '#666' },
  summary: { fontSize: 14, marginTop: 8 },
});

export default AlertsScreen;