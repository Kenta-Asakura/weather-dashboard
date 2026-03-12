import { FlattenedCity, CountryApiResponse } from '../types/location.types';
import { API_CONFIG } from '../config';

export class CitySearchService {
    private cities: FlattenedCity[] = [];

    // Track whether the data is already loaded
    private isLoaded = false;

    async loadCities(): Promise<void> {
        if (this.isLoaded) return;
        this.isLoaded = true; // ! delete later

        try {
            console.log('Fetching cities...');

            const response = await fetch(API_CONFIG.citiesEndpoint);
            console.log(response);

            response.json
            // TODO: parse JSON
        } catch (error) {
            console.error('Failed to load cities data:', error);
            this.cities = [];
        }
    }    
}