import { View, Text, StyleSheet, Image } from 'react-native';
import { useAirQuality } from '../hooks/useAirQuality';

// Displays current weather info including temperature, condition, and air quality
export function WeatherCard({ weather }: { weather: any }) {
  const { airQuality, loading: airQualityLoading } = useAirQuality();

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

  // Map AQI index to description
  const getAQIDescription = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'Good';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Poor';
      case 5:
        return 'Very Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Section: Icon + Temperature/Condition + Details */}
      <View style={styles.topRow}>
        {/* Left Side: Icon + Temperature & Condition & AQI */}
        <View style={styles.left}>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
          <View>
            <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
            <Text style={styles.condition}>{weather.weather[0].description}</Text>
            {!airQualityLoading && airQuality && (
              <Text style={styles.aqi}>
                Air Quality: {getAQIDescription(airQuality.main.aqi)} (AQI {airQuality.main.aqi})
              </Text>
            )}
          </View>
        </View>

        {/* Right Side: Feels Like / Humidity / Wind */}
        <View style={styles.right}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Feels like:</Text>
            <Text style={styles.value}>{Math.round(weather.main.feels_like)}°C</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Humidity:</Text>
            <Text style={styles.value}>{weather.main.humidity}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Wind:</Text>
            <Text style={styles.value}>{weather.wind.speed} m/s</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#87ceeb', // Sky blue background
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  temp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  condition: {
    fontSize: 14,
    color: '#37474f',
    textTransform: 'capitalize',
  },
  aqi: {
    fontSize: 13,
    color: '#263238',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 12,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 12,
    color: '#37474f',
    marginRight: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
});