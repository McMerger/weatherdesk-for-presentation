# WeatherDesk Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate the new React/Next.js frontend with the existing Kotlin backend.

---

## Repository Structure After Integration

```
WeatherDesk/
├── backend/                 # Kotlin backend (existing)
│   ├── src/
│   │   └── main/
│   │       └── kotlin/
│   ├── build.gradle.kts
│   └── ...
├── frontend/               # React/Next.js frontend (NEW - from weatherdesk-for-presentation)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   ├── package.json
│   └── next.config.js
└── README.md
```

---

## Step 1: Copy Frontend Files

### What to Copy:
```bash
# From weatherdesk-for-presentation to WeatherDesk/frontend/

cp -r src/                WeatherDesk/frontend/src/
cp -r public/             WeatherDesk/frontend/public/
cp package.json           WeatherDesk/frontend/
cp next.config.js         WeatherDesk/frontend/
cp tsconfig.json          WeatherDesk/frontend/
cp tailwind.config.ts     WeatherDesk/frontend/
cp postcss.config.mjs     WeatherDesk/frontend/
cp .eslintrc.json         WeatherDesk/frontend/
```

### Files to EXCLUDE (don't copy):
- `src/app/actions.ts` (mock data - will replace with real API)
- `src/lib/mock-weather-service.ts` (won't need mock anymore)
- `src/app/api/` (Next.js API routes - backend handles this)

---

## Step 2: Kotlin Backend API Endpoints

### Expected Backend Endpoints (adjust based on actual Kotlin API):

```kotlin
// Your Kotlin backend should expose these endpoints:

GET  /api/weather?city={cityName}
     Returns: WeatherResponse (current + forecast)

POST /api/rating
     Body: { rating: number, city: string }
     Returns: { message: string }

// Optional endpoints:
GET  /api/cities/search?q={query}
     Returns: List of matching cities
```

### Expected Response Format (Kotlin → Frontend):

```json
// GET /api/weather?city=London
{
  "current": {
    "city": "London",
    "temperature": 15,        // Celsius
    "condition": "Cloudy",
    "humidity": 65,
    "windSpeed": 20,          // km/h
    "date": "Monday, November 18, 2024"
  },
  "forecast": [
    {
      "day": "Monday",
      "high": 18,
      "low": 12,
      "condition": "Cloudy"
    },
    // ... 4 more days
  ]
}
```

---

## Step 3: Frontend Configuration

### Create `.env.local`:
```bash
# WeatherDesk/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Update `next.config.js`:
```javascript
// Add API proxy to Kotlin backend
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};
```

---

## Step 4: Replace Mock Actions with Real API

### Create `src/lib/api-client.ts`:
```typescript
// API client for Kotlin backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchWeather(city: string) {
  const response = await fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  return response.json();
}

export async function submitRating(rating: number, city: string) {
  const response = await fetch(`${API_URL}/api/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, city }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit rating: ${response.statusText}`);
  }

  return response.json();
}
```

### Update `src/app/actions.ts`:
```typescript
"use server";

import type { WeatherData, WeatherState } from "@/lib/types";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
    // Call Kotlin backend
    const response = await fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `City "${city}" not found.`,
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
      error: "Failed to fetch weather data. Please ensure the backend server is running.",
    };
  }
}

export async function rateForecast(rating: number, city: string) {
  try {
    const response = await fetch(`${API_URL}/api/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, city }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }

    const result = await response.json();
    return { message: result.message || `Thank you for rating the forecast for ${city}!` };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return { message: 'Failed to submit rating. Please try again.' };
  }
}
```

---

## Step 5: Kotlin Backend Adjustments

### Ensure CORS is enabled:
```kotlin
// In your Kotlin backend (Spring Boot example)
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000") // Next.js dev server
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
    }
}
```

### Weather Controller Example:
```kotlin
@RestController
@RequestMapping("/api")
class WeatherController(private val weatherService: WeatherService) {

    @GetMapping("/weather")
    fun getWeather(@RequestParam city: String): WeatherResponse {
        return weatherService.getWeatherForCity(city)
    }

    @PostMapping("/rating")
    fun submitRating(@RequestBody request: RatingRequest): RatingResponse {
        // Save rating to database
        return RatingResponse(message = "Thank you for rating the forecast for ${request.city}!")
    }
}

data class WeatherResponse(
    val current: CurrentWeather,
    val forecast: List<ForecastDay>
)

data class CurrentWeather(
    val city: String,
    val temperature: Int,      // Celsius
    val condition: String,
    val humidity: Int,
    val windSpeed: Int,        // km/h
    val date: String
)

data class ForecastDay(
    val day: String,
    val high: Int,
    val low: Int,
    val condition: String
)

data class RatingRequest(
    val rating: Int,
    val city: String
)

data class RatingResponse(
    val message: String
)
```

---

## Step 6: Running Both Servers

### Terminal 1 - Kotlin Backend:
```bash
cd WeatherDesk/backend
./gradlew bootRun
# Should start on http://localhost:8080
```

### Terminal 2 - Next.js Frontend:
```bash
cd WeatherDesk/frontend
npm install
npm run dev
# Should start on http://localhost:3000
```

---

## Step 7: Testing Integration

1. **Start both servers**
2. **Open browser**: `http://localhost:3000`
3. **Search for a city**: Should call Kotlin backend
4. **Check browser console**: Should see API calls to `localhost:8080`
5. **Test all features**:
   - ✅ Search city → loads weather
   - ✅ Favorites → save/load from localStorage
   - ✅ Settings → unit conversions work
   - ✅ Theme toggle → switches light/dark
   - ✅ Rating → submits to backend

---

## Step 8: Files to Delete (from frontend)

```bash
# Remove mock data files (no longer needed):
rm src/lib/mock-weather-service.ts
rm src/app/api/weather/route.ts  # If exists
```

---

## Troubleshooting

### Issue: CORS errors
**Solution**: Ensure Kotlin backend has CORS configured for `http://localhost:3000`

### Issue: 404 on API calls
**Solution**: Check that Kotlin backend is running on port 8080

### Issue: Data format mismatch
**Solution**: Ensure Kotlin response matches TypeScript types in `src/lib/types.ts`

### Issue: Environment variables not loading
**Solution**: Restart Next.js dev server after creating `.env.local`

---

## Production Deployment

### Option 1: Same Domain
```
domain.com/          → Next.js frontend (static)
domain.com/api/*     → Kotlin backend (proxy)
```

### Option 2: Separate Domains
```
app.domain.com       → Next.js frontend
api.domain.com       → Kotlin backend
```

Update CORS and `NEXT_PUBLIC_API_URL` accordingly.

---

## Summary of Changes

| File | Action |
|------|--------|
| Frontend → Backend repo | Copy all frontend files to `frontend/` folder |
| `src/app/actions.ts` | Replace mock data with real API calls |
| `src/lib/api-client.ts` | Create API client for backend |
| `.env.local` | Add backend URL |
| `next.config.js` | Add API proxy |
| Kotlin backend | Add CORS, ensure endpoints match |

All your new components (FeelsLike, Settings, Favorites, Theme Toggle) will work without changes - they only use frontend state and localStorage!
