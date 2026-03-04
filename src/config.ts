// Centralized configuration.
// All magic strings and constants live here.
export const API_CONFIG = {
  weatherApiKey: process.env.OPENWEATHER_API_KEY ?? '',
  weatherBaseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  citiesEndpoint: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json',
} as const;

export const UI_CONFIG = {
  searchDebounceMs: 500,
  cityBatchSize: 20,
} as const;