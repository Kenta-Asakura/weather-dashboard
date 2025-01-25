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
const CITIES_END_POINT = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json";
// const STATES_END_POINT = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states.json";


// DOM Elements
const locationSearchElements  = {
  panel: getElement(".location-search"),
  buttons: {
    show: getElement(".main-nav__location-btn"),
    hide: getElement(".location-search__top-close-btn"),
  },
  input: getElement("#location-input"),
  resultsList: getElement(".location-search__bottom-results-list"),
};

showElement(locationSearchElements.buttons.show, locationSearchElements.panel);
hideElement(locationSearchElements.buttons.hide, locationSearchElements.panel);


// Fetch Cities Data
async function fetchCitiesData() {
  try {
    const response = await fetch(CITIES_END_POINT);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities data:', error);
    return [];
  }
}

(async () => {
  const cities = await fetchCitiesData();
  // console.log('cities', cities);

  locationSearchElements.input.addEventListener(
    "input",
    debounce(() => displayMatches(cities), 500)
  );
})();


//
const createCityElement = (city) => {
  const li = document.createElement("li");
  li.className = "location-search__bottom-results-item";
  li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  li.dataset.lat = city.latitude;
  li.dataset.long = city.longitude;
  return li;
};

function displayMatches(cities) {
  // console.log('cities', cities);

  const searchInputValue = locationSearchElements.input.value.trim();
  console.log('searchInputValue', searchInputValue);

  const citiesMatch = findMatches(searchInputValue, cities);
  clearInnerHTML(locationSearchElements.resultsList);

  if (citiesMatch.length === 0) return;
  const MATCHES_BATCH_SIZE = 20;
  let currentBatchIndex = 0;

  const renderBatch = (batch) => {
    const fragment = document.createDocumentFragment();
    batch.forEach(city => {
      // console.log('city', city);
      // console.log('typeof city', typeof city);

      const cityElement = createCityElement(city);
      fragment.appendChild(cityElement);
    });
    locationSearchElements.resultsList.appendChild(fragment);
  };

  const loadNextBatch = () => {
    const nextBatch = citiesMatch.slice(
      currentBatchIndex,
      currentBatchIndex + MATCHES_BATCH_SIZE
    );

    if (nextBatch.length === 0) return;
    renderBatch(nextBatch);
    currentBatchIndex += MATCHES_BATCH_SIZE;

    const lastCity = locationSearchElements.resultsList.lastChild;
    if (lastCity) observer.observe(lastCity);
  };

  const initialCityMatches = citiesMatch.slice(0, MATCHES_BATCH_SIZE);
  renderBatch(initialCityMatches);
  currentBatchIndex += MATCHES_BATCH_SIZE;

  const observer = new IntersectionObserver ((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // console.log(`Observed city: ${entry.target.textContent}`);
        observer.unobserve(entry.target);
        loadNextBatch();
      }
    });
  });

  const lastCity = locationSearchElements.resultsList.lastChild;
  if (lastCity) observer.observe(lastCity);
}

locationSearchElements.resultsList.addEventListener('click', (e) => {
  const location = e.target.closest('.location-search__bottom-results-item');
  if (!location) return;

  locationSearchElements.panel.classList.remove('location-search--visible');
  clearInnerHTML(locationSearchElements.resultsList);
  clearInputValue(locationSearchElements.input);
  fetchAndUpdateWeatherData(location.dataset.lat, location.dataset.long);
});
