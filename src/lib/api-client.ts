// api client for talking to the kotlin backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// get weather for a city
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

// send rating to backend
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

// search cities - not really using this yet
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
    // just return empty if it fails, no big deal
    return [];
  }
}
