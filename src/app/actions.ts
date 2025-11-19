// server actions for weather and auth
"use server";

import type { WeatherData, WeatherState } from "@/lib/types";
import { z } from "zod";

// backend url - defaults to localhost for dev
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

// main weather fetch function
export async function getWeather(
  prevState: WeatherState,
  formData: FormData
): Promise<WeatherState> {
  // basic validation - just make sure city isnt empty
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
    // hit the kotlin backend
    const response = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      return {
        error: errorData.error || `Failed to fetch weather data: ${response.statusText}`,
      };
    }

    const weatherData: WeatherData = await response.json();

    return {
      weatherData,
      message: `Successfully fetched weather for ${weatherData.current.city}.`,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return {
      error: "Failed to connect to backend. Please ensure the Kotlin backend is running on port 8080.",
    };
  }
}

// rating submission - not really using this data yet but whatever
export async function rateForecast(rating: number, city: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/weather/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city,
        rating,
        date: new Date().toISOString().split('T')[0], // just get the date part
      }),
    });

    if (!response.ok) {
      console.error("Failed to submit rating:", response.statusText);
    }

    // always return success message even if it failed - user doesnt need to know lol
    return { message: `Thank you for rating the forecast for ${city}!` };
  } catch (error) {
    console.error("Error submitting rating:", error);
    return { message: `Thank you for rating the forecast for ${city}!` };
  }
}
