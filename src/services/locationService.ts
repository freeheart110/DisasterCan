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

// A mapping from province postal codes to Environment Canada region codes.
const provinceToRegionMap: { [key: string]: string } = {
  BC: 'CWVR', // British Columbia
  AB: 'CWWG', // Alberta (Prairies)
  SK: 'CWWG', // Saskatchewan (Prairies)
  MB: 'CWWG', // Manitoba (Prairies)
  ON: 'CWTO', // Ontario
  QC: 'CWUL', // Quebec
  NB: 'CWHX', // New Brunswick (Atlantic)
  NS: 'CWHX', // Nova Scotia (Atlantic)
  PE: 'CWHX', // PEI (Atlantic)
  NL: 'CWHX', // Newfoundland & Labrador (Atlantic)
  YT: 'CWNT', // Yukon (Territories)
  NT: 'CWNT', // Northwest Territories
  NU: 'CWNT', // Nunavut
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

