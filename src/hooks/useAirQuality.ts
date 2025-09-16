import { useEffect, useState } from 'react';
import { fetchAirQuality } from '../services/airQualityService';
import { useLocations } from './useLocations';

/**
 * Custom hook to retrieve air quality data based on user's location
 */
export function useAirQuality() {
  const { locationInfo } = useLocations();
  const [airQuality, setAirQuality] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (locationInfo) {
      fetchAirQuality(locationInfo.latitude, locationInfo.longitude)
        .then(setAirQuality)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [locationInfo]);

  return { airQuality, loading };
}