import { useState, useEffect } from 'react';
import { getLatestAlerts } from '../services/alertService';
import type { Alert } from '../services/alertService';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getLatestAlerts();
        setAlerts(data);
      } catch (err) {
        setError((err as Error).message ?? 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
    // Optional: Poll every 60 seconds for updates
    // const interval = setInterval(fetchAlerts, 60000);
    // return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error };
};