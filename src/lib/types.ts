/**
 * TypeScript type definitions for WeatherDesk
 * Provides type safety for weather data and component props
 */

/**
 * Current weather conditions
 */
export interface CurrentWeather {
  city: string;
  temperature: number; // in Celsius
  condition: string; // e.g., "Clear", "Cloudy", "Rain"
  humidity: number; // 0-100 percentage
  windSpeed: number; // in km/h
  date: string; // formatted date string
}

/**
 * Weather forecast for a single day
 */
export interface ForecastDay {
  day: string; // day name, e.g., "Monday"
  high: number; // high temperature in Celsius
  low: number; // low temperature in Celsius
  condition: string; // weather condition
}

/**
 * Type alias for component compatibility
 * ForecastCard component uses DailyForecast naming
 */
export type DailyForecast = ForecastDay;

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
 * Rating submission data for future database integration
 */
export interface RatingData {
  rating: number; // 1-5 stars
  city: string;
  timestamp: Date;
  feedback?: string;
}
