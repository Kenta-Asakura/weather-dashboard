import { API_CONFIG } from "./config";
import { getElement } from "./ui/dom";
import { WeatherApiResponse, WeatherData } from "./types/weather.types";
import { WeatherService } from "./services/WeatherService";

// !TEST
const weatherService = new WeatherService();

// !needs to be deleted
const apiKey = API_CONFIG.weatherApiKey;

if (!apiKey) {
  throw new Error('API key is missing. Please set the OPENWEATHER_API_KEY environment variable.');
}
// !

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

// Helper functions
function buildWeatherApiUrl(lat: number, lon: number): string {
  return `${API_CONFIG.weatherBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

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
  // const { name, weather, main } = data;
  const { city, temp } = searchWeatherElements;
  const iconUrl = `https://openweathermap.org/img/wn/${data.iconCode}@2x.png`;
  const iconMobileUrl = `https://openweathermap.org/img/wn/${data.iconCode}.png`;

  city.textContent = data.cityName;
  temp.textContent = `${data.temperature}°`;
};


// Main function
export function fetchAndUpdateWeatherData(lat: number, lon: number): void {
  const url = buildWeatherApiUrl(lat, lon);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
      updateCurrentWeather(data);
      updateSearchWeather(data);
    })
    .catch(error => {
      console.error('Error fetching the data:', error)
      currentWeatherElements.city.textContent = 'Error loading data';
      currentWeatherElements.temp.textContent = '--';
    });
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
