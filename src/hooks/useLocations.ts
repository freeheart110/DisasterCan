import { useState, useEffect } from 'react';
import { getLocationInfo, LocationInfo } from '../services/locationService';

// This hook now provides detailed location info, including coordinates and region.
export const useLocations = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getLocationInfo();
        setLocationInfo(data);
      } catch (err) {
        setError((err as Error).message ?? 'Failed to fetch location');
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  return { locationInfo, loading, error };
};
