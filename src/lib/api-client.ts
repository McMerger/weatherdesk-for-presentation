/**
 * API Client for Kotlin Backend
 * Handles all HTTP requests to the weather backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Fetch weather data for a city from Kotlin backend
 */
export async function fetchWeather(city: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/weather?city=${encodeURIComponent(city)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // cache: 'no-store', // uncomment if you want fresh data every time
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error (fetchWeather):', error);
    throw error;
  }
}

/**
 * Submit weather rating to Kotlin backend
 */
export async function submitRating(rating: number, city: string) {
  try {
    const response = await fetch(`${API_URL}/api/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, city }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error (submitRating):', error);
    throw error;
  }
}

/**
 * Search for cities (optional - if backend supports)
 */
export async function searchCities(query: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/cities/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error (searchCities):', error);
    // return empty array if search fails - not critical
    return [];
  }
}
