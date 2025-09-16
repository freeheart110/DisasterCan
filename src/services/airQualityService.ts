import axios from 'axios';

const API_KEY = 'b1d43c6d98feb512ec399ee8f61a2fec'; // OpenWeatherMap api key(name = DisasterCan)
const BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

/**
 * Fetch air quality data using latitude and longitude
 */
export async function fetchAirQuality(lat: number, lon: number) {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
    },
  });

  return response.data.list[0]; // Return the latest air quality reading
}