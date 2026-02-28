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

export interface WeatherData {
  location: {
    city: string;
    country: string;
  };
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    iconCode: string;
  };
  range: {
    high: number;
    low: number;
  };
  details: {
    humidity: number;
    windSpeed: number;
  };
}