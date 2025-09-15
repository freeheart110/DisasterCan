/**
 * Converts a UTC ISO 8601 date string into a relative time format (e.g., "5m ago", "2h ago").
 * This function correctly compares the provided UTC time with the current UTC time,
 * ensuring the calculation is independent of the user's local time zone.
 *
 * @param utcDateString The ISO 8601 timestamp from the CAP alert (e.g., "2025-08-17T16:11:53-00:00").
 * @returns A formatted string representing the time elapsed since the alert was published.
 */
export const formatTimeAgo = (utcDateString: string): string => {
  // Return an empty string if the input is invalid to prevent crashes.
  if (!utcDateString || utcDateString === 'N/A') {
    return '';
  }

  // Create a Date object from the UTC string. JavaScript's Date object
  // correctly interprets ISO 8601 strings with timezone offsets as UTC.
  const alertDate = new Date(utcDateString);

  // Get the current time. new Date() creates a date based on the user's
  // system time, but its internal value is based on UTC milliseconds since epoch.
  const now = new Date();
  
  // --- CONSOLE LOGS FOR VERIFICATION ---
  // Log the times to the terminal to confirm they are being handled as UTC.
  // console.log('--- Time Calculation ---');
  // console.log('Alert Time (UTC):', alertDate.toUTCString());
  // console.log('Current Time (UTC):', now.toUTCString());
  // ------------------------------------
  // Calculate the difference in seconds. getTime() returns milliseconds since
  // the UTC epoch for both dates, making the comparison timezone-agnostic.
  const seconds = Math.floor((now.getTime() - alertDate.getTime()) / 1000);

  // --- Convert seconds into a readable format ---

  // More than a year
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)}y ago`;
  }
  // More than a month
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)}mo ago`;
  }
  // More than a day
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)}d ago`;
  }
  // More than an hour
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)}h ago`;
  }
  // More than a minute
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)}m ago`;
  }
  // Less than a minute
  return "Just now";
};
