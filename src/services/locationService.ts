import * as Location from 'expo-location';

// 1. Define the shape of the location data for the rest of the app.
export interface LocationInfo {
  latitude: number;
  longitude: number;
  province: string | null;
  regionCode: string;
  city: string | null;
  fullAddress: string;
}

// Maps province codes/names → Environment Canada region codes.
// Includes both 2-letter abbreviations (Android) and full names (iOS CoreLocation).
const provinceToRegionMap: { [key: string]: string } = {
  // 2-letter abbreviations
  BC: 'CWVR', AB: 'CWWG', SK: 'CWWG', MB: 'CWWG',
  ON: 'CWTO', QC: 'CWUL',
  NB: 'CWHX', NS: 'CWHX', PE: 'CWHX', NL: 'CWHX',
  YT: 'CWNT', NT: 'CWNT', NU: 'CWNT',
  // Full names returned by iOS CoreLocation reverse geocoding
  'British Columbia': 'CWVR',
  'Alberta': 'CWWG', 'Saskatchewan': 'CWWG', 'Manitoba': 'CWWG',
  'Ontario': 'CWTO',
  'Quebec': 'CWUL', 'Québec': 'CWUL',
  'New Brunswick': 'CWHX', 'Nova Scotia': 'CWHX',
  'Prince Edward Island': 'CWHX',
  'Newfoundland and Labrador': 'CWHX', 'Newfoundland & Labrador': 'CWHX',
  'Yukon': 'CWNT', 'Northwest Territories': 'CWNT', 'Nunavut': 'CWNT',
};

/**
 * Gets the user's current location and converts it into structured, usable information.
 * This is the single source of truth for location in the app.
 * @returns {Promise<LocationInfo>} An object containing detailed location info.
 */
export const getLocationInfo = async (): Promise<LocationInfo> => {
  // Request permission from the user to access their location.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  // Get the device's current GPS coordinates.
  const loc = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = loc.coords;

  // Use reverse geocoding to convert coordinates into a human-readable address.
  const geocodedAddresses = await Location.reverseGeocodeAsync({ latitude, longitude });
  const address = geocodedAddresses[0];

  // Safely extract address components.
  const province = address?.region || null;
  const city = address?.city || null; // <-- FIX: Get the city from the address
  const street = address?.street || '';
  const streetNumber = address?.streetNumber || '';
  const postalCode = address?.postalCode || '';
  const country = address?.country || '';

  // Construct a full, readable address string for display.
  const fullAddress = `${streetNumber} ${street}, ${city}, ${province} ${postalCode}, ${country}`;
  
  // Map the province to the correct Environment Canada region code.
  const regionCode = province ? (provinceToRegionMap[province] || 'CWTO') : 'CWTO';

  // Return the complete, structured location object.
  return {
    latitude,
    longitude,
    province,
    regionCode,
    city, 
    fullAddress,
  };
};

