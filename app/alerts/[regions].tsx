import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RegionAlertScreen(): JSX.Element {
  const params = useLocalSearchParams();
  return (
    <View>
      <Text>Alert Details for Region: {params.region} - Coming Soon</Text>
    </View>
  );
}