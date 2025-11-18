# WeatherDesk API Verification Guide

This document explains how the WeatherDesk application fetches **real, live weather data** and how to verify the APIs are working correctly.

## ✅ API Configuration Summary

### Backend APIs (Kotlin/Ktor)

The application uses **OpenMeteo API** - a completely **FREE, open-source weather API** that requires **NO API KEYS**.

#### 1. Weather Data API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Purpose**: Fetch real-time weather conditions and 7-day forecast
- **Location**: `src/main/kotlin/service/WeatherService.kt:22`
- **Authentication**: None required
- **Data Includes**:
  - Current temperature (Celsius)
  - Weather conditions (clear, rain, snow, etc.)
  - Humidity levels
  - Wind speed (m/s)
  - 7-day forecast with daily high/low temperatures

#### 2. Geocoding API
- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Purpose**: Convert city names to GPS coordinates
- **Location**: `src/main/kotlin/service/GeocodingService.kt:12`
- **Authentication**: None required
- **Data Includes**:
  - City name
  - Latitude/Longitude
  - Country information

### Frontend Configuration

- **Environment Variable**: `NEXT_PUBLIC_BACKEND_URL`
- **Default Value**: `http://localhost:8080`
- **Configuration File**: `.env.local`

## 🧪 Testing Live Data

### 1. Test Backend API Directly

**Start the Kotlin backend:**
```bash
./gradlew build
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

**Test weather endpoint (using curl):**
```bash
# Test by city name
curl "http://localhost:8080/weather?city=London"

# Test by coordinates (London)
curl "http://localhost:8080/weather?lat=51.5074&lon=-0.1278"

# Test by city name (New York)
curl "http://localhost:8080/weather?city=New%20York"
```

**Expected Response:**
```json
{
  "current": {
    "city": "London",
    "temperatureCelsius": 15.5,
    "condition": "RAIN",
    "conditionDescription": "Moderate rain",
    "humidity": 75,
    "windSpeedMps": 5.2,
    "date": "2025-11-18",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "isDay": true
  },
  "forecast": [
    {
      "date": "2025-11-18",
      "highTempCelsius": 16.0,
      "lowTempCelsius": 12.0,
      "condition": "RAIN",
      "conditionDescription": "Moderate rain"
    },
    // ... 6 more days
  ]
}
```

### 2. Test Geocoding API

```bash
curl "http://localhost:8080/geocode?q=Paris"
```

**Expected Response:**
```json
{
  "results": [
    {
      "name": "Paris",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "country": "France"
    }
  ]
}
```

### 3. Test Rating Endpoint

**Submit a rating (no authentication required):**
```bash
curl -X POST "http://localhost:8080/weather/rating" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "London",
    "rating": 5,
    "date": "2025-11-18"
  }'
```

**Expected Response:**
```json
{
  "message": "Rating saved",
  "city": "London"
}
```

**Get average rating:**
```bash
curl "http://localhost:8080/weather/rating?city=London"
```

### 4. Test Full-Stack Integration

**Start both servers:**

Terminal 1 (Backend):
```bash
./gradlew build && java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

Terminal 2 (Frontend):
```bash
npm install
npm run dev
```

**Open browser:**
```
http://localhost:9002
```

**Test the application:**
1. Enter a city name (e.g., "London", "Tokyo", "New York")
2. Click "Get Weather"
3. Verify you see:
   - Current temperature in Celsius
   - Current weather condition
   - Humidity percentage
   - Wind speed in km/h
   - 5-day forecast
   - Weather recommendations
4. Try rating the forecast (1-5 stars)
5. Check browser console (F12) - should see no errors

## 🔍 Verifying Live Data

### How to Know It's Real Data

1. **Temperature Changes**: Check the same city at different times - the temperature should reflect actual weather changes

2. **Location Accuracy**: Search for your current city - the weather should match what you see outside

3. **Forecast Variation**: The 7-day forecast should show realistic temperature variations

4. **Weather Conditions**: Conditions should match real weather (if it's raining in London, the app should show rain)

5. **Humidity & Wind**: These values should be realistic for the location and season

### Compare with Other Weather Services

You can verify the data by comparing it with:
- [OpenMeteo Website](https://open-meteo.com/)
- Weather.com
- Local weather stations

The data should be very similar because OpenMeteo aggregates data from multiple weather services and meteorological agencies.

## 🚨 Troubleshooting

### Backend Returns Empty/No Data

**Symptom**: API returns null or empty weather data

**Solution**:
1. Check internet connection (OpenMeteo requires internet)
2. Verify the city name is spelled correctly
3. Check backend logs for error messages
4. Test OpenMeteo directly:
   ```bash
   curl "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7"
   ```

### Frontend Shows "Failed to connect to backend"

**Symptom**: Frontend displays connection error

**Solution**:
1. Verify backend is running on port 8080
2. Check `.env.local` has correct backend URL
3. Verify CORS is enabled in `Main.kt`
4. Check browser console for CORS errors

### Rating Fails with 401/403

**Symptom**: Cannot submit ratings

**Solution**:
- This has been fixed! Rating endpoint is now public
- Restart the backend after pulling latest changes
- If still failing, check backend logs for errors

## 📊 API Rate Limits

### OpenMeteo API

- **Free Tier**: 10,000 requests per day
- **Rate Limit**: No strict rate limiting for non-commercial use
- **Caching**: Backend doesn't cache by default
- **Recommendation**: Add caching in production to reduce API calls

### Future Improvements

For production deployment, consider:
1. **Add caching**: Cache weather data for 5-10 minutes
2. **Rate limiting**: Implement rate limiting on your backend
3. **Error handling**: Better fallback for API failures
4. **Monitoring**: Track API usage and response times

## 🔐 Security Notes

### No API Keys Required

- OpenMeteo is completely free and open
- No registration or API keys needed
- No sensitive data in code or environment variables

### JWT Authentication

- Currently used for user-specific features (preferences, saved locations)
- Rating endpoint is public (no auth required)
- Add login/register UI to enable authenticated features

## 📝 API Endpoints Summary

### Public Endpoints (No Authentication)

| Method | Endpoint | Purpose | Example |
|--------|----------|---------|---------|
| GET | `/weather?city={city}` | Get weather by city | `/weather?city=London` |
| GET | `/weather?lat={lat}&lon={lon}` | Get weather by coordinates | `/weather?lat=51.5&lon=-0.1` |
| GET | `/geocode?q={query}` | Search cities | `/geocode?q=Paris` |
| POST | `/weather/rating` | Submit rating | Body: `{city, rating, date}` |
| GET | `/weather/rating?city={city}` | Get average rating | `/weather/rating?city=London` |

### Authenticated Endpoints (JWT Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/user/preferences` | Get user preferences |
| POST | `/user/preferences` | Update preferences |
| GET | `/location` | Get last searched location |
| POST | `/location` | Save location |
| GET | `/locations/saved` | Get saved locations |
| POST | `/locations/saved` | Add saved location |
| DELETE | `/locations/saved/{name}` | Remove saved location |

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Can search for weather by city name
- [ ] Weather data shows realistic values
- [ ] Temperature is in Celsius
- [ ] Wind speed is in km/h (frontend) / m/s (backend)
- [ ] 7-day forecast displays
- [ ] Can submit ratings successfully
- [ ] No CORS errors in browser console
- [ ] No authentication errors for public endpoints

## 🌐 Live Data Sources

OpenMeteo aggregates data from:
- **NOAA** (National Oceanic and Atmospheric Administration)
- **DWD** (Deutscher Wetterdienst - German Weather Service)
- **ECMWF** (European Centre for Medium-Range Weather Forecasts)
- **UK Met Office**
- Various national meteorological services

This means the data is **highly accurate** and **professionally maintained**.

---

**Last Updated**: 2025-11-18
**API Provider**: [OpenMeteo](https://open-meteo.com/)
**License**: OpenMeteo is free for non-commercial use
