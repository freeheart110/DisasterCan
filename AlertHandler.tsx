import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as Location from 'expo-location';

// --- TYPE DEFINITIONS ---

interface Alert {
  id: string;
  title: string;
  summary: string;
  event: string;
  severity: string;
  areaDesc: string;
  productCode: string;
}

interface CapInfo {
  area?: { areaDesc?: string[] }[] | { areaDesc?: string[] };
  headline?: string;
  description?: string;
  event?: string;
  severity?: string;
  [key: string]: any;
}

// --- UTILS ---

const getAlertBaseUrl = (region: string): string => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `https://dd.weather.gc.ca/alerts/cap/${today}/${region}/`;
};

// The `area` can be either a single object or an array of objects.
const parseAreaDesc = (area: any): string => {
  if (!area) return 'N/A';
  if (Array.isArray(area)) {
    return area.map(a => a.areaDesc ?? 'N/A').join(', ');
  } else {
    return area.areaDesc ?? 'N/A';
  }
};

const parseFilename = (filename: string) => {
  const parts = filename.split('_');
  const productCode = parts[1];
  const timestamp = parts[4];
  const sequence = parseInt(parts[5].replace('.cap', ''));
  return { filename, productCode, timestamp, sequence };
};

// Map coordinates to Environment Canada regions
const getRegionFromLocation = (lat: number, lon: number): string => {
  if (lat >= 60) return 'CWNT'; // Territories
  if (lon <= -120) return 'CWVR'; // BC
  if (lon > -120 && lon <= -95) return 'CWWG'; // Prairies provinces (includes Alberta, Sask, Manitoba)
  if (lon > -95 && lon <= -80) return 'CWTO'; // Ontario
  if (lon > -80 && lon <= -67) return 'CWUL'; // Quebec
  if (lon > -67) return 'CWHX'; // Atlantic
  return 'CWTO';
};

// --- MAIN WORKFLOW ---

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const isDarkMode = useColorScheme() === 'dark';

  // Get device location on startup
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;
        console.log('User location:', lat, lon);

        const detectedRegion = getRegionFromLocation(lat, lon);
        console.log('Detected region:', detectedRegion);
        setRegion(detectedRegion);
      } catch (err: any) {
        console.error('Location error:', err);
        setError('Failed to get location');
      }
    })();
  }, []);

  // This effect fetches alerts whenever the `region` state is set or changes.
  useEffect(() => {
    const fetchAlerts = async (): Promise<void> => {
      // Exit if region is not yet set.
      if (!region) return;

      try {
        // STEP 1: Find the latest hourly subdirectory for today's alerts.
        const ALERT_BASE_URL = getAlertBaseUrl(region);
        console.log('Fetching directory:', ALERT_BASE_URL);

        // Get all hourly subdirectories (e.g., "00/", "01/") from the page.
        const dirResponse = await axios.get(ALERT_BASE_URL);
        const subdirs: string[] = [];
        const regex = /href="(\d{2}\/)"/g;
        let match;
        while ((match = regex.exec(dirResponse.data)) !== null) {
          subdirs.push(match[1]);
        }

        if (subdirs.length === 0) {
          setAlerts([]);
          setError('No subdirectories found for this region.');
          return;
        }

        // Sort to find the most recent hour (e.g., "23/").
        const latestSubdir = subdirs.sort().reverse()[0];
        const subdirUrl = `${ALERT_BASE_URL}${latestSubdir}`;

        // STEP 2: Get all .cap filenames from the latest hourly directory.
        const subdirResponse = await axios.get(subdirUrl);
        const capFiles: string[] = [];
        const capRegex = /href="([^"]*\.cap)"/g;
        while ((match = capRegex.exec(subdirResponse.data)) !== null) {
          capFiles.push(match[1]);
        }

        if (capFiles.length === 0) {
          setAlerts([]);
          setError('No CAP files found.');
          return;
        }
        
        // STEP 3: Filter for the single latest version of each unique alert.
        const parsedFiles = capFiles.map(parseFilename);
        const groupedByProduct: { [key: string]: typeof parsedFiles } = {};

        // Group alerts by product code to handle multiple updates to the same alert.
        for (const file of parsedFiles) {
          if (!groupedByProduct[file.productCode]) {
            groupedByProduct[file.productCode] = [];
          }
          groupedByProduct[file.productCode].push(file);
        }

        const latestFiles: typeof parsedFiles = [];
        // For each group, find the single most recent file.
        for (const productCode in groupedByProduct) {
          const files = groupedByProduct[productCode];
          // Sort by timestamp then sequence number to find the absolute latest file.
          files.sort((a, b) => {
            if (b.timestamp !== a.timestamp) {
              return b.timestamp.localeCompare(a.timestamp);
            }
            return b.sequence - a.sequence;
          });
          latestFiles.push(files[0]);
        }

        // STEP 4: Fetch and parse the content for each of the final alert files.
        const allAlerts: Alert[] = [];
        for (const cap of latestFiles) {
          const capUrl = `${subdirUrl}${cap.filename}`;
          console.log(`Fetching latest ${cap.productCode}`);

          const capResponse = await axios.get(capUrl);
          const xmlData = capResponse.data;

          // Convert the raw XML data into a JSON object.
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
          });
          const jsonData = parser.parse(xmlData);

          // A CAP alert can have one <info> block (object) or many (array).
          const alert = jsonData.alert || {};
          let infos = alert.info || [];
          if (!Array.isArray(infos)) {
            infos = infos ? [infos] : [];
          }

          // infos.forEach((info: CapInfo, idx: number) => {
          //   console.log("Info object:", {
          //     headline: info.headline,
          //     event: info.event,
          //     severity: info.severity,
          //     area: parseAreaDesc(info.area),
          //   });
          // });

          // For debugging: log the raw info object to the console.
          infos.forEach((info: CapInfo, idx: number) => {
            console.log("Info object:", info);
          });

          // Map each info block to the app's clean `Alert` interface.
          const parsed = infos.map((info: CapInfo, idx: number): Alert => {
            const areaDescValue = parseAreaDesc(info.area);
            return {
              id: alert.identifier ?? `${cap.filename}-${idx}`,
              title: info.headline ?? 'N/A',
              summary: info.description ?? 'N/A',
              event: info.event ?? 'N/A',
              severity: info.severity ?? 'N/A',
              areaDesc: areaDescValue,
              productCode: cap.productCode,
            };
          });

          allAlerts.push(...parsed);
        }

        setAlerts(allAlerts);
        console.log('Parsed alerts count:', allAlerts.length);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(`Failed to load alerts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [region]);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#c9302c" />;
    }

    if (error) {
      return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    if (alerts.length === 0) {
      return <Text style={styles.statusText}>No active alerts found at this time.</Text>;
    }

    return alerts.map((alert, idx) => (
      <View key={`${alert.id}-${idx}`} style={styles.alertCard}>
        <Text style={styles.alertEvent}>{alert.event}</Text>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertDetail}>Severity: {alert.severity}</Text>
        <Text style={styles.alertDetail}>Area: {alert.areaDesc}</Text>
        <Text style={styles.alertDetail}>Product: {alert.productCode}</Text>
        <Text style={styles.alertSummary}>{alert.summary}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text style={styles.header}>Canadian Emergency Alerts (Location-Aware)</Text>
          <Text style={styles.subHeader}>Powered by Environment Canada</Text>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f4f9' },
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  subHeader: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertEvent: { fontSize: 18, fontWeight: 'bold', color: '#d9532c', marginBottom: 5 },
  alertTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  alertDetail: { fontSize: 14, fontStyle: 'italic', color: '#555', marginBottom: 3 },
  alertSummary: { fontSize: 14, marginTop: 10, lineHeight: 20 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  statusText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
});