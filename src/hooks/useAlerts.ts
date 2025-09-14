import { useState, useEffect } from 'react';
import { getLatestAlerts } from '../services/alertService';
import type { Alert } from '../services/alertService';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For the initial load
  const [isPolling, setIsPolling] = useState<boolean>(false); // For background refreshes
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAlerts = async (isBackgroundPoll = false) => {
      // Only show the main spinner on the first load. For polls, use the subtle indicator.
      if (isBackgroundPoll) {
        setIsPolling(true);
      } else {
        setLoading(true);
      }
      
      try {
        const data = await getLatestAlerts();
        setAlerts(data);
        setLastChecked(new Date()); // Update the last checked timestamp
      } catch (err) {
        setError((err as Error).message ?? 'Failed to fetch alerts');
      } finally {
        // Ensure the correct loading state is turned off.
        if (isBackgroundPoll) {
          setIsPolling(false);
        } else {
          setLoading(false);
        }
      }
    };

    // Initial fetch when the component mounts.
    fetchAlerts();

    // Set up the polling interval to call fetchAlerts in background mode.
    const interval = setInterval(() => fetchAlerts(true), 60000); // Poll every 60 seconds

    // Clean up the interval when the component unmounts.
    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, isPolling, error, lastChecked };
};
