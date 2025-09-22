// import * as FileSystem from 'expo-file-system';
// import type { Alert } from './alertService';

// // Manually type them so TS stops complaining
// const DOCUMENT_DIR: string = (FileSystem as any).documentDirectory;
// const UTF8: string = (FileSystem as any).EncodingType?.UTF8 ?? 'utf8';

// if (!DOCUMENT_DIR) {
//   throw new Error('documentDirectory is not available on this platform.');
// }

// const CACHE_FILE_PATH = `${DOCUMENT_DIR}alertCache.json`;

// // Save alerts
// export const saveAlertsToCache = async (alerts: Alert[]): Promise<void> => {
//   try {
//     const jsonString = JSON.stringify(alerts);
//     await FileSystem.writeAsStringAsync(CACHE_FILE_PATH, jsonString, {
//       encoding: UTF8,
//     });
//     console.log('✅ Alerts successfully saved to cache.');
//   } catch (error) {
//     console.error('❌ Failed to save alerts to cache:', error);
//   }
// };

// // Load alerts
// export const loadAlertsFromCache = async (): Promise<Alert[]> => {
//   try {
//     const fileInfo = await FileSystem.getInfoAsync(CACHE_FILE_PATH);
//     if (!fileInfo.exists) {
//       console.log('Cache file does not exist yet.');
//       return [];
//     }

//     const jsonString = await FileSystem.readAsStringAsync(CACHE_FILE_PATH, {
//       encoding: UTF8,
//     });

//     const cachedAlerts = JSON.parse(jsonString) as Alert[];
//     return cachedAlerts.map(alert => ({ ...alert, isFromCache: true }));
//   } catch (error) {
//     console.error('❌ Failed to load alerts from cache:', error);
//     return [];
//   }
// };
