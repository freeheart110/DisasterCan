import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { useAlerts } from '../../src/hooks/useAlerts';
import MapView, { Polygon, Region } from 'react-native-maps';
import { getPolygonCenter, parsePolygon } from '../../src/utils/mapUtils';
import { alertQuestMap } from '../../src/constants/quests/alertQuestMap';
import { getSeverityColor } from '../../src/constants/colors';

/**
 * A reusable component for the "Prepare" button in the header.
 */
const PrepareButton = ({ questId }: { questId: string }) => (
  <Link href={`/quests/${questId}`} asChild>
    <TouchableOpacity style={styles.prepareButton}>
      <Text style={styles.prepareButtonText}>Prepare</Text>
    </TouchableOpacity>
  </Link>
);

export default function AlertDetailScreen(): React.JSX.Element {
  const { alertId } = useLocalSearchParams();
  const { alerts, loading } = useAlerts();

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
      <Stack.Screen
        options={{
          title: alert.event,
          headerRight: () => questId ? <PrepareButton questId={questId} /> : null,
        }}
      />

      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
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

      <View style={styles.contentContainer}>
        <Text style={styles.headline}>{alert.headline}</Text>
        <Text style={styles.sectionTitle}>Alert History</Text>

        {alert.versions.map((version, idx) => (
          <CollapsibleVersion key={idx} version={version} />
        ))}
      </View>
    </ScrollView>
  );
}

function CollapsibleVersion({ version }: { version: any }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(prev => !prev);

  // Clean and split into lines, skipping "###"
  const cleanLines = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && !line.startsWith('###'));
  };

  const descriptionLines = cleanLines(version.description || '');
  const instructionLines = cleanLines(version.instruction || '');

  const visibleDescLines = expanded ? descriptionLines : descriptionLines.slice(0, 2);
  const visibleInstrLines = expanded ? instructionLines : instructionLines.slice(0, 2);

  return (
    <View style={styles.historyCard}>
      <View style={[styles.headlineContainer, { backgroundColor: getSeverityColor(version.severity) }]}>
        <Text style={styles.historyHeadline}>{version.headline}</Text>
        <Text style={styles.historyMeta}>
          {version.severity} · {new Date(version.published).toLocaleString()}
        </Text>
      </View>

      {descriptionLines.length > 0 && (
        <>
          <Text style={styles.sectionSubtitle}>Description</Text>
          <Text
            style={styles.bulletPoint}
            numberOfLines={expanded ? undefined : 2}
          >
            {descriptionLines.map(line => `• ${line}`).join('\n')}
          </Text>
        </>
      )}

      {instructionLines.length > 0 && version.instruction !== 'No instructions provided.' && (
        <>
          <Text style={styles.sectionSubtitle}>Instruction</Text>
          <Text
            style={styles.bulletPoint}
            numberOfLines={expanded ? undefined : 2}
          >
            {instructionLines.map(line => `• ${line}`).join('\n')}
          </Text>
        </>
      )}

      <TouchableOpacity onPress={toggle}>
        <Text style={styles.toggleBtn}>{expanded ? 'Collapse' : 'Expand'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: 300 },
  contentContainer: { padding: 16 },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize',
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    marginBottom: 2,
  },
  truncate: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 10,
    marginBottom: 4,
  },
  toggleBtn: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 6,
  },
  historyCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  historyHeadline: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  historyMeta: {
    fontSize: 12,
    color: '#000',
    marginBottom: 8,
  },
  headlineContainer: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  prepareButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  prepareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});