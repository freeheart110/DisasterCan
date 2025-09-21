import { useEffect, useState } from 'react';
import { loadLocalResources, LocalResource } from '../services/localResourcesService';
import { useLocations } from '../hooks/useLocations';

/**
 * Hook to fetch local emergency resources based on user's current location.
 */
export function useLocalResources() {
  const { locationInfo, loading: locationLoading, error: locationError } = useLocations();
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!locationInfo?.latitude || !locationInfo?.longitude) return;

      try {
        setLoading(true);
        const nearbyResources = await loadLocalResources(locationInfo.latitude, locationInfo.longitude);
        setResources(nearbyResources);
      } catch (err: any) {
        console.error('Error loading resources:', err);
        setError(err.message || 'Failed to load local resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [locationInfo]);

  // If location failed to load, show error
  useEffect(() => {
    if (locationError) {
      setError(locationError);
      setLoading(false);
    }
  }, [locationError]);

  return { resources, loading: loading || locationLoading, error };
}