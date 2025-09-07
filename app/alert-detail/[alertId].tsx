import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAlerts } from '../../src/hooks/useAlerts';
import MapView, { Polygon } from 'react-native-maps';
import { getPolygonCenter, parsePolygon } from '../../src/utils/mapUtils';

/**
 * A screen that displays the full details of a single selected alert,
 * including a map of the affected area if polygon data is available.
 */
export default function AlertDetailScreen(): React.JSX.Element {
  // Get the alertId from the URL parameters passed by the Link component.
  const { alertId } = useLocalSearchParams();
  // Access the global list of alerts and loading state.
  const { alerts, loading } = useAlerts();

  // Show a loading indicator while the main alerts are still being fetched.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Find the specific alert from the global list using the ID from the URL.
  const alert = alerts.find(a => a.id === alertId);

  // If the alert isn't found (e.g., due to an invalid ID), show an error message.
  if (!alert) {
    return (
      <View style={styles.centered}>
        <Text>Alert not found.</Text>
      </View>
    );
  }

  // An alert can have multiple polygons. Parse all of them to draw on the map.
  const allPolygonCoords = alert.polygons ? alert.polygons.flatMap(p => parsePolygon(p)) : [];
  // Calculate the initial map region that encompasses all polygons.
  const initialRegion = allPolygonCoords.length > 0 ? getPolygonCenter(allPolygonCoords) : null;
  // ---------------------

  return (
    <ScrollView style={styles.container}>
      {/* Set the screen's header title to the alert's event type. */}
      <Stack.Screen options={{ title: alert.event }} />

      {/* Only render the MapView if there is a valid region to display. */}
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {/* Loop through and render each polygon associated with the alert. */}
          {alert.polygons?.map((polygonString, index) => {
            const polygonCoords = parsePolygon(polygonString);
            return (
              <Polygon
                key={index}
                coordinates={polygonCoords}
                strokeColor="#FF0000"
                fillColor="rgba(255, 0, 0, 0.3)"
                strokeWidth={2}
              />
            );
          })}
        </MapView>
      )}

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

// Stylesheet for the components on this screen.
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

