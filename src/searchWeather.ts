import {
  getElement,
  clearInnerHTML,
  clearInputValue,
  showElement,
  hideElement,
  debounce,
  findMatches
} from "./utils";
import { CountryApiResponse, StateApiResponse, CityApiResponse, FlattenedCity } from "./types/location.types";
import { fetchAndUpdateWeatherData } from "./fetchWeather";

// API Endpoint
const COUNTRIES_STATES_CITIES_END_POINT: string = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json"

// DOM Elements
const locationSearchElements = {
  panel: getElement(".location-search"),
  buttons: {
    show: getElement(".main-nav__location-btn"),
    hide: getElement(".location-search__top-close-btn"),
  },
  input: getElement<HTMLInputElement>("#location-input"),
  resultsList: getElement(".location-search__bottom-results-list"),
};

showElement(locationSearchElements.buttons.show, locationSearchElements.panel);
hideElement(locationSearchElements.buttons.hide, locationSearchElements.panel);

// Fetch Cities Data
async function fetchCitiesData(): Promise<FlattenedCity[]> {
  try {
    const response = await fetch(COUNTRIES_STATES_CITIES_END_POINT);
    const countries: CountryApiResponse[] = await response.json();
    return countries.flatMap((country) =>  // gets array of state objects
      country.states.flatMap((state) =>     // gets array of cities objects
        state.cities.map((city) => ({         // gets array of cities
          name: city.name,
          state_name: state.name,
          country_code: country.iso2,
          latitude: city.latitude,
          longitude: city.longitude,
        }))
      )
    );
  } catch (error) {
    console.error('Error fetching cities data:', error);
    return [];
  }
}

(async () => {
  const cities = await fetchCitiesData();

  locationSearchElements.input.addEventListener(
    "input",
    debounce(() => displayMatches(cities), 500)
  );
})();

// * update this to display proper date
const createCityElement = (city: FlattenedCity): HTMLElement => {
  console.log(city);

  const li = document.createElement("li");
  li.className = "location-search__bottom-results-item";
  li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  li.dataset.lat = city.latitude;
  li.dataset.long = city.longitude;

  return li;
};

  function displayMatches(cities: FlattenedCity[]): void {
  const searchInputValue: string = locationSearchElements.input.value.trim();
  const citiesMatch: FlattenedCity[] = findMatches(searchInputValue, cities);

  clearInnerHTML(locationSearchElements.resultsList);

  if (citiesMatch.length === 0) return;
  const MATCHES_BATCH_SIZE = 20;
  let currentBatchIndex = 0;

  const renderBatch = (batch: FlattenedCity[]): void => {
    const fragment = document.createDocumentFragment();

    // * update 
    batch.forEach((city: FlattenedCity) => {
      const cityElement = createCityElement(city);
      fragment.appendChild(cityElement);
    });
    locationSearchElements.resultsList.appendChild(fragment);
  };

  const loadNextBatch = (): void => {
    const nextBatch: FlattenedCity[] = citiesMatch.slice(
      currentBatchIndex,
      currentBatchIndex + MATCHES_BATCH_SIZE
    );

    if (nextBatch.length === 0) return;
    renderBatch(nextBatch);
    currentBatchIndex += MATCHES_BATCH_SIZE; 

    const lastCity = locationSearchElements.resultsList.lastChild;
    if (lastCity) observer.observe(lastCity as Element);
  }

  const initialCityMatches: FlattenedCity[] = citiesMatch.slice(0, MATCHES_BATCH_SIZE);
  renderBatch(initialCityMatches);
  currentBatchIndex += MATCHES_BATCH_SIZE;

  const observer = new IntersectionObserver ((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        loadNextBatch();
      }
    });
  });

  const lastCity = locationSearchElements.resultsList.lastChild;
  if (lastCity) observer.observe(lastCity as Element);
}

locationSearchElements.resultsList.addEventListener(
  'click',
  (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const location = target?.closest('.location-search__bottom-results-item') as HTMLElement;
    if (!(location instanceof HTMLElement)) return;

    locationSearchElements.panel.classList.remove('location-search--visible');
    clearInnerHTML(locationSearchElements.resultsList);
    clearInputValue(locationSearchElements.input);

    const lat = location.dataset.lat ? parseFloat(location.dataset.lat) : NaN;
    const long = location.dataset.long ? parseFloat(location.dataset.long) : NaN;
    fetchAndUpdateWeatherData(lat, long);
  }
);
