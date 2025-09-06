import { LatLng, Region } from 'react-native-maps';

/**
 * Parses a space-separated string of "lat,lng" coordinates into an array of LatLng objects.
 * @param polygonString The raw polygon string from the CAP alert.
 * @returns An array of LatLng objects for the MapView component.
 */
export const parsePolygon = (polygonString: string): LatLng[] => {
  return polygonString.split(' ').map(point => {
    const [latitude, longitude] = point.split(',');
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  });
};

/**
 * Calculates the center point and the appropriate zoom level (deltas) for a given polygon.
 * @param coords An array of LatLng coordinates that form the polygon.
 * @returns A Region object including center coordinates and deltas for the MapView.
 */
export const getPolygonCenter = (coords: LatLng[]): Region => {
  if (coords.length === 0) {
    // Default region if no coordinates are provided
    return {
      latitude: 49.2827,
      longitude: -123.1207,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };
  }

  // Find the bounding box of the polygon
  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  for (const coord of coords) {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  }

  // Calculate the center of the bounding box
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate the deltas (span) of the map, adding some padding
  const latDelta = (maxLat - minLat) * 1.5;
  const lngDelta = (maxLng - minLng) * 1.5;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

