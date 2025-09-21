import { useEffect, useState } from 'react';
import { fetchAirQuality } from '../services/airQualityService';
import { useLocations } from './useLocations';

/**
 * Custom hook to retrieve air quality data based on user's location.
 */
export function useAirQuality() {
  const { locationInfo } = useLocations();
  const [airQuality, setAirQuality] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const getAirQuality = async () => {
      if (!locationInfo) return;
      try {
        const data = await fetchAirQuality(locationInfo.latitude, locationInfo.longitude);
        if (isMounted) setAirQuality(data);
      } catch (err) {
        console.error('❌ Error fetching air quality:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getAirQuality(); // Initial fetch

    intervalId = setInterval(getAirQuality, 60 * 1000); // Refresh every 60 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [locationInfo]);

  return { airQuality, loading };
}