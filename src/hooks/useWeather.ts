import { useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService';
import { useLocations } from './useLocations';

// This custom hook fetches weather based on the current user's location.
export function useWeather() {
  // Destructure locationInfo from useLocations hook
  const { locationInfo } = useLocations();

  // Local state to store weather and loading status
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // When location info is available, fetch weather for that location
  useEffect(() => {
    if (locationInfo) {
      fetchWeather(locationInfo.latitude, locationInfo.longitude)
        .then(setWeather)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [locationInfo]);

  return { weather, loading };
}