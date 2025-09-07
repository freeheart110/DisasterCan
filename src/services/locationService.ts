import * as Location from 'expo-location';

// --- TYPE DEFINITIONS ---

export interface LocationInfo {
  latitude: number;
  longitude: number;
  province: string;      // e.g., "SK"
  regionCode: string;    // e.g., "CWWG"
  addressString: string; // e.g., "Regina, SK, Canada"
}

// Maps province codes (e.g., "BC") to Environment Canada region codes.
const provinceToRegionMap: { [key: string]: string } = {
  BC: 'CWVR', // British Columbia
  AB: 'CWWG', // Alberta
  SK: 'CWWG', // Saskatchewan
  MB: 'CWWG', // Manitoba
  ON: 'CWTO', // Ontario
  QC: 'CWUL', // Quebec
  NL: 'CWHX', // Newfoundland and Labrador
  PE: 'CWHX', // Prince Edward Island
  NS: 'CWHX', // Nova Scotia
  NB: 'CWHX', // New Brunswick
  YT: 'CWNT', // Yukon
  NT: 'CWNT', // Northwest Territories
  NU: 'CWNT', // Nunavut
};

/**
 * Gets the user's GPS location, determines their province via reverse geocoding,
 * and maps it to the correct Environment Canada alert region code.
 */
export const getLocationInfo = async (): Promise<LocationInfo> => {
  // 1. Request permission to access the device's location.
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  // 2. Get the current GPS coordinates.
  const loc = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = loc.coords;

  // 3. Use reverse geocoding to convert coordinates into a human-readable address.
  const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
  
  const address = geocode[0];
  const provinceCode = address?.region || 'ON'; // Default to Ontario if not found
  const regionCode = provinceToRegionMap[provinceCode] || 'CWTO'; // Default to Ontario's region

  // 4. Construct a clean address string for display.
  const addressString = address
    ? `${address.city}, ${address.region}, ${address.country}`
    : 'Address not found';

  return {
    latitude,
    longitude,
    province: provinceCode,
    regionCode,
    addressString,
  };
};

