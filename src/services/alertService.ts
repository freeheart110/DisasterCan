import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { getLocationInfo } from './locationService';
import { isPointInPolygon } from 'geolib';
import { parsePolygon } from '../utils/mapUtils';

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
  // An alert can have multiple polygons, so this is now an array of strings.
  polygons?: string[];
}

// Internal types for parsing the raw XML data.
interface CapArea {
  areaDesc?: string;
  polygon?: string;
}

interface CapInfo {
  area?: CapArea[] | CapArea;
  headline?: string;
  description?: string;
  instruction?: string | {};
  event?: string;
  severity?: string;
  language?: string;
  [key: string]: unknown;
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

const parseAreaDesc = (area: CapInfo['area']): string => {
  if (!area) return 'N/A';
  const areas = Array.isArray(area) ? area : [area];
  return areas.map(a => a.areaDesc ?? 'N/A').join(', ');
};

// New utility to get ALL polygons from an alert, not just the first one.
const getAllPolygons = (area: CapInfo['area']): string[] => {
  if (!area) return [];
  const areas = Array.isArray(area) ? area : [area];
  // Filter out any areas that don't have a polygon and return the strings.
  return areas.map(a => a.polygon).filter((p): p is string => !!p);
};

/**
 * Parses the complex CAP filename to extract metadata like product code,
 * timestamp, and sequence number, which are crucial for filtering alerts.
 */
const parseFilename = (filename: string): ParsedFilename => {
  const parts = filename.split('_');
  const productCode = parts.length > 1 ? parts[1] : 'N/A';
  const timestamp = parts.length > 4 ? parts[4] : 'N/A';
  const sequence = parts.length > 5 ? parseInt(parts[5].replace('.cap', ''), 10) : 0;
  return { filename, productCode, timestamp, sequence };
};

// --- MAIN WORKFLOW ---

export const getLatestAlerts = async (): Promise<Alert[]> => {
  // STEP 1: Determine user's location and corresponding alert region.
  const locationInfo = await getLocationInfo();
  const region = locationInfo.regionCode;
  const ALERT_BASE_URL = getAlertBaseUrl(region);

  let dirResponse;
  try {
    dirResponse = await axios.get(ALERT_BASE_URL);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }

  // STEP 2: Find the most recent hourly subdirectory for today's alerts.
  const subdirs: string[] = [];
  const regex = /href="(\d{2}\/)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(dirResponse.data)) !== null) {
    subdirs.push(match[1]);
  }

  if (subdirs.length === 0) return [];

  const latestSubdir = subdirs.sort().reverse()[0];
  const subdirUrl = `${ALERT_BASE_URL}${latestSubdir}`;

  // STEP 3: Get all .cap filenames from the latest hourly directory.
  const subdirResponse = await axios.get(subdirUrl);
  const capFiles: string[] = [];
  const capRegex = /href="([^"]*\.cap)"/g;
  while ((match = capRegex.exec(subdirResponse.data)) !== null) {
    capFiles.push(match[1]);
  }

  if (capFiles.length === 0) return [];

  // STEP 4: Filter for the single latest version of each unique alert.
  // This prevents showing outdated or superseded alerts by grouping all found
  // files by a product code, then sorting them by timestamp and sequence number.
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
      if (b.timestamp !== a.timestamp) return b.timestamp.localeCompare(a.timestamp);
      return b.sequence - a.sequence;
    });
    latestFiles.push(files[0]);
  }

  // STEP 5: Fetch and parse the content for each of the final alert files.
  const allAlerts: Alert[] = [];
  for (const cap of latestFiles) {
    const capUrl = `${subdirUrl}${cap.filename}`;
    const capResponse = await axios.get(capUrl);
    const xmlData = capResponse.data;
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const jsonData: { alert: CapAlert } = parser.parse(xmlData);
    const alertData = jsonData.alert || {};
    let infos = alertData.info || [];
    if (!Array.isArray(infos)) infos = infos ? [infos] : [];
    
    // Process only the English version of the alert to avoid duplicates.
    const englishInfos = infos.filter(info => info.language === 'en-CA');

    const parsed = englishInfos.map((info: CapInfo, idx: number): Alert => {
      const instructionText = (typeof info.instruction === 'string' && info.instruction)
        ? info.instruction
        : 'No instructions provided.';

      return {
        id: `${alertData.identifier ?? cap.filename}-${idx}`,
        title: info.headline ?? 'N/A',
        summary: info.description ?? 'N/A',
        event: info.event ?? 'N/A',
        severity: info.severity ?? 'N/A',
        areaDesc: parseAreaDesc(info.area),
        productCode: cap.productCode,
        published: alertData.sent ?? 'N/A',
        region: region,
        headline: info.headline ?? 'N/A',
        description: info.description ?? 'N/A',
        instruction: instructionText,
        polygons: getAllPolygons(info.area),
      };
    });
    allAlerts.push(...parsed);
  }

  // STEP 6: Apply precision geofencing to filter alerts to the user's exact location.
  const userLocation = {
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude,
  };

  console.log('Filtering alerts based on user location:', userLocation);
  console.log('User city for text-based check:', locationInfo.city);

  const relevantAlerts = allAlerts.filter(alert => {
    // If the alert has polygon data, use precise geofencing.
    if (alert.polygons && alert.polygons.length > 0) {
      const isInside = alert.polygons.some(polygonString => {
        const polygonCoords = parsePolygon(polygonString);
        return isPointInPolygon(userLocation, polygonCoords);
      });
      
      if (isInside) {
        console.log(`Including alert (user inside polygon): ${alert.headline}`);
      } else {
        console.log(`Excluding alert (user outside polygon): ${alert.headline}`);
      }
      return isInside;
    }

    // --- NEW LOGIC ---
    // If NO polygon data, fall back to a text-based check of the area description.
    const userCity = locationInfo.city;
    if (!userCity) {
      // If for some reason we couldn't get a city name, exclude the alert to be safe.
      console.log(`Excluding broad alert (no city info to check): ${alert.headline}`);
      return false;
    }

    // Check if the user's city name is mentioned in the alert's area description.
    // This is case-insensitive.
    const isCityMentioned = alert.areaDesc.toLowerCase().includes(userCity.toLowerCase());
    
    if (isCityMentioned) {
      console.log(`Including broad alert (city "${userCity}" mentioned): ${alert.headline}`);
    } else {
      console.log(`Excluding broad alert (city "${userCity}" not mentioned in "${alert.areaDesc}"): ${alert.headline}`);
    }
    
    return isCityMentioned;
  });
  // ------------------------------------

  console.log(`Found ${allAlerts.length} total alerts, and after filtering, ${relevantAlerts.length} are relevant to your location.`);

  return relevantAlerts;
};

