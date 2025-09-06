import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as Location from 'expo-location';

// --- TYPE DEFINITIONS ---

export interface Alert {
  id: string;
  title: string;
  summary: string;
  event: string;
  severity: string;
  areaDesc: string;
  productCode: string;
  published: string;
  region: string;
  headline: string;
  description: string;
  instruction: string;
  polygon?: string; // A polygon might not exist for every alert
}

// A specific type for the <area> block in a CAP file.
interface CapArea {
  areaDesc?: string;
  polygon?: string;
}

// A specific type for the <info> block in a CAP file.
interface CapInfo {
  language?: string;
  area?: CapArea[] | CapArea;
  headline?: string;
  description?: string;
  instruction?: unknown; // Use 'unknown' to force a type check later
  event?: string;
  severity?: string;
  [key: string]: unknown; // Allow extra fields from XML
}

interface CapAlert {
  identifier?: string;
  sent?: string;
  info?: CapInfo | CapInfo[];
}

interface ParsedFilename {
  filename: string;
  productCode: string;
  timestamp: string;
  sequence: number;
}

// --- UTILS ---

const getAlertBaseUrl = (region: string): string => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `https://dd.weather.gc.ca/alerts/cap/${today}/${region}/`;
};

// The `area` can be either a single object or an array of objects.
const parseAreaDesc = (area: CapInfo['area']): string => {
  if (!area) return 'N/A';
  if (Array.isArray(area)) {
    return area.map((a: CapArea) => a.areaDesc ?? 'N/A').join(', ');
  }
  return (area as CapArea).areaDesc ?? 'N/A';
};

const getFirstPolygon = (area: CapInfo['area']): string | undefined => {
  if (!area) return undefined;
  if (Array.isArray(area)) {
    return area[0]?.polygon;
  }
  return (area as CapArea).polygon;
};

const parseFilename = (filename: string): ParsedFilename => {
  const parts = filename.split('_');
  const productCode = parts[1];
  const timestamp = parts[4];
  const sequence = parseInt(parts[5].replace('.cap', ''), 10);
  return { filename, productCode, timestamp, sequence };
};

// Map coordinates to Environment Canada regions
const getRegionFromLocation = async (): Promise<string> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const loc = await Location.getCurrentPositionAsync({});
  const lat = loc.coords.latitude;
  const lon = loc.coords.longitude;

  // Log GPS location
  console.log('GPS Location:', { latitude: lat, longitude: lon });

  if (lat >= 60) return 'CWNT'; // Territories
  if (lon <= -120) return 'CWVR'; // BC
  if (lon > -120 && lon <= -95) return 'CWWG'; // Prairies provinces (includes Alberta, Sask, Manitoba)
  if (lon > -95 && lon <= -80) return 'CWTO'; // Ontario
  if (lon > -80 && lon <= -67) return 'CWUL'; // Quebec
  if (lon > -67) return 'CWHX'; // Atlantic
  return 'CWTO';
};

// --- MAIN WORKFLOW ---

export const getLatestAlerts = async (): Promise<Alert[]> => {
  const region = await getRegionFromLocation();

  // Log region code
  console.log('Region Code:', region);

  // STEP 1: Find the latest hourly subdirectory for today's alerts.
  const ALERT_BASE_URL = getAlertBaseUrl(region);
  
  let dirResponse;
  try {
    // Try to fetch the list of hourly subdirectories for today.
    dirResponse = await axios.get(ALERT_BASE_URL);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`No alert directory found for region ${region} today.`);
      return []; // Return an empty array, not an error.
    }
    // Throw any other type of error.
    console.error('Failed to get latest alerts:', error);
    throw new Error('Failed to fetch alerts');
  }
  
  const subdirs: string[] = [];
  const regex = /href="(\d{2}\/)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(dirResponse.data)) !== null) {
    subdirs.push(match[1]);
  }

  if (subdirs.length === 0) {
    console.log('No hourly subdirectories found for this region.');
    return [];
  }

  // Sort to find the most recent hour.
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
    console.log('No CAP files found in the latest subdirectory.');
    return [];
  }

  // STEP 3: Filter for the single latest version of each unique alert.
  const parsedFiles = capFiles.map(parseFilename);
  const groupedByProduct: { [key: string]: ParsedFilename[] } = {};

  for (const file of parsedFiles) {
    if (!groupedByProduct[file.productCode]) {
      groupedByProduct[file.productCode] = [];
    }
    groupedByProduct[file.productCode].push(file);
  }

  const latestFiles: ParsedFilename[] = [];
  for (const productCode in groupedByProduct) {
    const files = groupedByProduct[productCode];
    files.sort((a, b) => {
      if (b.timestamp !== a.timestamp) {
        return b.timestamp.localeCompare(a.timestamp);
      }
      return b.sequence - a.sequence;
    });
    latestFiles.push(files[0]);
  }

  // STEP 4: Fetch and parse the content for each of the final alert files.
  const allAlertsPromises = latestFiles.map(async (cap) => {
    const capUrl = `${subdirUrl}${cap.filename}`;
    const capResponse = await axios.get(capUrl);
    const xmlData = capResponse.data;
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const jsonData: { alert: CapAlert } = parser.parse(xmlData);
    
    // Log the CAP file name
    console.log('CAP File Name:', cap.filename);

    const alertData = jsonData.alert || {};
    let infos = alertData.info || [];
    if (!Array.isArray(infos)) {
      infos = infos ? [infos] : [];
    }

    const parsed = infos
      .filter(info => info.language === 'en-CA') // Only process English alerts
      .map((info: CapInfo, idx: number): Alert => {
        const areaDescValue = parseAreaDesc(info.area);
        const polygonValue = getFirstPolygon(info.area);
        const instructionText = typeof info.instruction === 'string' ? info.instruction : 'No instructions provided.';

        const alertObject: Alert = {
          id: `${alertData.identifier ?? cap.filename}-${idx}`,
          title: info.headline ?? 'N/A',
          summary: info.description ?? 'N/A',
          event: info.event ?? 'N/A',
          severity: info.severity ?? 'N/A',
          areaDesc: areaDescValue,
          productCode: cap.productCode,
          published: alertData.sent ?? 'N/A',
          region: region,
          headline: info.headline ?? 'N/A',
          description: info.description ?? 'N/A',
          instruction: instructionText,
          polygon: polygonValue,
        };

        // Log the alert info for each parsed alert
        console.log('Alert Info:', {
          id: alertObject.id,
          title: alertObject.title,
          summary: alertObject.summary,
          event: alertObject.event,
          severity: alertObject.severity,
          areaDesc: alertObject.areaDesc,
          productCode: alertObject.productCode,
          published: alertObject.published,
          region: alertObject.region,
        });
        
        return alertObject;
      });
      
    return parsed;
  });

  const nestedAlerts = await Promise.all(allAlertsPromises);
  const allAlerts = nestedAlerts.flat();
  
  const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
  return allAlerts.filter(alert => new Date(alert.published).getTime() >= twentyFourHoursAgo);
};

