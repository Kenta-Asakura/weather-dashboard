import {
  getElement,
  clearInnerHTML,
  clearInputValue,
  showElement,
  hideElement,
  debounce,
  // City,
  findMatches
} from "./utils";
import { fetchAndUpdateWeatherData } from "./fetchWeather";

// const apiKey = process.env.COUNTRY_STATE_CITY_API_KEY;

// API Endpoint
// const STATES_CITIES_END_POINT: string = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/states%2Bcities.json";
// !TEST
const STATES_CITIES_END_POINT: string = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json"
// const COUNTRIES_STATES_CITIES_END_POINT: string = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json"

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

// Types for the nested API response
// interface StateWithCities {
//   id: number;
//   name: string;
//   state_code: string;
//   latitude: string;
//   longitude: string;
//   country_id: number;
//   cities: {
//     id: number;
//     name: string;
//     latitude: string;
//     longitude: string;
//   }[];
// } 

// ! Test - countries, states, cities
interface CountriesStatesCities {
  id: number;
  name: string;
  iso2: string;
  state_code: string;
  latitude: string;
  longitude: string;
  country_id: number;
  states: {
    name: string,
    cities: {
      id: number;
      name: string;
      latitude: string;
      longitude: string;
    }[];
  }[];
  cities: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
  }[];
}

// ! Test - countries, states, cities
interface City {
  name: string;
  state_name: string;
  country_code: string;
  iso?: string;
  latitude: string;
  longitude: string;
}

// Fetch Cities Data
// async function fetchCitiesData() {
//   try {
//     const response = await fetch(CITIES_END_POINT);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching cities data:', error);
//     return [];
//   }
// }

async function fetchCitiesData(): Promise<City[]> {
  try {
    const response = await fetch(STATES_CITIES_END_POINT);
    // const states: StateWithCities[] = await response.json();

    // ! Test - countries, states, cities
    const countries: CountriesStatesCities[] = await response.json();

    // ! TEST
    console.log('countries', countries);

    // * update this to 
    // return states.map((state) => ({
    //   name: state.name,
    //   state_name: state.name,
    //   country_code: state.state_code,
    //   latitude: state.latitude,
    //   longitude: state.longitude,
    //   cities: state.cities
    // }))
    
    // ! Test - countries, states, cities
    return countries.flatMap((country) =>
      country.states.flatMap((state) =>
        state.cities.map((city) => ({
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
const createCityElement = (city: City): HTMLElement => {
  console.log(city);

  const li = document.createElement("li");
  // li.className = "location-search__bottom-results-item";
  // li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  // li.dataset.lat = city.latitude;
  // li.dataset.long = city.longitude;

  // ! Test - countries, states, cities
  li.className = "location-search__bottom-results-item";
  li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  li.dataset.lat = city.latitude;
  li.dataset.long = city.longitude;

  return li;
  
};

  function displayMatches(cities: City[]): void {
  const searchInputValue: string = locationSearchElements.input.value.trim();
  const citiesMatch: City[] = findMatches(searchInputValue, cities);

  // ! TEST
  console.log('citiesMatch', citiesMatch);

  clearInnerHTML(locationSearchElements.resultsList);

  if (citiesMatch.length === 0) return;
  const MATCHES_BATCH_SIZE = 20;
  let currentBatchIndex = 0;

  const renderBatch = (batch: City[]): void => {
    const fragment = document.createDocumentFragment();

    // * update 
    batch.forEach((city: City) => {
      const cityElement = createCityElement(city);
      fragment.appendChild(cityElement);
    });
    locationSearchElements.resultsList.appendChild(fragment);
  };

  const loadNextBatch = (): void => {
    const nextBatch: City[] = citiesMatch.slice(
      currentBatchIndex,
      currentBatchIndex + MATCHES_BATCH_SIZE
    );

    if (nextBatch.length === 0) return;
    renderBatch(nextBatch);
    currentBatchIndex += MATCHES_BATCH_SIZE; 

    const lastCity = locationSearchElements.resultsList.lastChild;
    if (lastCity) observer.observe(lastCity as Element);
  }

  const initialCityMatches: City[] = citiesMatch.slice(0, MATCHES_BATCH_SIZE);
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
