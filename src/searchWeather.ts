import { findMatches } from "./utils";
import { API_CONFIG, UI_CONFIG } from "./config";
import { debounce } from "./utils/debounce";
import { CountryApiResponse, FlattenedCity } from "./types/location.types";
import { fetchAndUpdateWeatherData } from "./fetchWeather";
import { 
  getElement, 
  clearInnerHTML, 
  clearInputValue,
  showElement,
  hideElement 
} from "./ui/dom";

// DOM Elements
const locationSearchElements = {
  panel: getElement(".location-search"),
  buttons: {
    show: getElement<HTMLButtonElement>(".main-nav__location-btn"),
    hide: getElement<HTMLButtonElement>(".location-search__top-close-btn"),
  },
  input: getElement<HTMLInputElement>("#location-input"),
  resultsList: getElement<HTMLUListElement>(".location-search__bottom-results-list"),
};

showElement(locationSearchElements.buttons.show, locationSearchElements.panel);
hideElement(locationSearchElements.buttons.hide, locationSearchElements.panel);

// Fetch Cities Data
async function fetchCitiesData(): Promise<FlattenedCity[]> {
  try {
    const response = await fetch(API_CONFIG.citiesEndpoint);
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
    debounce(() => displayMatches(cities), UI_CONFIG.searchDebounceMs)
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
      currentBatchIndex + UI_CONFIG.cityBatchSize
    );

    if (nextBatch.length === 0) return;
    renderBatch(nextBatch);
    currentBatchIndex += UI_CONFIG.cityBatchSize; 

    const lastCity = locationSearchElements.resultsList.lastChild;
    if (lastCity) observer.observe(lastCity as Element);
  }

  const initialCityMatches: FlattenedCity[] = citiesMatch.slice(0, UI_CONFIG.cityBatchSize);
  renderBatch(initialCityMatches);
  currentBatchIndex += UI_CONFIG.cityBatchSize;

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

locationSearchElements.resultsList.addEventListener('click', (e: MouseEvent) => {
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
