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
}