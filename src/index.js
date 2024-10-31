import '../styles/main.scss';
import './hamburgerMenu.js';

// Current location's weather
// high priority
// - temperature
// - wind
// - humidity

// not priority
// -temperature
// ---high and low
// - sunset/sunrise

const apiKey = process.env.ACCUWEATHER_API_KEY;

const currentWeather = document.querySelector('.current-weather');
const currentWeatherCity = currentWeather.querySelector('.current-weather__city');
const currentWeatherTemp = currentWeather.querySelector('.current-weather__temperature');
const currentWeatherCondition = currentWeather.querySelector('.current-weather__condition');

const city = 'Tokyo'; // Replace with the city you want to fetch weather for`
const lat = 35.6895; // Latitude for Tokyo
const lon = 139.6917; // Longitude for Tokyo
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;


function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

      getWeatherData(latitude, longitude);
    }, error => {
      console.error('Error getting geolocation:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

getCurrentLocation();

function getWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Display the data in the console
    })
    .catch(error => console.error('Error fetching the data:', error));
};
