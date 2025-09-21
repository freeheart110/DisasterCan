import { View, Text, Linking, StyleSheet } from 'react-native';
import React from 'react';
import { LocalResource } from '../services/localResourcesService';

export const ResourceCard = ({ resource }: { resource: LocalResource }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{resource.facility_name}</Text>
    <Text>{resource.city}, {resource.province}</Text>
    <Text>{resource.address}</Text>

    {resource.phone && (
      <Text onPress={() => Linking.openURL(`tel:${resource.phone}`)}>{resource.phone}</Text>
    )}

    {resource.website && (
      <Text
        onPress={() => Linking.openURL(resource.website!)}
        style={styles.link}
      >
        {resource.website}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
  link: { color: 'blue' },
});