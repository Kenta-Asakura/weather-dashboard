import '../styles/main.scss';

import { WeatherService } from './services/WeatherService';
import { GeolocationService } from './services/GeolocationService';
import { CitySearchService } from './services/CitySearchService';
import { render as renderCurrentWeather } from './ui/currentWeather.ui';
import { init as initLocationSearch, updateCurrentWeather } from './ui/locationSearch.ui';

async function bootstrap(): Promise<void> {
  const weatherService = new WeatherService();
  const geolocationService = new GeolocationService();
  const citySearchService = new CitySearchService();

  async function handleWeatherFetch(lat: number, lon: number): Promise<void> {
    renderCurrentWeather({ status: 'loading' });

    try {
      const data = await weatherService.getWeatherByCoords(lat, lon);
      renderCurrentWeather({ status: 'success', data });
      updateCurrentWeather(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      renderCurrentWeather({ status: 'error', error: message });
    }
  }

  await initLocationSearch(citySearchService, (lat, lon) => {
    handleWeatherFetch(lat, lon);
  });

  try {
    const coords = await geolocationService.getCurrentPosition();
    await handleWeatherFetch(coords.latitude, coords.longitude);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    renderCurrentWeather({ status: 'error', error: message });
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);