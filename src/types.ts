export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
  };
}

export interface NewsData {
  posts: Array<{
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: number;
  }>;
}

export interface ApiConfig {
  weather: {
    baseUrl: string;
    apiKey: string;
  };
  news: {
    baseUrl: string;
    apiKey: string;
  };
}