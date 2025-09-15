import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { getLocationInfo } from './locationService';
import { parsePolygon } from '../utils/mapUtils';

// Types for UI-facing alert data
export interface AlertVersion {
  headline: string;
  description: string;
  instruction: string;
  severity: string;
  published: string;
}

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
  polygons?: string[];
  versions: AlertVersion[];
  isActive: boolean;
}

// Internal CAP structures
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
  expires?: string;
}

interface CapAlert {
  identifier?: string;
  sent?: string;
  info?: CapInfo | CapInfo[];
}

interface CapMetadata {
  Alert_Location_Status: {
    value: 'active' | 'ended';
  };
}

interface CapEntry {
  alert: CapAlert;
  metadata: CapMetadata;
}

interface ParsedFilename {
  filename: string;
  productCode: string;
  timestamp: string;
  sequence: number;
}

// Helpers
const getAlertBaseUrl = (region: string): string => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `https://dd.weather.gc.ca/alerts/cap/${today}/${region}/`;
};

const parseAreaDesc = (area: CapInfo['area']): string => {
  if (!area) return 'N/A';
  const areas = Array.isArray(area) ? area : [area];
  return areas.map(a => a.areaDesc ?? 'N/A').join(', ');
};

const getAllPolygons = (area: CapInfo['area']): string[] => {
  if (!area) return [];
  const areas = Array.isArray(area) ? area : [area];
  return areas.map(a => a.polygon).filter((p): p is string => !!p);
};

const parseFilename = (filename: string): ParsedFilename => {
  const parts = filename.split('_');
  const productCode = parts.length > 1 ? parts[1] : 'N/A';
  const timestamp = parts.length > 4 ? parts[4] : 'N/A';
  const sequence = parts.length > 5 ? parseInt(parts[5].replace('.cap', ''), 10) : 0;
  return { filename, productCode, timestamp, sequence };
};

// Main function
export const getLatestAlerts = async (): Promise<Alert[]> => {
  const locationInfo = await getLocationInfo();
  const region = locationInfo.regionCode;
  const ALERT_BASE_URL = getAlertBaseUrl(region);

  // Step 1: Load directory
  let dirResponse;
  try {
    dirResponse = await axios.get(ALERT_BASE_URL);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return [];
    throw error;
  }

  // Step 2: Get latest subdir (hour)
  const subdirs: string[] = [];
  const regex = /href="(\d{2}\/)"/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(dirResponse.data)) !== null) {
    subdirs.push(match[1]);
  }

  if (subdirs.length === 0) return [];
  const latestSubdir = subdirs.sort().reverse()[0];
  const subdirUrl = `${ALERT_BASE_URL}${latestSubdir}`;

  // Step 3: Get all .cap files in that hour
  const subdirResponse = await axios.get(subdirUrl);
  const capFiles: string[] = [];
  const capRegex = /href="([^"]*\.cap)"/g;
  while ((match = capRegex.exec(subdirResponse.data)) !== null) {
    capFiles.push(match[1]);
  }

  if (capFiles.length === 0) return [];

  // Step 4: Group by productCode and pick latest
  const parsedFiles = capFiles.map(parseFilename);
  const grouped: { [key: string]: ParsedFilename[] } = {};

  for (const file of parsedFiles) {
    if (!grouped[file.productCode]) grouped[file.productCode] = [];
    grouped[file.productCode].push(file);
  }

  const latestFiles: ParsedFilename[] = [];

  for (const productCode in grouped) {
    const files = grouped[productCode];
    files.sort((a, b) => {
      if (b.timestamp !== a.timestamp) return b.timestamp.localeCompare(a.timestamp);
      return b.sequence - a.sequence;
    });
    latestFiles.push(files[0]);
  }

  // Step 5: Parse CAP and build alerts
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const allAlerts: Alert[] = [];

  for (const cap of latestFiles) {
    const capUrl = `${subdirUrl}${cap.filename}`;
    const capResponse = await axios.get(capUrl);
    const xmlData = capResponse.data;

    const jsonData: CapEntry = parser.parse(xmlData);
    const alertData = jsonData.alert || {};
    const metadata = jsonData.metadata;

    let infos = alertData.info || [];
    if (!Array.isArray(infos)) infos = infos ? [infos] : [];

    const englishInfos = infos.filter(info => info.language === 'en-CA');

    const versions: AlertVersion[] = englishInfos.map(info => ({
      headline: info.headline ?? 'N/A',
      description: info.description ?? 'N/A',
      instruction: typeof info.instruction === 'string' ? info.instruction : 'No instructions provided.',
      severity: info.severity ?? 'N/A',
      published: alertData.sent ?? 'N/A',
    }));

    versions.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    const latest = versions[0];
    const latestInfo = englishInfos[0];

    // --- New isActive logic using only Alert_Location_Status ---
    const locationStatus = metadata?.Alert_Location_Status?.value;
    const isActive = locationStatus === 'active';

    // Debug logs
    console.log('\n--- Debug: Final Parsed Alert ---');
    console.log(`Filename: ${cap.filename}`);
    console.log(`Product Code: ${cap.productCode}`);
    console.log(`Event: ${latestInfo?.event}`);
    console.log(`Headline: ${latest?.headline}`);
    console.log(`Location Status: ${locationStatus}`);
    console.log(`isActive: ${isActive}`);
    console.log('--- End of Alert ---\n');

    const alert: Alert = {
      id: alertData.identifier ?? cap.filename,
      title: latest?.headline ?? 'N/A',
      summary: latest?.description ?? 'N/A',
      event: latestInfo?.event ?? 'N/A',
      severity: latest?.severity ?? 'N/A',
      areaDesc: parseAreaDesc(latestInfo?.area),
      productCode: cap.productCode,
      published: latest?.published ?? 'N/A',
      region,
      headline: latest?.headline ?? 'N/A',
      description: latest?.description ?? 'N/A',
      instruction: latest?.instruction ?? 'No instructions provided.',
      polygons: getAllPolygons(latestInfo?.area),
      versions,
      isActive,
    };

    allAlerts.push(alert);
  }

  return allAlerts;
};