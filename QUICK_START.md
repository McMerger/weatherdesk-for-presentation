# WeatherDesk Quick Start Guide

Get the full-stack WeatherDesk application running with **real, live weather data** in 5 minutes!

## Prerequisites

- **Java JDK 8+** (for Kotlin backend)
- **Node.js 18+** (for Next.js frontend)
- **Internet connection** (for OpenMeteo API)

## 🚀 Quick Start (2 Commands)

### 1. Setup Environment

```bash
# Create frontend environment file
cp .env.example .env.local
```

That's it! No API keys needed - OpenMeteo is completely free.

### 2. Start Both Servers

**Terminal 1 - Start Backend (Kotlin/Ktor):**
```bash
./gradlew build
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

Wait for: `Starting server on port 8080...`

**Terminal 2 - Start Frontend (Next.js):**
```bash
npm install
npm run dev
```

Wait for: `Ready on http://localhost:9002`

### 3. Open Your Browser

Navigate to: **http://localhost:9002**

## ✅ Verify It's Working

1. **Search for a city**: Enter "London" or your city name
2. **Check the data**:
   - Temperature should be in Celsius
   - Wind speed in km/h
   - Weather condition matches reality
   - 7-day forecast displays
3. **Try rating**: Click stars to rate the forecast
4. **Check console**: F12 → Console (should see no errors)

## 🧪 Test with Curl

```bash
# Test weather API (backend must be running)
curl "http://localhost:8080/weather?city=London" | jq

# Test city search
curl "http://localhost:8080/geocode?q=Tokyo" | jq

# Test rating submission
curl -X POST "http://localhost:8080/weather/rating" \
  -H "Content-Type: application/json" \
  -d '{"city":"London","rating":5,"date":"2025-11-18"}'
```

## 📁 Project Structure

```
weatherdesk-for-presentation/
├── src/
│   ├── app/                    # Next.js frontend
│   │   ├── actions.ts          # Calls backend API
│   │   └── page.tsx            # Main UI
│   └── main/kotlin/            # Kotlin backend
│       ├── Main.kt             # Server entry + CORS
│       ├── routes/             # API endpoints
│       └── service/            # Weather services
├── build.gradle.kts            # Kotlin build
├── package.json                # Frontend deps
├── .env.local                  # Backend URL (create this!)
└── INTEGRATION_README.md       # Detailed docs
```

## 🔧 Configuration Files

### .env.local (Frontend)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### No Backend Configuration Needed!
The Kotlin backend works out of the box with OpenMeteo API.

## 🌐 API Information

### What APIs Are Used?

1. **OpenMeteo Weather API**
   - URL: `https://api.open-meteo.com/v1/forecast`
   - **FREE** - No API keys
   - Real-time weather data worldwide

2. **OpenMeteo Geocoding API**
   - URL: `https://geocoding-api.open-meteo.com/v1/search`
   - **FREE** - No registration
   - City name → GPS coordinates

### Data Sources
- NOAA (US Weather)
- ECMWF (European Weather)
- DWD (German Weather Service)
- UK Met Office
- And more...

## 🐛 Common Issues

### Port 8080 Already in Use
```bash
# Find and kill the process
lsof -i :8080          # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

### Port 9002 Already in Use
Edit `package.json`:
```json
"dev": "next dev -p 3000"  // Use different port
```
Then update CORS in `src/main/kotlin/Main.kt`.

### "Failed to connect to backend"
1. ✅ Backend running on port 8080?
2. ✅ `.env.local` exists with correct URL?
3. ✅ No CORS errors in browser console?

### Gradle Build Fails
```bash
# Use the wrapper (includes correct Gradle version)
./gradlew clean build
```

### Frontend Type Errors
```bash
npm run typecheck  # Check TypeScript errors
```

## 📚 More Information

- **API Testing**: See `API_VERIFICATION.md`
- **Full Integration Guide**: See `INTEGRATION_README.md`
- **Setup Troubleshooting**: See `SETUP.md`

## 🎯 What You Get

✅ **Real Weather Data** - Live data from OpenMeteo API
✅ **No API Keys** - Completely free, no registration
✅ **Full Stack** - Kotlin backend + Next.js frontend
✅ **Type Safe** - TypeScript ↔ Kotlin DTOs match
✅ **Modern UI** - shadcn/ui components
✅ **Dark Mode** - Automatic theme switching
✅ **Responsive** - Works on mobile & desktop
✅ **7-Day Forecast** - Accurate weather predictions
✅ **Weather Recommendations** - AI-powered activity suggestions
✅ **Rating System** - Share forecast opinions

## 🔐 No API Keys Required!

This application uses **OpenMeteo**, which:
- Doesn't require API keys
- Has no registration
- Is completely free
- Provides professional-grade weather data
- Aggregates data from meteorological agencies worldwide

**You're getting the same data used by professional weather services!**

## 🚦 Quick Health Check

After starting both servers, verify everything works:

```bash
# 1. Check backend health
curl http://localhost:8080/weather?city=London

# 2. Check frontend loads
curl http://localhost:9002

# 3. Check CORS works (from browser console)
fetch('http://localhost:8080/weather?city=Paris')
  .then(r => r.json())
  .then(console.log)
```

## 📊 Performance Notes

- **Initial Build**: 1-2 minutes (Gradle + npm)
- **Subsequent Starts**: 5-10 seconds each
- **API Response Time**: 200-500ms (OpenMeteo)
- **Frontend Load**: Instant (Next.js SSR)

## 🎉 You're Ready!

The application is now running with **real, live weather data** from professional meteorological sources. No mock data, no API key hassles - just pure, accurate weather information.

Try searching for cities worldwide and see accurate, real-time weather! 🌤️

---

**Need Help?** Check the detailed guides:
- `API_VERIFICATION.md` - Test APIs
- `INTEGRATION_README.md` - Full documentation
- `SETUP.md` - Troubleshooting
