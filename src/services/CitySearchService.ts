import { FlattenedCity, CountryApiResponse } from '../types/location.types';
import { API_CONFIG } from '../config';

export class CitySearchService {
    private cities: FlattenedCity[] = [];

    // Track whether the data is already loaded
    private isLoaded = false;
}