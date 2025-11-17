/**
 * Real Weather Service
 * Integrates with OpenMeteo API (free, no API key required) and OpenWeather API
 */

import type { MockWeatherData } from "./mock-weather-service";

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
  };
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
  admin1?: string;
}

/**
 * Fetch real weather data from OpenMeteo API
 * OpenMeteo is FREE and requires NO API key!
 */
export async function fetchOpenMeteoWeather(
  latitude: number,
  longitude: number,
  timezone: string = "auto"
): Promise<MockWeatherData> {
  const currentParams = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "pressure_msl",
    "surface_pressure",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ].join(",");

  const dailyParams = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "sunrise",
    "sunset",
    "precipitation_sum",
    "rain_sum",
    "showers_sum",
    "snowfall_sum",
    "precipitation_hours",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
    "uv_index_max",
  ].join(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&daily=${dailyParams}&timezone=${timezone}&forecast_days=7`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WeatherDesk/1.0",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`OpenMeteo API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenMeteoResponse = await response.json();

    // Transform to our MockWeatherData format for compatibility
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      current: {
        time: data.current.time,
        temperature_2m: data.current.temperature_2m,
        relative_humidity_2m: data.current.relative_humidity_2m,
        apparent_temperature: data.current.apparent_temperature,
        is_day: data.current.is_day,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        showers: data.current.showers,
        snowfall: data.current.snowfall,
        weather_code: data.current.weather_code,
        cloud_cover: data.current.cloud_cover,
        pressure_msl: data.current.pressure_msl,
        surface_pressure: data.current.surface_pressure,
        wind_speed_10m: data.current.wind_speed_10m,
        wind_direction_10m: data.current.wind_direction_10m,
        wind_gusts_10m: data.current.wind_gusts_10m,
      },
      daily: {
        time: data.daily.time,
        weather_code: data.daily.weather_code,
        temperature_2m_max: data.daily.temperature_2m_max,
        temperature_2m_min: data.daily.temperature_2m_min,
        apparent_temperature_max: data.daily.apparent_temperature_max,
        apparent_temperature_min: data.daily.apparent_temperature_min,
        sunrise: data.daily.sunrise,
        sunset: data.daily.sunset,
        precipitation_sum: data.daily.precipitation_sum,
        rain_sum: data.daily.rain_sum,
        showers_sum: data.daily.showers_sum,
        snowfall_sum: data.daily.snowfall_sum,
        precipitation_hours: data.daily.precipitation_hours,
        precipitation_probability_max: data.daily.precipitation_probability_max,
        wind_speed_10m_max: data.daily.wind_speed_10m_max,
        wind_gusts_10m_max: data.daily.wind_gusts_10m_max,
        wind_direction_10m_dominant: data.daily.wind_direction_10m_dominant,
        uv_index_max: data.daily.uv_index_max,
      },
    };
  } catch (error) {
    console.error("Error fetching from OpenMeteo:", error);
    throw error;
  }
}

/**
 * Geocode a city name to coordinates using OpenMeteo Geocoding API
 * FREE - No API key required!
 */
export async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WeatherDesk/1.0",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      timezone: result.timezone || "UTC",
      admin1: result.admin1,
    };
  } catch (error) {
    console.error("Error geocoding city:", error);
    return null;
  }
}

/**
 * Fetch weather using OpenWeather API (requires API key)
 * This is an alternative to OpenMeteo if you have an OpenWeather API key
 */
export async function fetchOpenWeatherData(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<MockWeatherData> {
  // Current weather
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  // 7-day forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&exclude=minutely,hourly,alerts`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl, { next: { revalidate: 300 } }),
      fetch(forecastUrl, { next: { revalidate: 300 } }),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("OpenWeather API error");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Transform OpenWeather data to our format
    const now = new Date();

    return {
      latitude,
      longitude,
      timezone: forecastData.timezone || "UTC",
      current: {
        time: now.toISOString(),
        temperature_2m: currentData.main.temp,
        relative_humidity_2m: currentData.main.humidity,
        apparent_temperature: currentData.main.feels_like,
        is_day: currentData.sys.sunrise < Date.now() / 1000 && currentData.sys.sunset > Date.now() / 1000 ? 1 : 0,
        precipitation: currentData.rain?.["1h"] || 0,
        rain: currentData.rain?.["1h"] || 0,
        showers: 0,
        snowfall: currentData.snow?.["1h"] || 0,
        weather_code: mapOpenWeatherCodeToWMO(currentData.weather[0].id),
        cloud_cover: currentData.clouds.all,
        pressure_msl: currentData.main.pressure,
        surface_pressure: currentData.main.pressure,
        wind_speed_10m: currentData.wind.speed,
        wind_direction_10m: currentData.wind.deg,
        wind_gusts_10m: currentData.wind.gust || currentData.wind.speed * 1.5,
      },
      daily: {
        time: forecastData.daily.slice(0, 7).map((d: any) => new Date(d.dt * 1000).toISOString().split('T')[0]),
        weather_code: forecastData.daily.slice(0, 7).map((d: any) => mapOpenWeatherCodeToWMO(d.weather[0].id)),
        temperature_2m_max: forecastData.daily.slice(0, 7).map((d: any) => d.temp.max),
        temperature_2m_min: forecastData.daily.slice(0, 7).map((d: any) => d.temp.min),
        apparent_temperature_max: forecastData.daily.slice(0, 7).map((d: any) => d.feels_like.day),
        apparent_temperature_min: forecastData.daily.slice(0, 7).map((d: any) => d.feels_like.night),
        sunrise: forecastData.daily.slice(0, 7).map((d: any) => new Date(d.sunrise * 1000).toISOString()),
        sunset: forecastData.daily.slice(0, 7).map((d: any) => new Date(d.sunset * 1000).toISOString()),
        precipitation_sum: forecastData.daily.slice(0, 7).map((d: any) => d.rain || 0),
        rain_sum: forecastData.daily.slice(0, 7).map((d: any) => d.rain || 0),
        showers_sum: forecastData.daily.slice(0, 7).map(() => 0),
        snowfall_sum: forecastData.daily.slice(0, 7).map((d: any) => d.snow || 0),
        precipitation_hours: forecastData.daily.slice(0, 7).map(() => 0),
        precipitation_probability_max: forecastData.daily.slice(0, 7).map((d: any) => (d.pop || 0) * 100),
        wind_speed_10m_max: forecastData.daily.slice(0, 7).map((d: any) => d.wind_speed),
        wind_gusts_10m_max: forecastData.daily.slice(0, 7).map((d: any) => d.wind_gust || d.wind_speed * 1.5),
        wind_direction_10m_dominant: forecastData.daily.slice(0, 7).map((d: any) => d.wind_deg),
        uv_index_max: forecastData.daily.slice(0, 7).map((d: any) => d.uvi || 0),
      },
    };
  } catch (error) {
    console.error("Error fetching from OpenWeather:", error);
    throw error;
  }
}

/**
 * Map OpenWeather condition codes to WMO weather codes
 */
function mapOpenWeatherCodeToWMO(owCode: number): number {
  // Thunderstorm
  if (owCode >= 200 && owCode < 300) return 95;

  // Drizzle
  if (owCode >= 300 && owCode < 400) {
    if (owCode <= 302) return 51;
    if (owCode <= 311) return 53;
    return 55;
  }

  // Rain
  if (owCode >= 500 && owCode < 600) {
    if (owCode === 500) return 61;
    if (owCode === 501 || owCode === 502) return 63;
    if (owCode >= 503) return 65;
    if (owCode === 511) return 67;
    return 80;
  }

  // Snow
  if (owCode >= 600 && owCode < 700) {
    if (owCode === 600) return 71;
    if (owCode === 601) return 73;
    if (owCode >= 602) return 75;
    if (owCode === 611 || owCode === 612) return 77;
    return 85;
  }

  // Atmosphere (fog, mist, etc.)
  if (owCode >= 700 && owCode < 800) return 45;

  // Clear
  if (owCode === 800) return 0;

  // Clouds
  if (owCode === 801) return 1;
  if (owCode === 802) return 2;
  if (owCode >= 803) return 3;

  return 0; // Default: clear
}
