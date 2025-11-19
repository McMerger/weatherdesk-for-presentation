// weather data types

export interface CurrentWeather {
  city: string;
  temperatureCelsius: number;
  condition: string;
  conditionDescription: string;
  humidity: number;
  windSpeedMps: number; // in m/s
  date: string;
  latitude?: number;
  longitude?: number;
  isDay: boolean;
}

// forecast for one day
export interface DailyForecast {
  date: string;
  highTempCelsius: number;
  lowTempCelsius: number;
  condition: string;
  conditionDescription: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export interface WeatherState {
  weatherData?: WeatherData;
  error?: string;
  message?: string;
}

// backend response stuff
export interface BackendWeatherResponse {
  longitude: number;
  latitude: number;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    is_day: number;
    wind_speed_10m: number;
  };
}

export interface CityCoordinates {
  lat: number;
  lng: number;
}

// component props
export interface WeatherDashboardProps {
  initialState?: WeatherState;
}

export interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

export interface ForecastCardProps {
  data: DailyForecast;
}

export interface ErrorResponse {
  error: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}

export interface SuccessResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type WeatherCondition =
  | "Clear"
  | "Cloudy"
  | "Overcast"
  | "Mist"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Thunderstorm";

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface RatingData {
  rating: number;
  city: string;
  timestamp: Date;
  feedback?: string;
}

// user settings stuff
export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "mph" | "ms";
export type PressureUnit = "hpa" | "inhg" | "mb";

export interface FavoriteLocation {
  id: string;
  city: string;
  country?: string;
  addedAt: string;
}

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  use24HourTime: boolean;
  showFeelsLike: boolean;
  showRecommendations: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
}

export interface UserSettings {
  favorites: FavoriteLocation[];
  preferences: UserPreferences;
}
