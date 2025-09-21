import React from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalResources } from '../../src/hooks/useLocalResources';
import { useLocations } from '../../src/hooks/useLocations';
import { ResourceCard } from '../../src/components/ResourceCard';

export default function ResourcesScreen() {
  const { resources, loading, error } = useLocalResources();
  const { locationInfo, loading: locationLoading } = useLocations();

  const userLat = locationInfo?.latitude;
  const userLon = locationInfo?.longitude;

  // Show loading indicator while location or resources are loading
  if (loading || locationLoading || !userLat || !userLon) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Region centered on user's location
  const userRegion = {
    latitude: userLat,
    longitude: userLon,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Map centered on user's location */}
      <MapView
        style={styles.map}
        initialRegion={userRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Resource pins */}
        {resources.map((resource) => (
          <Marker
            key={resource.id}
            coordinate={{
              latitude: Number(resource.latitude),
              longitude: Number(resource.longitude),
            }}
            title={resource.facility_name}
            description={`${resource.city}, ${resource.province}`}
          />
        ))}

      </MapView>

      {/* Resource list */}
      {resources.length === 0 ? (
        <Text style={styles.noResultsText}>
          No nearby emergency resources found within 50km.
        </Text>
      ) : (
        resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});