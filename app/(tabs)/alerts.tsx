import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Link } from 'expo-router';
import type { Alert } from '../../src/services/alertService';
import { alertQuestMap } from '../../src/constants/quests/alertQuestMap';
import { formatTimeAgo } from '../../src/utils/dateUtils';

/**
 * A reusable UI component to display a summary of a single alert.
 * It now shows the published time instead of the long area description and
 * conditionally renders a "Prepare" button based on the alert's status.
 */
const AlertCard = ({ item }: { item: Alert }) => {
  // Check if the alert event type has a corresponding quest in our map.
  const questId = alertQuestMap[item.event.toLowerCase()];
  // Check if the alert is over by looking for the word "ended" in the headline.
  const isAlertEnded = item.headline.toLowerCase().includes('ended');

  return (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text style={styles.event}>{item.event}</Text>
        <Text style={styles.time}>{formatTimeAgo(item.published)}</Text>
      </View>
      <Text style={styles.title}>{item.headline}</Text>
      <Text style={styles.detail}>Severity: {item.severity}</Text>

      {/* Only show the "Prepare Now" button if a relevant quest exists AND the alert has not ended. */}
      {questId && !isAlertEnded && (
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
 * Fetches and displays a list of all emergency alerts for the user's region.
 * Now categorizes alerts into Active and Inactive groups based on CAP metadata.
 */
export default function AlertsScreen(): React.JSX.Element {
  const { alerts, loading, error } = useAlerts();

  // Split alerts into active and inactive groups
  const activeAlerts = alerts.filter(a => a.isActive);
  const inactiveAlerts = alerts.filter(a => !a.isActive);

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
      {/* Section: Active Alerts */}
      <Text style={styles.sectionTitle}>Active Alerts</Text>
      <FlatList
        data={activeAlerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          // Link component makes the card tappable, navigating to the alert detail screen.
          <Link href={`/alert-detail/${item.id}`} asChild>
            <TouchableOpacity>
              <AlertCard item={item} />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No active alerts</Text>
          </View>
        }
      />

      {/* Section: Inactive (Past) Alerts */}
      {inactiveAlerts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Past Alerts</Text>
          <FlatList
            data={inactiveAlerts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Link href={`/alert-detail/${item.id}`} asChild>
                <TouchableOpacity>
                  <AlertCard item={item} />
                </TouchableOpacity>
              </Link>
            )}
          />
        </>
      )}
    </View>
  );
}

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  alertCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 16, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3 
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  event: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#2c3e50',
    flex: 1,
  },
  time: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  title: { 
    fontSize: 16, 
    marginTop: 4, 
    color: '#34495e' 
  },
  detail: { 
    fontSize: 14, 
    color: '#7f8c8d', 
    marginTop: 8 
  },
  prepareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  prepareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});