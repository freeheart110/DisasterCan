import React from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useLocalResources } from '../../src/hooks/useLocalResources';
import { ResourceCard } from '../../src/components/ResourceCard';

export default function ResourcesScreen() {
  const { resources, loading, error } = useLocalResources();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {resources.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
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