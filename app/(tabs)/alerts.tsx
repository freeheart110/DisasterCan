import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import type { Alert } from '../../src/services/alertService';
import { alertQuestMap } from '../../src/constants/quests/alertQuestMap';

/**
 * A reusable UI component to display a summary of a single alert.
 * It now includes a conditional "Prepare" button if a relevant quest exists.
 */
const AlertCard = ({ item }: { item: Alert }) => {
  // Check the map to see if there is a quest associated with this alert's event type.
  const questId = alertQuestMap[item.event.toLowerCase()];

  return (
    <View style={styles.alertCard}>
      <Link href={`/alert-detail/${item.id}`} asChild>
        <TouchableOpacity style={styles.alertContent}>
          <Text style={styles.event}>{item.event}</Text>
          <Text style={styles.title}>{item.headline}</Text>
          <Text style={styles.detail}>Severity: {item.severity}</Text>
          <Text style={styles.detail}>Area: {item.areaDesc}</Text>
        </TouchableOpacity>
      </Link>
      {/* Conditionally render the "Prepare" button if a matching quest was found. */}
      {questId && (
        <Link href={`/quests/${questId}`} asChild>
          <TouchableOpacity style={styles.prepareButton}>
            <Text style={styles.prepareButtonText}>Prepare Now</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

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
      {/* Renders a list of alert cards. */}
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AlertCard item={item} />}
        // Displays a message if there are no active alerts.
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No active alerts</Text>
          </View>
        }
      />
    </View>
  );
};

// Stylesheet for the components on this screen.
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
    paddingTop: 50,
  },
  alertCard: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  alertContent: {
    padding: 16,
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
  prepareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  prepareButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

