const apiKey = process.env.ACCUWEATHER_API_KEY;
const selectedLocation = document.querySelector('.main-nav__location-btn');
const currentWeather = document.querySelector('.current-weather');
const currentWeatherCity = currentWeather.querySelector('.current-weather__city');
const currentWeatherTemp = currentWeather.querySelector('.current-weather__temperature');
const currentWeatherCondition = currentWeather.querySelector('.current-weather__condition');
const currentWeatherTempHi = currentWeather.querySelector('.current-weather__temperature-range__high');
const currentWeatherTempLo = currentWeather.querySelector('.current-weather__temperature-range__low');

function fetchAndUpdateWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Extract data to HTML mark up
      selectedLocation.textContent = data.name;
      // currentWeatherCity.textContent = data.name;
      currentWeatherTemp.textContent = `${Math.round(data.main.temp)}°`;
      currentWeatherCondition.textContent = data.weather[0].main;
      currentWeatherTempHi.textContent = `H:${Math.round(data.main.temp_max)}°`;
      currentWeatherTempLo.textContent = `L:${Math.round(data.main.temp_min)}°`;
    })
    .catch(error => console.error('Error fetching the data:', error));
};
// fetchAndUpdateWeatherData(35.5305307, 139.7028012);

function searchCityCoords(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  console.log('Hello form searchCityCoords');

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const coords = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      // console.log(coords);

      return coords;
    })
    .catch(error => console.error('Error fetching the data:', error));
};
// TEST
// searchCityCoords('Manila');

function getCurrentLocationCoords() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // console.log(fetchAndUpdateWeatherData(latitude, longitude));

      fetchAndUpdateWeatherData(latitude, longitude)
      // return { latitude, longitude };
    }, error => {
      console.error('Error getting geolocation:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};
// getCurrentLocationCoords();
