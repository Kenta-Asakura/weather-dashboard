import {
  getElement,
  clearInnerHTML,
  clearInputValue,
  showElement,
  hideElement,
  debounce,
  findMatches
} from "./utils.ts";
import { fetchAndUpdateWeatherData } from "./fetchWeather.ts";


// API Endpoint
const citiesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
// const statesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";


// DOM Elements
const locationSearchPanel = getElement(".location-search");
const showLocationSearchBtn = getElement(".main-nav__location-btn");
const hideLocationSearchBtn = getElement(".location-search__top-close-btn");
const searchInput = getElement("#location-input");
const displayedList = getElement(".location-search__bottom-results-list");

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);

searchInput.addEventListener('input', debounce(displayMatches, 500));

let cities = [];

async function fetchCitiesData() {
  try {
    const response = await fetch(citiesEndPoint);
    const data = await response.json();
    cities = data;
  } catch (error) {
    console.error('Error fetching cities data:', error);
  }
};
fetchCitiesData();

const createCityElement = (city) => {
  const li = document.createElement("li");
  li.className = "location-search__bottom-results-item";
  li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  li.dataset.lat = city.latitude;
  li.dataset.long = city.longitude;
  return li;
};

function displayMatches() {
  const searchInputValue = searchInput.value.trim();
  const citiesMatch = findMatches(searchInputValue, cities);
  clearInnerHTML(displayedList);

  if (citiesMatch.length === 0) return;
  const matchesBatch = 20;
  let currentBatchIndex = 0;

  const renderBatch = (batch) => {
    const fragment = document.createDocumentFragment();
    batch.forEach(city => {
      const cityElement = createCityElement(city);
      fragment.appendChild(cityElement);
    });
    displayedList.appendChild(fragment);
  };

  const loadNextBatch = () => {
    const nextBatch = citiesMatch.slice(
      currentBatchIndex,
      currentBatchIndex + matchesBatch
    );

    if (nextBatch.length === 0) return;
    renderBatch(nextBatch);
    currentBatchIndex += matchesBatch;

    const lastCity = displayedList.lastChild;
    if (lastCity) observer.observe(lastCity);
  }

  const initialCityMatches = citiesMatch.slice(0, matchesBatch);
  renderBatch(initialCityMatches);
  currentBatchIndex += matchesBatch;

  const observer = new IntersectionObserver ((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`Observed city: ${entry.target.textContent}`);
        observer.unobserve(entry.target);
        loadNextBatch();
      }
    });
  });

  const lastCity = displayedList.lastChild;
  if (lastCity) observer.observe(lastCity);
}

displayedList.addEventListener('click', (e) => {
  const location = e.target.closest('.location-search__bottom-results-item');

  if (location) {
    locationSearchPanel.classList.remove('location-search--visible');
    clearInnerHTML(displayedList);
    clearInputValue(searchInput);
    fetchAndUpdateWeatherData(location.dataset.lat, location.dataset.long);
  };
});
