// API response Types
export interface CountryApiResponse {
  id: number;
  name: string;
  iso2: string;            
  latitude: string;
  longitude: string;
  states: StateApiResponse[];         
}

export interface StateApiResponse {
  id: number;
  name: string;
  state_code: string;
  country_id: number;
  latitude: string;
  longitude: string;
  cities: CityApiResponse[];
}

export interface CityApiResponse {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

// Transformed data Type
export interface FlattenedCity {
  name: string;
  iso?: string;
  latitude: string;
  longitude: string;
  state_name: string;
  country_code: string;
}