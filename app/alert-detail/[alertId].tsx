import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAlerts } from '../../src/hooks/useAlerts';
import MapView, { Polygon } from 'react-native-maps';
import { getPolygonCenter, parsePolygon } from '../../src/utils/mapUtils';

export default function AlertDetailScreen(): React.JSX.Element {
  // Get the dynamic part of the URL (the alert's ID) using a hook from Expo Router.
  const { alertId } = useLocalSearchParams();
  // Fetch the global state of all alerts and the current loading status.
  const { alerts, loading } = useAlerts();

  // Show a loading spinner while the alerts are being fetched.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Find the specific alert that matches the ID from the URL.
  const alert = alerts.find(a => a.id === alertId);

  // If no matching alert is found, display an error message.
  if (!alert) {
    return (
      <View style={styles.centered}>
        <Text>Alert not found.</Text>
      </View>
    );
  }

  // Parse the polygon string into an array of coordinates for the map.
  // If no polygon exists, default to an empty array.
  const polygonCoords = alert.polygon ? parsePolygon(alert.polygon) : [];
  // Calculate the map's initial center and zoom level based on the polygon.
  const initialRegion = alert.polygon ? getPolygonCenter(polygonCoords) : null;

  return (
    <ScrollView style={styles.container}>
      {/* Set the title of the screen in the header to the alert's event type. */}
      <Stack.Screen options={{ title: alert.event }} />

      {/* Only render the MapView if there is a polygon to display. */}
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Polygon
            coordinates={polygonCoords}
            strokeColor="#FF0000" // Red outline for the polygon
            fillColor="rgba(255, 0, 0, 0.3)" // Semi-transparent red fill
            strokeWidth={2}
          />
        </MapView>
      )}

      {/* Container for all the textual information about the alert. */}
      <View style={styles.contentContainer}>
        <Text style={styles.headline}>{alert.headline}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.bodyText}>{alert.description}</Text>
          
          {/* Conditionally render the Instructions section only if instruction text exists. */}
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

// Stylesheet for the component.
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

