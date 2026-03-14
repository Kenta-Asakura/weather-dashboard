import { FlattenedCity, CountryApiResponse } from '../types/location.types';
import { API_CONFIG } from '../config';

export class CitySearchService {
    private cities: FlattenedCity[] = [];

    // Track whether the data is already loaded
    private isLoaded = false;

    async loadCities(): Promise<void> {
        if (this.isLoaded) return;

        try {
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

            this.isLoaded = true;
        } catch (error) {
            console.error('Failed to load cities data:', error);
            this.cities = [];
        }
    }    

    search(query: string): FlattenedCity[] {
        const trimmed = query.trim();
        if (!trimmed) return [];
        const regex = new RegExp(trimmed, "i");

        return this.cities.filter((city) => 
            regex.test(city.name) || regex.test(city.state_name)
        );
    }
}