import { getElement } from "./ui/dom";
import { WeatherData } from "./types/weather.types";
import { WeatherService } from "./services/WeatherService";
import { GeolocationService } from "./services/GeolocationService";

import { render as renderCurrentWeather } from './ui/currentWeather.ui';

// Create service instances
const weatherService = new WeatherService();
const geolocationService = new GeolocationService();

const searchWeatherElements = {
  city: getElement<HTMLParagraphElement>('.location-search__top-current-location'),
  temp: getElement<HTMLSpanElement>('.location-search__top-current-temperature'),
  // icon: getElement<HTMLImageElement>('.location-search__top-current-icon-desktop'),
  // iconMobile: getElement<HTMLSourceElement>('.location-search__top-current-icon-mobile')
};

function updateSearchWeather(data: WeatherData): void {
  const { city, temp } = searchWeatherElements;
  const iconUrl = `https://openweathermap.org/img/wn/${data.iconCode}@2x.png`;
  const iconMobileUrl = `https://openweathermap.org/img/wn/${data.iconCode}.png`;

  city.textContent = data.cityName;
  temp.textContent = `${data.temperature}°`;
};

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

async function fetchCurrentLocationData(): Promise<void> {
  try {
    const coords = await geolocationService.getCurrentPosition();
    
    await fetchAndUpdateWeatherData(coords.latitude, coords.longitude);
  } catch (error) {
    console.error('Error getting location:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCurrentLocationData();
});