import { Ionicons } from '@expo/vector-icons';

/**
 * A mapping from alert event types (lowercase) to their corresponding Ionicons name.
 */
export const alertIcons: { [key: string]: React.ComponentProps<typeof Ionicons>['name'] } = {
  'air quality': 'cloud-outline',
  'avalanche': 'snow-outline',
  'blizzard': 'snow-outline',
  'drought': 'sunny-outline',
  'dust storm': 'cloudy-outline',
  'earthquake': 'pulse-outline',
  'extreme cold': 'thermometer-outline',
  'flood': 'water-outline',
  'fog': 'cloudy-outline',
  'freezing rain': 'rainy-outline',
  'hail': 'cloudy-outline',
  'heat': 'sunny-outline',
  'heatwave': 'sunny-outline',
  'hurricane': 'sync-circle-outline',
  'ice storm': 'snow-outline',
  'landslide': 'earth-outline',
  'rainfall': 'rainy-outline',
  'snow squall': 'snow-outline',
  'snowfall': 'snow-outline',
  'storm surge': 'water-outline',
  'thunderstorm': 'thunderstorm-outline',
  'tornado': 'pulse-outline',
  'tsunami': 'water-outline',
  'volcanic ash': 'cloud-outline',
  'volcanic eruption': 'flame-outline',
  'wildfire': 'flame-outline',
  'wind': 'flag-outline',
  'winter storm': 'snow-outline',
};