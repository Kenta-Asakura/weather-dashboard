import { API_CONFIG } from "./config";
import { getElement } from "./ui/dom";
import { WeatherApiResponse, WeatherData } from "./types/weather.types";
import { WeatherService } from "./services/WeatherService";

const weatherService = new WeatherService();

const currentWeatherElements = {
  location: getElement<HTMLButtonElement>('.main-nav__location-btn'),
  city : getElement<HTMLHeadingElement>('.current-weather__city'),
  temp : getElement<HTMLHeadingElement>('.current-weather__temperature'),
  condition : getElement<HTMLParagraphElement>('.current-weather__condition'),
  tempHi : getElement<HTMLSpanElement>('.current-weather__temperature-range__high'),
  tempLo : getElement<HTMLSpanElement>('.current-weather__temperature-range__low')
};

const searchWeatherElements = {
  city: getElement<HTMLParagraphElement>('.location-search__top-current-location'),
  temp: getElement<HTMLSpanElement>('.location-search__top-current-temperature'),
  // icon: getElement<HTMLImageElement>('.location-search__top-current-icon-desktop'),
  // iconMobile: getElement<HTMLSourceElement>('.location-search__top-current-icon-mobile')
};

function updateCurrentWeather(data: WeatherData): void {
  const { location, city, temp, condition, tempHi, tempLo } = currentWeatherElements;

  location.innerHTML = `${data.cityName}, ${data.country} <span class='caret'></span>`;
  city.textContent = data.cityName;
  temp.textContent = `${data.temperature}°`;
  condition.textContent = data.condition;
  tempHi.textContent = `H:${data.tempMax}°`;
  tempLo.textContent = `L:${data.tempMin}°`;
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
    try {
      const WeatherData = await weatherService.getWeatherByCoords(lat, lon);

      updateCurrentWeather(WeatherData);
      updateSearchWeather(WeatherData);
    } catch (error) {
       console.error('Error fetching weather:', error);
    
      // Show error state to user
      currentWeatherElements.city.textContent = 'Error loading data';
      currentWeatherElements.temp.textContent = '--';
    }
};

function fetchCurrentLocationData(): void {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchAndUpdateWeatherData(latitude, longitude);
    }, error => {
      console.error('Error getting geolocation:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  fetchCurrentLocationData();
});
