// API Response Types (what OpenWeather sends)
export interface WeatherApiResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// App Types (what UI uses)
// export interface WeatherData {
//   location: {
//     city: string;
//     country: string;
//   };
//   current: {
//     temperature: number;
//     feelsLike: number;
//     condition: string;
//     iconCode: string;
//   };
//   range: {
//     high: number;
//     low: number;
//   };
//   details: {
//     humidity: number;
//     windSpeed: number;
//   };
// }

export interface WeatherData {
  cityName: string;
  country: string;
  temperature: number;
  tempMax: number;
  tempMin: number;
  condition: string;
  iconCode: string;
}

// Mapper Function
// - Transforms API response into clean app data.
export function mapWeatherResponse(raw: WeatherApiResponse): WeatherData {
  return {
    cityName: raw.name,
    country: raw.sys.country,
    temperature: Math.round(raw.main.temp),
    tempMax: Math.round(raw.main.temp_max),
    tempMin: Math.round(raw.main.temp_min),
    condition: raw.weather[0].main,
    iconCode: raw.weather[0].icon,
  };
}