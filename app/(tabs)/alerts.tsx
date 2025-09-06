import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import type { Alert } from '../../src/services/alertService';

/**
 * A reusable UI component to display a summary of a single alert.
 * This card shows the event type, headline, severity, and affected area.
 */
const AlertCard = ({ item }: { item: Alert }) => (
  <View style={styles.alertCard}>
    <Text style={styles.event}>{item.event}</Text>
    <Text style={styles.title}>{item.headline}</Text>
    <Text style={styles.detail}>Severity: {item.severity}</Text>
    <Text style={styles.detail}>Area: {item.areaDesc}</Text>
  </View>
);

/**
 * The main screen for the "Alerts" tab.
 * It fetches and displays a list of all active emergency alerts.
 */
export default function AlertsScreen(): React.JSX.Element {
  // Fetch the global state of all alerts, including loading and error status.
  const { alerts, loading, error } = useAlerts();

  // Show a loading indicator while alerts are being fetched.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Display an error message if the fetch fails.
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          // It navigates to the alert detail screen, passing the specific alert's ID.
          <Link href={`/alert-detail/${item.id}`} asChild>
            {/* TouchableOpacity makes the entire card tappable. */}
            <TouchableOpacity>
              <AlertCard item={item} />
            </TouchableOpacity>
          </Link>
        )}
        // Display a message if there are no active alerts.
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No active alerts</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f4f4f9' 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Give some space from the top
  },
  alertCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 16, 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  event: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  title: { 
    fontSize: 16, 
    marginTop: 4, 
    color: '#333' 
  },
  detail: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
});

