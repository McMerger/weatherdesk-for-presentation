"use server";

import type { WeatherData, WeatherState } from "@/lib/types";
import { z } from "zod";
import { searchCity, WEATHER_CODES, type MockWeatherData, generateMockWeatherData } from "@/lib/mock-weather-service";
import { fetchOpenMeteoWeather, geocodeCity, fetchOpenWeatherData } from "@/lib/real-weather-service";


/**
 * Transform backend weather data to frontend format
 */
function transformBackendData(backendData: MockWeatherData, cityName: string): WeatherData {
  const now = new Date();

  // Get weather condition description from weather code
  const currentWeatherCode = backendData.current.weather_code;
  const weatherInfo = WEATHER_CODES[currentWeatherCode] || WEATHER_CODES[0];

  const current = {
    city: cityName.split(',')[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    temperature: Math.round(backendData.current.temperature_2m),
    condition: weatherInfo.description,
    humidity: backendData.current.relative_humidity_2m,
    windSpeed: Math.round(backendData.current.wind_speed_10m),
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };

  // Transform daily forecast (use first 5 days)
  const forecast = backendData.daily.time.slice(0, 5).map((dateStr, i) => {
    const date = new Date(dateStr);
    const dayWeatherCode = backendData.daily.weather_code[i];
    const dayWeatherInfo = WEATHER_CODES[dayWeatherCode] || WEATHER_CODES[0];

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(backendData.daily.temperature_2m_max[i]),
      low: Math.round(backendData.daily.temperature_2m_min[i]),
      condition: dayWeatherInfo.description,
    };
  });

  return { current, forecast };
}

export async function getWeather(
  prevState: WeatherState,
  formData: FormData
): Promise<WeatherState> {
  const schema = z.object({
    city: z.string().min(1, "City name cannot be empty."),
  });
  const validatedFields = schema.safeParse({
    city: formData.get("city"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.city?.[0] ?? "Invalid city name.",
    };
  }

  const { city } = validatedFields.data;

  try {
    // Check if we should use real weather API or mock data
    const useRealWeather = process.env.USE_REAL_WEATHER === "true";
    const openWeatherKey = process.env.OPENWEATHER_API_KEY;

    let backendData: MockWeatherData;
    let cityName: string;
    let countryName: string;

    if (useRealWeather) {
      // Try OpenMeteo geocoding first (free, no API key)
      console.log(`[REAL API] Fetching weather for "${city}" using OpenMeteo...`);
      const geoData = await geocodeCity(city);

      if (!geoData) {
        return {
          error: `City "${city}" not found. Please check the spelling and try again.`,
        };
      }

      cityName = geoData.name;
      countryName = geoData.country;

      // Fetch weather from OpenMeteo (free) or OpenWeather (requires key)
      if (openWeatherKey) {
        console.log("[REAL API] Using OpenWeather API (with key)");
        backendData = await fetchOpenWeatherData(
          geoData.latitude,
          geoData.longitude,
          openWeatherKey
        );
      } else {
        console.log("[REAL API] Using OpenMeteo API (free, no key required)");
        backendData = await fetchOpenMeteoWeather(
          geoData.latitude,
          geoData.longitude,
          geoData.timezone
        );
      }

      console.log(`[REAL API] Successfully fetched weather for ${cityName}, ${countryName}`);
    } else {
      // Use mock data (default for demo/development)
      console.log(`[MOCK API] Fetching weather for "${city}" using mock service...`);
      const cityData = searchCity(city);

      if (!cityData) {
        return {
          error: `City "${city}" not found. Try cities like London, New York, Tokyo, Paris, Sydney, Toronto, Berlin, Dubai, Singapore, etc.`,
        };
      }

      cityName = cityData.name;
      countryName = cityData.country;
      backendData = generateMockWeatherData(
        cityData.latitude,
        cityData.longitude,
        cityData.timezone || "UTC"
      );

      console.log(`[MOCK API] Successfully generated mock weather for ${cityName}, ${countryName}`);
    }

    // Transform backend data to match frontend format
    const weatherData = transformBackendData(backendData, cityName);

    return {
      weatherData: weatherData,
      message: `Successfully fetched weather for ${weatherData.current.city}, ${countryName}. ${useRealWeather ? "(Real data)" : "(Demo data)"}`,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return {
      error: "Failed to fetch weather data. Please try again or check your internet connection.",
    };
  }
}

/**
 * Submit a forecast rating
 * @param rating - Star rating (1-5)
 * @param city - City name for the rated forecast
 * @returns Promise with success/error message
 */
export async function rateForecast(
  rating: number,
  city: string
): Promise<{ message?: string; error?: string }> {
  // Validate rating range
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return {
      error: "Rating must be an integer between 1 and 5 stars."
    };
  }

  // Validate city name
  if (!city || city.trim() === '') {
    return {
      error: "City name is required for rating submission."
    };
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would save to a database
    console.log(`[RATING] ${city}: ${rating} stars (${new Date().toISOString()})`);

    return {
      message: `Thank you for rating the forecast for ${city}!`
    };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return {
      error: "Failed to submit rating. Please try again."
    };
  }
}