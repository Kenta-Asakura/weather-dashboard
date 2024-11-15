import { showElement } from "./utils.js";
import { hideElement } from "./utils.js";

const apiKey = process.env.ACCUWEATHER_API_KEY;
const locationSearchPanel = document.querySelector(".location-search");
const showLocationSearchBtn = document.querySelector(".main-nav__location-btn");
const hideLocationSearchBtn = document.querySelector(".location-search__top-close-btn");
const searchInput = document.querySelector("#location-input");
const displayedList = document.querySelector(".location-search__bottom-results-list");
const cititesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
const statesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);

function debounce(cb, delay = 300) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

const debouncedDisplayMatches = debounce(displayMatches, 500);
searchInput.addEventListener('input', debouncedDisplayMatches);
// searchInput.addEventListener('change', displayMatches);
// searchInput.addEventListener('keyup', displayMatches);
let cities = [];
let citiesMatch = [];

// - when the user clicks/selects on a match use the OpenWeather API
// to get the weather of the selected value
// - display the weather of selected match

fetch(cititesEndPoint)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data); // You can use this data after it's fetched
    cities = data; // Store the fetched cities data in the 'cities' variable
  });

function findMatches(wordToMatch, cities) {
  return cities.filter((city) => {
    const cityName = city.name;
    const stateName = city.state_name;
    const regex = new RegExp(wordToMatch, "gi");
    return cityName.match(regex) || stateName.match(regex);
  });
}

function displayMatches() {
  const searchInputValue = searchInput.value;
  const citiesMatch = findMatches(searchInputValue, cities);
  // console.log(citiesMatch);

  displayedList.innerHTML = '';
  citiesMatch.forEach(city => {
    const li = document.createElement("li");
    li.className = 'location-search__bottom-results-item';
    li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
    displayedList.appendChild(li);
  });
}
