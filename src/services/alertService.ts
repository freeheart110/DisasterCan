import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
// Import the dedicated location service to get the region code
import { getLocationInfo } from './locationService';

// --- TYPE DEFINITIONS ---

// This is the main, clean interface for an alert used throughout the app.
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
  polygon?: string;
}

// These are internal types used only for parsing the raw XML data.
// They are more complex to account for the nested and sometimes inconsistent structure of the CAP file.
interface CapArea {
  areaDesc?: string;
  polygon?: string;
  // ... other potential fields
}

interface CapInfo {
  area?: CapArea[] | CapArea;
  headline?: string;
  description?: string;
  instruction?: string | {}; // Can be an empty object if tag exists but is empty
  event?: string;
  severity?: string;
  // Allow any other fields from the XML
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

const getFirstPolygon = (area: CapInfo['area']): string | undefined => {
  if (!area) return undefined;
  const firstArea = Array.isArray(area) ? area[0] : area;
  return firstArea?.polygon;
};

const parseFilename = (filename: string): ParsedFilename => {
  const parts = filename.split('_');
  const productCode = parts.length > 1 ? parts[1] : 'N/A';
  const timestamp = parts.length > 4 ? parts[4] : 'N/A';
  const sequence = parts.length > 5 ? parseInt(parts[5].replace('.cap', ''), 10) : 0;
  return { filename, productCode, timestamp, sequence };
};

// --- MAIN WORKFLOW ---

export const getLatestAlerts = async (): Promise<Alert[]> => {
  // 1. Get location info from the single source of truth: locationService.ts.
  const locationInfo = await getLocationInfo();
  const region = locationInfo.regionCode;

  // 2. Find the latest hourly subdirectory for today's alerts.
  const ALERT_BASE_URL = getAlertBaseUrl(region);

  let dirResponse;
  try {
    dirResponse = await axios.get(ALERT_BASE_URL);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`No alert directory found for region ${region} today.`);
      return []; // Return an empty array, not an error.
    }
    throw error; // Re-throw other errors
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

  const latestSubdir = subdirs.sort().reverse()[0];
  const subdirUrl = `${ALERT_BASE_URL}${latestSubdir}`;

  // 3. Get all .cap filenames from the latest hourly directory.
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

  // 4. Filter for the single latest version of each unique alert.
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

  // 5. Fetch and parse the content for each of the final alert files.
  const allAlerts: Alert[] = [];
  for (const cap of latestFiles) {
    const capUrl = `${subdirUrl}${cap.filename}`;

    const capResponse = await axios.get(capUrl);
    const xmlData = capResponse.data;

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const jsonData: { alert: CapAlert } = parser.parse(xmlData);

    const alertData = jsonData.alert || {};
    let infos = alertData.info || [];
    if (!Array.isArray(infos)) {
      infos = infos ? [infos] : [];
    }
    
    // Filter for English language alerts to avoid duplicates
    const englishInfos = infos.filter(info => info.language === 'en-CA');

    const parsed = englishInfos.map((info: CapInfo, idx: number): Alert => {
      const areaDescValue = parseAreaDesc(info.area);
      const polygonValue = getFirstPolygon(info.area);
      
      // Handle cases where instruction might be an empty object
      const instructionText = (typeof info.instruction === 'string' && info.instruction)
        ? info.instruction
        : 'No instructions provided.';

      return {
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
    });

    allAlerts.push(...parsed);
  }

  return allAlerts;
};

