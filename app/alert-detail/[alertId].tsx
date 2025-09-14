import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { useAlerts } from '../../src/hooks/useAlerts';
import MapView, { Polygon, Region } from 'react-native-maps';
import { getPolygonCenter, parsePolygon } from '../../src/utils/mapUtils';
import { alertQuestMap } from '../../src/constants/quests/alertQuestMap';

/**
 * A reusable component for the "Prepare" button in the header.
 * @param {string} questId - The ID of the quest to navigate to.
 */
const PrepareButton = ({ questId }: { questId: string }) => (
  <Link href={`/quests/${questId}`} asChild>
    <TouchableOpacity style={{ marginRight: 10 }}>
      <Text style={{ color: '#007AFF', fontSize: 16 }}>Prepare</Text>
    </TouchableOpacity>
  </Link>
);

/**
 * Renders the detailed view for a single emergency alert, including a map of the
 * affected area if polygon data is available.
 */
export default function AlertDetailScreen(): React.JSX.Element {
  // Get the alertId from the URL, which is passed from the alerts list screen.
  const { alertId } = useLocalSearchParams();
  // Fetch the global list of all alerts and the loading state.
  const { alerts, loading } = useAlerts();

  // Display a loading indicator while the main alert data is being fetched.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Find the specific alert from the global list using the alertId.
  const alert = alerts.find(a => a.id === alertId);

  // Handle the case where the alert might not be found (e.g., if it has expired).
  if (!alert) {
    return (
      <View style={styles.centered}>
        <Text>Alert not found.</Text>
      </View>
    );
  }
  
  // Check the map to see if a quest is associated with this alert's event type.
  const questId = alertQuestMap[alert.event.toLowerCase()];

  // Parse all polygon strings into a single array of coordinates for the map view.
  const allPolygonCoords = alert.polygons?.flatMap(p => parsePolygon(p)) ?? [];
  // Calculate the center and zoom level for the map.
  const initialRegion: Region | null = allPolygonCoords.length > 0 ? getPolygonCenter(allPolygonCoords) : null;

  return (
    <ScrollView style={styles.container}>
      {/* Configure the header of the screen, dynamically setting the title and the "Prepare" button. */}
      <Stack.Screen 
        options={{ 
          title: alert.event,
          headerRight: () => questId ? <PrepareButton questId={questId} /> : null,
        }} 
      />

      {/* If the alert has a polygon, render the map view. */}
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {/* Loop through each polygon string and render it on the map. */}
          {alert.polygons?.map((polygonString, index) => (
            <Polygon
              key={index}
              coordinates={parsePolygon(polygonString)}
              strokeColor="#FF0000"
              fillColor="rgba(255, 0, 0, 0.3)"
              strokeWidth={2}
            />
          ))}
        </MapView>
      )}

      {/* Container for the textual alert information. */}
      <View style={styles.contentContainer}>
        <Text style={styles.headline}>{alert.headline}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.bodyText}>{alert.description}</Text>
          
          {/* Only render the Instructions section if there are instructions provided. */}
          {alert.instruction !== 'No instructions provided.' && (
            <>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.bodyText}>{alert.instruction}</Text>
            </>
          )}
          
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

