import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { getLocationInfo } from './locationService';

// --- TYPE DEFINITIONS ---

export interface AlertVersion {
  headline: string;
  description: string;
  instruction: string;
  severity: string;
  published: string;
}

export interface Alert {
  id: string;
  event: string;
  productCode: string;
  region: string;
  headline: string;
  published: string;
  severity: string;
  description: string;
  instruction: string;
  areaDesc: string;
  polygons?: string[];
  versions: AlertVersion[];
  isActive: boolean;
}

// --- INTERNAL STRUCTURES FOR XML PARSING ---

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
  parameter?: { valueName: string; value: string }[];
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

// --- UTILITY HELPERS ---

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

// --- MAIN FUNCTION ---

export const getLatestAlerts = async (): Promise<Alert[]> => {
  const locationInfo = await getLocationInfo();
  const region = locationInfo.regionCode;
  const allCapFiles: { file: ParsedFilename, subdirUrl: string }[] = [];

  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const nowUtcHour = now.getUTCHours(); // current hour UTC (e.g. 19)
  const twelveHoursAgoUtcHour = twelveHoursAgo.getUTCHours(); // start hour UTC (e.g. 7)
  const todayUtcDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  const yesterday = new Date(now);
  yesterday.setUTCDate(now.getUTCDate() - 1);
  const yesterdayUtcDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');

  // Create a list of {date, hour} pairs for the last 12 hours
  const utcHoursToCheck: { date: string, baseUrl: string, hour: string }[] = [];

  for (let i = 0; i < 12; i++) {
    const checkTime = new Date(now.getTime() - i * 60 * 60 * 1000); // Subtract i hours
    const utcDate = checkTime.toISOString().slice(0, 10).replace(/-/g, '');
    const utcHour = checkTime.getUTCHours().toString().padStart(2, '0') + '/';

    const baseUrl = utcDate === todayUtcDate
      ? `https://dd.weather.gc.ca/alerts/cap/${utcDate}/${region}/${utcHour}`
      : `https://dd.weather.gc.ca/yesterday/alerts/cap/${utcDate}/${region}/${utcHour}`;

    utcHoursToCheck.push({ date: utcDate, baseUrl, hour: utcHour });
  }

  // --- STEP 1: Fetch all cap files from each folder in the last 12 hours ---
  for (const { baseUrl } of utcHoursToCheck) {
    try {
      const response = await axios.get(baseUrl);
      const capRegex = /href="([^"]*\.cap)"/g;
      let match: RegExpExecArray | null;
      while ((match = capRegex.exec(response.data)) !== null) {
        allCapFiles.push({
          file: parseFilename(match[1]),
          subdirUrl: baseUrl,
        });
      }
    } catch (error) {
      // Folder may not exist — skip silently
      continue;
    }
  }

  if (allCapFiles.length === 0) return [];

  // --- STEP 2: Group by product code ---
  const groupedByProduct: { [key: string]: { file: ParsedFilename, subdirUrl: string }[] } = {};
  for (const item of allCapFiles) {
    if (!groupedByProduct[item.file.productCode]) {
      groupedByProduct[item.file.productCode] = [];
    }
    groupedByProduct[item.file.productCode].push(item);
  }

  // --- STEP 3: Parse and build alerts ---
  const allAlerts: Alert[] = [];
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

  for (const productCode in groupedByProduct) {
    const fileGroup = groupedByProduct[productCode];
    const tempVersions: { version: AlertVersion, fullInfo: CapInfo }[] = [];

    for (const { file, subdirUrl } of fileGroup) {
      const capUrl = `${subdirUrl}${file.filename}`;
      console.log(`[DEBUG] Parsing file: ${file.filename} | ProductCode: ${file.productCode} | From: ${capUrl}`);
      try {
        const response = await axios.get(capUrl);
        const jsonData: { alert: CapAlert } = parser.parse(response.data);
        const alertData = jsonData.alert || {};
        let infos = alertData.info || [];
        if (!Array.isArray(infos)) infos = infos ? [infos] : [];
        const englishInfo = infos.find(info => info.language === 'en-CA');

        if (englishInfo && alertData.sent && !isNaN(new Date(alertData.sent).getTime())) {
          tempVersions.push({
            version: {
              headline: englishInfo.headline ?? 'N/A',
              description: englishInfo.description ?? 'N/A',
              instruction: typeof englishInfo.instruction === 'string' ? englishInfo.instruction : 'No instructions provided.',
              severity: englishInfo.severity ?? 'N/A',
              published: alertData.sent,
            },
            fullInfo: englishInfo,
          });
        }
      } catch (err) {
        // Skip file if fetch or parse fails
        continue;
      }
    }

    if (tempVersions.length === 0) continue;

    // Sort all versions by publish date
    tempVersions.sort((a, b) => new Date(b.version.published).getTime() - new Date(a.version.published).getTime());
    const latest = tempVersions[0];

    // Use Alert_Location_Status to determine if active
    const locationStatusParam = latest.fullInfo.parameter?.find(p => p.valueName.includes('Alert_Location_Status'));
    const isActive = locationStatusParam?.value === 'active';

    const alert: Alert = {
      id: productCode,
      productCode,
      region,
      event: latest.fullInfo.event ?? 'N/A',
      published: latest.version.published,
      headline: latest.version.headline,
      severity: latest.version.severity,
      description: latest.version.description,
      instruction: latest.version.instruction,
      areaDesc: parseAreaDesc(latest.fullInfo.area),
      polygons: getAllPolygons(latest.fullInfo.area),
      versions: tempVersions.map(t => t.version),
      isActive,
    };

    allAlerts.push(alert);
  }

  return allAlerts;
};