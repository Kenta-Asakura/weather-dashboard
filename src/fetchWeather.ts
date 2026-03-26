import { WeatherService } from "./services/WeatherService";
import { render as renderCurrentWeather } from './ui/currentWeather.ui';
import { updateCurrentWeather as updateSearchWeather } from './ui/locationSearch.ui';

// Create service instances
const weatherService = new WeatherService();

// Main function 
export async function fetchAndUpdateWeatherData(lat: number, lon: number): Promise<void> {
    renderCurrentWeather({ status: 'loading'});

    try {
      const data = await weatherService.getWeatherByCoords(lat, lon);

      renderCurrentWeather({ status: 'success', data });
      updateSearchWeather(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      renderCurrentWeather({ status: 'error', error: message });
    }
};