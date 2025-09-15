/**
 * Defines consistent colors for different alert severity levels.
 */
export const severityColors: Record<string, string> = {
  extreme: '#c0392b',   // deep red
  severe: '#e67e22',    // orange
  moderate: '#f1c40f',  // yellow
  minor: '#3498db',     // blue
  unknown: '#7f8c8d',   // gray
};

/**
 * Returns a color string based on the severity key (case-insensitive).
 * Defaults to 'unknown' color if not matched.
 * 
 * @param severity - The severity level string (e.g., 'Severe', 'MODERATE')
 * @returns Corresponding color hex string
 */
export const getSeverityColor = (severity: string): string => {
  const key = severity.toLowerCase();
  return severityColors[key] ?? severityColors['unknown'];
};