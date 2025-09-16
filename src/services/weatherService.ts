import axios from 'axios';

const API_KEY = 'b1d43c6d98feb512ec399ee8f61a2fec'; // OpenWeatherMap api key(name = DisasterCan)
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(lat: number, lon: number) {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric', // Celsius
    },
  });
  return response.data;
}
