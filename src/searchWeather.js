import { showElement, hideElement, debounce } from "./utils.js";
import { fetchAndUpdateWeatherData } from "./fetchWeather.js";

// APIs
const apiKey = process.env.ACCUWEATHER_API_KEY;
const cititesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
const statesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";

// Queries
const locationSearchPanel = document.querySelector(".location-search");
const showLocationSearchBtn = document.querySelector(".main-nav__location-btn");
const hideLocationSearchBtn = document.querySelector(".location-search__top-close-btn");
const searchInput = document.querySelector("#location-input");
const displayedList = document.querySelector(".location-search__bottom-results-list");

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);

const debouncedDisplayMatches = debounce(displayMatches, 500);
searchInput.addEventListener('input', debouncedDisplayMatches);

let cities = [];

fetch(cititesEndPoint)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    cities = data;
  });

function findMatches(wordToMatch, cities) {
  return cities.filter((city) => {
    const cityName = city.name;
    const stateName = city.state_name;
    const regex = new RegExp(wordToMatch, "gi");
    return cityName.match(regex) || stateName.match(regex);
  });
}

const clearInnerHTML = (e) => e.innerHTML = '';
const clearInputValue = (e) => e.value = '';

function displayMatches() {
  const searchInputValue = searchInput.value;
  const citiesMatch = findMatches(searchInputValue, cities);
  // console.log(citiesMatch);
  clearInnerHTML(displayedList);

  citiesMatch.forEach(city => {
    const li = document.createElement("li");
    li.className = 'location-search__bottom-results-item';
    li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
    li.setAttribute("data-lat", city.latitude);
    li.setAttribute("data-long", city.longitude);
    displayedList.appendChild(li);
  });

  displayedList.addEventListener('click', (event) => {
    const location = event.target.closest('.location-search__bottom-results-item');

    if (location) {
      const lat = location.dataset.lat;
      const lon = location.dataset.long;
      fetchAndUpdateWeatherData(lat, lon);
      clearInnerHTML(searchInput);
      clearInputValue(displayedList);
    }
  });
}
