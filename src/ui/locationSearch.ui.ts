import { getElement } from './dom';
import { WeatherData } from '../types/weather.types';
import { FlattenedCity } from '../types/location.types';
import { debounce } from '../utils/debounce';
import { CitySearchService } from '../services/CitySearchService';
import { UI_CONFIG } from '../config';

// --- DOM Element Cache ---
const elements = {
  panel: getElement('.location-search'),
  openBtn: getElement<HTMLButtonElement>('.main-nav__location-btn'),
  closeBtn: getElement<HTMLButtonElement>('.location-search__top-close-btn'),
  input: getElement<HTMLInputElement>('#location-input'),
  resultsList: getElement<HTMLUListElement>('.location-search__bottom-results-list'),

  // Current weather preview inside the search panel
  previewCity: getElement<HTMLParagraphElement>('.location-search__top-current-location'),
  previewTemp: getElement<HTMLSpanElement>('.location-search__top-current-temperature'),
};

// --- Panel Visibility ---
function openPanel(): void {
  elements.panel.classList.add('location-search--visible');
}

function closePanel(): void {
  elements.panel.classList.remove('location-search--visible');
}

// --- Search Panel Weather Preview ---
export function updateCurrentWeather(data: WeatherData): void {
  elements.previewCity.textContent = data.cityName;
  elements.previewTemp.textContent = `${data.temperature}°`;
}

// --- Search Results Rendering ---
function createCityElement(city: FlattenedCity): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'location-search__bottom-results-item';
  li.textContent = `${city.name}, ${city.state_name} ${city.country_code}`;
  li.dataset.lat = city.latitude;
  li.dataset.long = city.longitude;

  return li;
}

function renderBatch(batch: FlattenedCity[]): void {
  const fragment = document.createDocumentFragment();

  batch.forEach((city) => {
    fragment.appendChild(createCityElement(city));
  });

  elements.resultsList.appendChild(fragment);
}

export function displayMatches(matches: FlattenedCity[]): void {
  elements.resultsList.innerHTML = '';
  
  if (matches.length === 0) return;

  let currentBatchIndex = 0;

  const loadNextBatch = (): void => {
    const nextBatch = matches.slice(
      currentBatchIndex,
      currentBatchIndex + UI_CONFIG.cityBatchSize
    );
    if (nextBatch.length === 0) return;

    renderBatch(nextBatch);
    currentBatchIndex += UI_CONFIG.cityBatchSize;

    const lastChild = elements.resultsList.lastElementChild;
    if (lastChild) observer.observe(lastChild);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        loadNextBatch();
      }
    });
  });

  // Render the first batch immediately
  const initialBatch = matches.slice(0, UI_CONFIG.cityBatchSize);
  renderBatch(initialBatch);
  currentBatchIndex += UI_CONFIG.cityBatchSize;

  // Start observing the last rendered item for infinite scroll
  const lastChild = elements.resultsList.lastElementChild;
  if (lastChild) observer.observe(lastChild);
}

// --- Initialization ---
export async function init(
  citySearchService: CitySearchService,
  onCitySelect: (lat: number, lon: number) => void
): Promise<void> {

  // Panel toggle
  elements.openBtn.addEventListener('click', openPanel);
  elements.closeBtn.addEventListener('click', closePanel);

  // Load city data before enabling search
  await citySearchService.loadCities();

  // Debounced search — filters cities as user types
  elements.input.addEventListener(
    'input',
    debounce(() => {
      const query = elements.input.value.trim();
      const matches = citySearchService.search(query);
      displayMatches(matches);
    }, UI_CONFIG.searchDebounceMs)
  );

  // City selection — delegated click handler on the results list
  elements.resultsList.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest(
      '.location-search__bottom-results-item'
    ) as HTMLElement | null;
    if (!target) return;

    const lat = parseFloat(target.dataset.lat ?? '');
    const lon = parseFloat(target.dataset.long ?? '');
    if (isNaN(lat) || isNaN(lon)) return;

    // Reset panel state and notify caller
    closePanel();
    elements.resultsList.innerHTML = '';
    elements.input.value = '';
    onCitySelect(lat, lon);
  });
}