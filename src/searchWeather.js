import { log } from "neo-async";
import { showElement } from "./utils.js";
import { hideElement } from "./utils.js";

const apiKey = process.env.ACCUWEATHER_API_KEY;
const locationSearchPanel = document.querySelector(".location-search");
const showLocationSearchBtn = document.querySelector(".main-nav__location-btn");
const hideLocationSearchBtn = document.querySelector(".location-search__top-close-btn");

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);


//
const cities = [];
const searchInput = document.querySelector("#location-input");
const displayedList = document.querySelector(".location-search__bottom-results-list");

// const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const openWeatherEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid=${apiKey}`;
const cititesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
const statesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";

function debounce(cb, delay = 300) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

const debouncedDisplayMatches = debounce(displayMatches, 400);
searchInput.addEventListener('input', debouncedDisplayMatches);
// searchInput.addEventListener('change', displayMatches);
// searchInput.addEventListener('keyup', displayMatches);

// fetch(endpoint)
//   // .then(res => console.log('res', res))
//   .then(res => res.json())
//   // .then(data => cities.push(data))
//   .then(data => cities.push(...data));
// console.log(cities);

function findMatches(wordToMatch, cities) {
  return cities.filter((place) => {
    console.log(place);
    console.log(place.name);
    const cityName = place.name

    // check if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, "gi"); // ?
    // return place.city.match(regex) || place.state.match(regex); //.match ??
    return cityName.match(regex).match;
  });
}

// - get the citites list
// - match the current inmput the the list
// - display the matches
// - when the user clicks/selects on a match use the OpenWeather API
// to get the weather of the selected value
// - display the weather of selected match

function displayMatches() {
  const searchInputValue = searchInput.value;
  console.log(searchInputValue);

  // fetch(openWeatherEndpoint)
  fetch(cititesEndPoint)
    // .then(res => console.log('res', res))
    .then((res) => res.json())
    // .then(data => cities.push(data))
    // .then((data) => cities.push(...data));
    .then((data) =>
      // console.log(data)
      console.log(findMatches(searchInputValue, data))
      // findMatches(searchInputValue, data)
    );

  // const matchArray = findMatches(searchInputValue, cities);
  // console.log(matchArray);
}
