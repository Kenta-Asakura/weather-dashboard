const apiKey = process.env.ACCUWEATHER_API_KEY;

const currentWeather = document.querySelector('.current-weather');
const currentWeatherElements = {
  location: document.querySelector('.main-nav__location-btn'),
  city : currentWeather.querySelector('.current-weather__city'),
  temp : currentWeather.querySelector('.current-weather__temperature'),
  condition : currentWeather.querySelector('.current-weather__condition'),
  TempHi : currentWeather.querySelector('.current-weather__temperature-range__high'),
  TempLo : currentWeather.querySelector('.current-weather__temperature-range__low')
};

// Search panel elements
const searchCityElement = document.querySelector('.location-search__top-current-location');
const searchCurrentWeather = document.querySelector('.location-search__top-current-temperature');
const searchCurrentWeatherIcon = document.querySelector('.location-search__top-current-icon-desktop');
const searchCurrentWeatherIconMobile = document.querySelector('.location-search__top-current-icon-mobile');


export function fetchAndUpdateWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
      // console.log(fetchAndUpdateWeatherData(latitude, longitude));
    .then(response => response.json())
    .then(data => {
      // Extract data to HTML mark up
      // console.log(data);

      const { location, city, temp, condition, tempHi, tempLo } = currentWeatherElements;
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const iconMobileUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      location.innerHTML = `${data.name}, ${data.sys.country} <span class='caret'></span>`;
      city.textContent = data.name;
      temp.textContent = `${Math.round(data.main.temp)}°`;
      condition.textContent = data.weather[0].main;
      tempHi.textContent = `H:${Math.round(data.main.temp_max)}°`;
      tempLo.textContent = `L:${Math.round(data.main.temp_min)}°`;

      // Extract data to search panel HTML mark up
      searchCityElement.textContent = data.name;
      searchCurrentWeatherIcon.src = iconUrl;
      searchCurrentWeatherIcon.alt = data.weather[0].main;;
      searchCurrentWeatherIconMobile.srcset = iconMobileUrl;
      searchCurrentWeather.textContent = `${Math.round(data.main.temp)}°`;
    })
    .catch(error => console.error('Error fetching the data:', error));
};

document.addEventListener('DOMContentLoaded', () => {
  fetchCurrentLocationData();
});

function fetchCurrentLocationData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchAndUpdateWeatherData(latitude, longitude)
    }, error => {
      console.error('Error getting geolocation:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};
