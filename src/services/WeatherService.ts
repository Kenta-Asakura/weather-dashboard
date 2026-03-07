import { WeatherApiResponse, WeatherData, mapWeatherResponse } from "../types/weather.types";
import { API_CONFIG } from "../config";

export class WeatherService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = API_CONFIG.weatherApiKey;
        this.baseUrl = API_CONFIG.weatherBaseUrl;

        if (!this.apiKey) {
            throw new Error("Missing OPENWEATHER_API_KEY in .env file");
        }
    }

    // Method to fetch weather by coordinates
    async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
        const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const raw: WeatherApiResponse = await response.json();
        return mapWeatherResponse(raw);
    }
}