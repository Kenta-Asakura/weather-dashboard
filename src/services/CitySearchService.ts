import { FlattenedCity, CountryApiResponse } from '../types/location.types';
import { API_CONFIG } from '../config';

export class CitySearchService {
    private cities: FlattenedCity[] = [];

    // Track whether the data is already loaded
    private isLoaded = false;

    async loadCities(): Promise<void> {
        console.log(this.isLoaded);
        if (this.isLoaded) return;

        try {
            // console.log('Fetching cities...');

            const response = await fetch(API_CONFIG.citiesEndpoint);
            const countries: CountryApiResponse[] = await response.json();

            this.cities = countries.flatMap((country) =>
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
            
            // console.log('Total cities loaded:', this.cities.length);
            // console.log('Sample city:', this.cities[0]);

            // console.log('setting isLoaded to true');
            this.isLoaded = true;

        } catch (error) {
            console.error('Failed to load cities data:', error);
            this.cities = [];
        }
    }    
}