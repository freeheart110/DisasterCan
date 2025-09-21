import { useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService';
import { useLocations } from './useLocations';

// This custom hook fetches weather based on the current user's location.
export function useWeather() {
  const { locationInfo } = useLocations();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const getWeather = async () => {
      if (!locationInfo) return;
      try {
        const data = await fetchWeather(locationInfo.latitude, locationInfo.longitude);
        if (isMounted) setWeather(data);
      } catch (err) {
        console.error('❌ Error fetching weather:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getWeather(); // Initial fetch

    intervalId = setInterval(getWeather, 60 * 1000); // Update every 60 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [locationInfo]);

  return { weather, loading };
}