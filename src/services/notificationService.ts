import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLatestAlerts, Alert } from './alertService';

const BACKGROUND_TASK = 'background-alert-task';
const NOTIFIED_ALERTS_KEY = 'notified_alerts';

/**
 * Defines the background task that will run periodically.
 * This function is executed by the operating system headless (without a UI).
 */
TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    console.log('Background task running...');
    // Step 1: Fetch the latest alerts using the core alert service.
    const newAlerts: Alert[] = await getLatestAlerts();

    // Step 2: Retrieve the list of alert IDs already sent notifications for.
    const notifiedAlertsStr = await AsyncStorage.getItem(NOTIFIED_ALERTS_KEY);
    const notifiedAlerts: string[] = notifiedAlertsStr ? JSON.parse(notifiedAlertsStr) : [];

    // Step 3: Filter the latest alerts to find ones that are new and high-priority.
    const alertsToSend = newAlerts.filter(alert => {
      const hasBeenNotified = notifiedAlerts.includes(alert.id);
      const isHighPriority = alert.severity !== 'Moderate' && alert.severity !== 'Minor';
      return !hasBeenNotified && isHighPriority;
    });

    // Step 4: If new high-priority alerts are found, schedule notifications for them.
    if (alertsToSend.length > 0) {
      // Loop through each new alert to send a separate notification.
      for (const alert of alertsToSend) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `New Alert: ${alert.event}`,
            body: alert.headline,
            data: { url: `/alert-detail/${alert.id}` }, // Data for deep linking
          },
          trigger: null, // Using `null` sends the notification immediately.
        });
      }

      // Step 5: Update the storage with the new alert IDs to prevent duplicate notifications.
      const updatedNotifiedIds = [...notifiedAlerts, ...alertsToSend.map(a => a.id)];
      await AsyncStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify(updatedNotifiedIds));
    }

    // Inform the OS that the task completed successfully.
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('Background task failed:', error);
    // Inform the OS that the task failed.
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/**
 * Registers the background task with the operating system.
 * This should be called once when the application starts up.
 */
export async function registerBackgroundTaskAsync() {
  // Check if the device supports background tasks.
  const isAvailable = await TaskManager.isAvailableAsync();
  if (!isAvailable) {
    console.log('Background tasks not available on this device.');
    return;
  }

  // Check if the task is already registered to avoid re-registering on every app start.
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
  if (!isRegistered) {
    console.log('Registering background task.');
    // Register the task with a minimum interval.
    // Note: This interval is primarily a hint for Android. iOS will manage the
    // execution schedule based on its own algorithm.
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
    });
  } else {
    console.log('Background task already registered.');
  }
}

