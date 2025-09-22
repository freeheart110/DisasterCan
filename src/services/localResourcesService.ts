import odhfData from '../../assets/odhf_v1.1.json';
import haversine from 'haversine-distance';

export interface LocalResource {
  id: string;
  facility_name: string;
  odhf_facility_type: string;
  provider: string;
  street_no: string | number;
  street_name: string;
  city: string;
  province: string;
  postal_code: string;
  latitude?: number | string;
  longitude?: number | string;
  address: string;
  phone?: string;
  website?: string;
}

// Define max radius for filtering (50 km)
const MAX_RADIUS_METERS = 50000;

// Define allowed facility types for DisasterCan
const allowedFacilityTypes = new Set([
  'Hospital', 'hospital', 'hospital (emergency)',
  'walk-in clinic', 'Walk-in Clinic',
  'clinic', 'clinic, primary care', 'clinic, outpatient, longterm',
  'medical centre', 'medical clinic', 'medical clinics',
  'nurse practitioner led clinic',
  'Mental Health and Addictions', 'mental health', 'mental health and substance use',
  'mental health clinic', 'mental health centre', 'psychiatric', 'Psychiatric Hospital',
  'shelter', 'retirement home', 'long term care', 'long-term care',
  'Licensed Nursing Home', 'Private Nursing Home', 'Public Care Home', 'Special Care Home',
  'community health centre', 'community health centres', 'community support service',
  'Public Health Unit Office', 'public health office', 'public nursing home',
  'home care', 'home care office'
]);

/**
 * Filters and loads nearby local emergency resources based on location and relevance.
 */
export const loadLocalResources = async (
  userLat: number,
  userLon: number
): Promise<LocalResource[]> => {
  const resources: LocalResource[] = (odhfData as any[])
    .filter((item) => {
      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);
      // Skip items with invalid coordinates
      if (isNaN(lat) || isNaN(lon)) return false;

      // Filter by relevant facility types
      const type = item.source_facility_type?.trim();
      if (!type || !allowedFacilityTypes.has(type)) return false;

      // Filter by distance
      const distance = haversine({ lat: userLat, lon: userLon }, { lat, lon });
      return distance <= MAX_RADIUS_METERS;
    })
    .map((item, index) => ({
      id: `resource-${index}`,
      facility_name: item.facility_name || 'Unknown',
      odhf_facility_type: item.odhf_facility_type || 'Unknown',
      provider: item.provider || 'Unknown',
      street_no: item.street_no || '',
      street_name: item.street_name || '',
      city: item.city || '',
      province: item.province || '',
      postal_code: item.postal_code || '',
      latitude: parseFloat(item.latitude),
      longitude: parseFloat(item.longitude),
      address: `${item.street_no ?? ''} ${item.street_name ?? ''}`.trim(),
      phone: undefined,
      website: undefined,
    }));

  return resources;
};