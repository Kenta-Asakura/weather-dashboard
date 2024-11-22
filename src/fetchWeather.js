const apiKey = process.env.ACCUWEATHER_API_KEY;

// Current weather elements
const currentLocation = document.querySelector('.main-nav__location-btn');
const currentWeather = document.querySelector('.current-weather');
const currentWeatherCity = currentWeather.querySelector('.current-weather__city');
const currentWeatherTemp = currentWeather.querySelector('.current-weather__temperature');
const currentWeatherCondition = currentWeather.querySelector('.current-weather__condition');
const currentWeatherTempHi = currentWeather.querySelector('.current-weather__temperature-range__high');
const currentWeatherTempLo = currentWeather.querySelector('.current-weather__temperature-range__low');

// Search panel elements
const searchCityElement = document.querySelector('.location-search__top-current-location');
// const searchCitySubElement = document.querySelector('.location- search__top-current-location__sub');
const searchCurrentWeather = document.querySelector('.location-search__top-current-temperature');
const searchCurrentWeatherIcon = document.querySelector('.location-search__top-current-icon');


export function fetchAndUpdateWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
      // console.log(fetchAndUpdateWeatherData(latitude, longitude));
    .then(response => response.json())
    .then(data => {
      // Extract data to HTML mark up
      // console.log(data);

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`

      currentLocation.innerHTML = `${data.name}, ${data.sys.country} <span class='caret'></span>`;
      currentWeatherCity.textContent = data.name;
      currentWeatherTemp.textContent = `${Math.round(data.main.temp)}°`;
      currentWeatherCondition.textContent = data.weather[0].main;
      currentWeatherTempHi.textContent = `H:${Math.round(data.main.temp_max)}°`;
      currentWeatherTempLo.textContent = `L:${Math.round(data.main.temp_min)}°`;

      // Extract data to search panel HTML mark up
      searchCityElement.textContent = data.name;
      searchCurrentWeatherIcon.src = iconUrl;
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
