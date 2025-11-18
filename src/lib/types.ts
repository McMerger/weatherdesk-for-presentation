/**
 * TypeScript type definitions for WeatherDesk
 * Provides type safety for weather data and component props
 */

/**
 * Current weather conditions (matches Kotlin backend)
 */
export interface CurrentWeather {
  city: string;
  temperatureCelsius: number; // in Celsius
  condition: string; // e.g., "Clear", "Cloudy", "Rain"
  conditionDescription: string; // detailed description
  humidity: number; // 0-100 percentage
  windSpeedMps: number; // in meters per second
  date: string; // ISO date string (LocalDate)
  latitude?: number;
  longitude?: number;
  isDay: boolean;
}

/**
 * Weather forecast for a single day (matches Kotlin backend)
 */
export interface ForecastDay {
  date: string; // ISO date string (LocalDate)
  highTempCelsius: number; // high temperature in Celsius
  lowTempCelsius: number; // low temperature in Celsius
  condition: string; // weather condition
  conditionDescription: string; // detailed description
}

/**
 * Complete weather data for a location
 */
export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

/**
 * State for weather form submission
 */
export interface WeatherState {
  weatherData?: WeatherData;
  error?: string;
  message?: string;
}

/**
 * Backend API response from WeatherDesk23
 */
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

/**
 * City coordinates mapping
 */
export interface CityCoordinates {
  lat: number;
  lng: number;
}

/**
 * Weather dashboard component props
 */
export interface WeatherDashboardProps {
  initialState?: WeatherState;
}

/**
 * Current weather card component props
 */
export interface CurrentWeatherCardProps {
  data: CurrentWeather;
}

/**
 * Forecast card component props
 */
export interface ForecastCardProps {
  data: ForecastDay;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * API response type (either success or error)
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Supported weather conditions
 */
export type WeatherCondition =
  | "Clear"
  | "Cloudy"
  | "Cloudy"
  | "Overcast"
  | "Mist"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Thunderstorm";

/**
 * Configuration for API calls
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Rating submission data
 */
export interface RatingData {
  rating: number; // 1-5 stars
  city: string;
  timestamp: Date;
  feedback?: string;
}
