import {
  showElement,
  hideElement,
  getElement,
  debounce
} from "./utils.ts";
import { fetchAndUpdateWeatherData } from "./fetchWeather.ts";

// APIs
const cititesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
// const statesEndPoint = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";

// Queries
const locationSearchPanel = getElement(".location-search");
const showLocationSearchBtn = getElement(".main-nav__location-btn");
const hideLocationSearchBtn = getElement(".location-search__top-close-btn");
const searchInput = getElement("#location-input");
const displayedList = getElement(".location-search__bottom-results-list");

showElement(showLocationSearchBtn, locationSearchPanel);
hideElement(hideLocationSearchBtn, locationSearchPanel);

const debouncedDisplayMatches = debounce(displayMatches, 500);
searchInput.addEventListener('input', debouncedDisplayMatches);

let cities = [];

async function fetchCitiesData() {
  try {
    const response = await fetch(cititesEndPoint);
    const data = await response.json();
    cities = data;
  } catch (error) {
    console.error('error');
  }
};
fetchCitiesData();

function findMatches(wordToMatch, cities) {
  const trimmedWord = wordToMatch.trim();
  if (!trimmedWord) return [];
  const regex = new RegExp(trimmedWord, "i");

  return cities.filter((city) => {
    return city.name.match(regex) || city.state_name.match(regex);
  });
}

const clearInnerHTML = (e) => e.innerHTML = '';
const clearInputValue = (e) => e.value = '';

function displayMatches() {
  const searchInputValue = searchInput.value;
  const citiesMatch = findMatches(searchInputValue, cities);
  clearInnerHTML(displayedList);

  if (citiesMatch.length) {
    let currentBatchIndex = 0;
    const matchesBatch = 20;
    const initialCityMatches = citiesMatch.slice(0, matchesBatch);

    function renderBatch(cities) {
      const fragment = document.createDocumentFragment();
      cities.forEach(city => {
        const li = document.createElement("li");
        li.className = 'location-search__bottom-results-item';
        li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
        li.setAttribute("data-lat", city.latitude);
        li.setAttribute("data-long", city.longitude);
        fragment.appendChild(li);
      });

      displayedList.appendChild(fragment);
    };

    renderBatch(initialCityMatches);
    currentBatchIndex += matchesBatch;

    const observer = new IntersectionObserver ((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const city = entry.target;
          // console.log(`Observed city: ${city.textContent}`);
          observer.unobserve(city);

          const nextBatch = citiesMatch.slice(currentBatchIndex, currentBatchIndex + matchesBatch);
          renderBatch(nextBatch); // Render the next batch of cities
          currentBatchIndex += matchesBatch; // Update the currentBatchIndex

          const lastCity = displayedList.lastChild;
          // console.log('lastCity', lastCity);

          if (lastCity) {
            observer.observe(lastCity);
          };
        }
      });
    });

    const items = document.querySelectorAll('.location-search__bottom-results-item');
    items.forEach(element => {
      observer.observe(element);
    });
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
}
