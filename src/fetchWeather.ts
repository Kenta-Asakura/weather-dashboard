import { getElement } from "./utils";

const apiKey = process.env.ACCUWEATHER_API_KEY;

if (!apiKey) {
  throw new Error('API key is missing. Please set the ACCUWEATHER_API_KEY environment variable.');
};

const currentWeatherElements = {
  location: getElement('.main-nav__location-btn'),
  city : getElement('.current-weather__city'),
  temp : getElement('.current-weather__temperature'),
  condition : getElement('.current-weather__condition'),
  tempHi : getElement('.current-weather__temperature-range__high'),
  tempLo : getElement('.current-weather__temperature-range__low')
};

const searchWeatherElements = {
  city: getElement('.location-search__top-current-location'),
  temp: getElement('.location-search__top-current-temperature'),
  // icon: getElement('.location-search__top-current-icon-desktop'),
  // iconMobile: getElement('.location-search__top-current-icon-mobile')
};


// Helper functions
function buildWeatherApiUrl(lat: number, lon: number) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
};

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { main: string; icon: string }[];
}

function updateCurrentWeather(data: WeatherData): void {
  // console.log(data);

  const { name, sys, main, weather  } = data;
  const { location, city, temp, condition, tempHi, tempLo } = currentWeatherElements;

  location.innerHTML = `${name}, ${sys.country} <span class='caret'></span>`;
  city.textContent = name;
  temp.textContent = `${Math.round(main.temp)}°`;
  condition.textContent = weather[0].main;
  tempHi.textContent = `H:${Math.round(main.temp_max)}°`;
  tempLo.textContent = `L:${Math.round(main.temp_min)}°`;
};

function updateSearchWeather(data: WeatherData): void {
  const { name, weather, main } = data;
  const {
    city,
    temp,
    // icon,
    // iconMobile
  } = searchWeatherElements;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const iconMobileUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

  city.textContent = name;
  // icon.src = iconUrl;
  // icon.alt = weather[0].main;;
  // iconMobile.srcset = iconMobileUrl;
  temp.textContent = `${Math.round(main.temp)}°`;
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

function fetchCurrentLocationData() {
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
