# WeatherDesk - Full Stack Integration

This repository contains the fully integrated WeatherDesk application with:
- **Backend**: Kotlin/Ktor API (port 8080)
- **Frontend**: Next.js 15 + React 18 (port 9002)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WeatherDesk Full Stack                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Next.js)              Backend (Kotlin/Ktor)      │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  Port: 9002      │◄─────────►│  Port: 8080      │       │
│  │                  │  HTTP/JSON │                  │       │
│  │  - React 18      │           │  - Ktor 3.1.1    │       │
│  │  - TypeScript    │           │  - Kotlin 2.2.20 │       │
│  │  - Tailwind CSS  │           │  - SQLite DB     │       │
│  │  - shadcn/ui     │           │  - JWT Auth      │       │
│  └──────────────────┘           └──────────────────┘       │
│         │                               │                   │
│         │                               │                   │
│         └───────────────────────────────┘                   │
│                 CORS Enabled                                │
│         (localhost:9002, localhost:3000)                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  OpenMeteo API   │
                │  (External)      │
                └──────────────────┘
```

## Directory Structure

```
weatherdesk-ba/
├── src/main/kotlin/              # Kotlin backend source
│   ├── Main.kt                   # Server entry point + CORS config
│   ├── database/                 # Database schema (Exposed ORM)
│   ├── model/                    # DTOs and data models
│   ├── routes/                   # API endpoints
│   └── service/                  # Business logic
├── frontend/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── actions.ts        # Server actions (calls Kotlin API)
│   │   │   ├── page.tsx          # Home page
│   │   │   └── layout.tsx        # Root layout
│   │   ├── components/           # React components
│   │   │   ├── weather-dashboard.tsx
│   │   │   ├── current-weather-card.tsx
│   │   │   ├── forecast-card.tsx
│   │   │   └── weather-recommendations.tsx
│   │   └── lib/
│   │       └── types.ts          # TypeScript types (matches Kotlin DTOs)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local                # Backend URL configuration
├── build.gradle.kts              # Kotlin build config (with CORS dependency)
└── weather_app.db                # SQLite database (auto-created)
```

## Prerequisites

### Backend Requirements
- **Java JDK 8+** (for Kotlin compilation)
- **Gradle** (included via wrapper)

### Frontend Requirements
- **Node.js 18+**
- **npm** or **yarn**

## Setup Instructions

### 1. Start the Kotlin Backend

```bash
# Navigate to project root
cd weatherdesk-ba

# Build and run the backend
./gradlew build
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar

# OR use Gradle run (if configured)
./gradlew run
```

The backend will start on **http://localhost:8080**

**Backend Features:**
- ✅ CORS enabled for frontend
- ✅ Real weather data from OpenMeteo API
- ✅ JWT authentication
- ✅ SQLite database for users, locations, ratings
- ✅ Automatic database initialization

### 2. Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:9002**

**Frontend Features:**
- ✅ Connected to Kotlin backend
- ✅ Weather search and display
- ✅ 7-day forecast (shows first 5 days)
- ✅ Weather recommendations
- ✅ Rating system
- ✅ Dark/Light theme support

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:9002
```

## API Endpoints

The Kotlin backend exposes the following endpoints:

### Weather Endpoints
- `GET /weather?city={city}` - Get weather by city name
- `GET /weather?lat={lat}&lon={lon}` - Get weather by coordinates
- `POST /weather/rating` - Submit weather rating (JWT required)
- `GET /weather/rating?city={city}` - Get average rating (JWT required)

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token

### Location Endpoints (JWT required)
- `POST /location` - Save last searched location
- `GET /location` - Get last searched location
- `GET /locations/saved` - Get saved locations
- `POST /locations/saved` - Add location to saved list
- `DELETE /locations/saved/{name}` - Remove saved location

### Preferences Endpoints (JWT required)
- `GET /user/preferences` - Get user preferences
- `POST /user/preferences` - Update user preferences

### Geocoding Endpoints
- `GET /geocode?q={query}` - Search cities by name

## Data Structure Alignment

The frontend and backend use matching data structures:

### Backend (Kotlin)
```kotlin
data class WeatherData(
    val current: CurrentWeather,
    val forecast: List<DailyForecast>
)

data class CurrentWeather(
    val city: String,
    val temperatureCelsius: Double,
    val condition: String,
    val conditionDescription: String,
    val humidity: Int,
    val windSpeedMps: Double,
    val date: LocalDate,
    val latitude: Double?,
    val longitude: Double?,
    val isDay: Boolean
)

data class DailyForecast(
    val date: LocalDate,
    val highTempCelsius: Double,
    val lowTempCelsius: Double,
    val condition: String,
    val conditionDescription: String
)
```

### Frontend (TypeScript)
```typescript
interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

interface CurrentWeather {
  city: string;
  temperatureCelsius: number;
  condition: string;
  conditionDescription: string;
  humidity: number;
  windSpeedMps: number;
  date: string; // ISO date string
  latitude?: number;
  longitude?: number;
  isDay: boolean;
}

interface ForecastDay {
  date: string; // ISO date string
  highTempCelsius: number;
  lowTempCelsius: number;
  condition: string;
  conditionDescription: string;
}
```

## Environment Configuration

### Backend Environment
No environment variables required. Defaults:
- Port: 8080
- Database: `weather_app.db` (SQLite, auto-created)
- JWT Secret: `super-secret-for-school-project` (hardcoded - should be externalized for production)

### Frontend Environment
File: `frontend/.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## Development Workflow

### Making Changes to Backend
1. Edit Kotlin files in `src/main/kotlin/`
2. Rebuild: `./gradlew build`
3. Restart server: `java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar`

### Making Changes to Frontend
1. Edit TypeScript/React files in `frontend/src/`
2. Changes auto-reload (hot module replacement)
3. No restart needed

## Testing the Integration

### Test Weather Search
1. Go to http://localhost:9002
2. Enter a city name (e.g., "London", "New York", "Tokyo")
3. Click "Get Weather"
4. Verify:
   - Current weather displays with temperature in Celsius
   - 5-day forecast shows
   - Weather recommendations appear
   - Wind speed is in km/h

### Test Rating System
1. Search for a city
2. Scroll to forecast section
3. Click on stars to rate (1-5)
4. Rating is submitted to backend (currently doesn't require auth)

### Verify Backend Connection
Check browser console (F12 → Console):
- No CORS errors
- No 404 errors
- Successful API responses logged

Check backend terminal:
- Request logs appear
- No errors

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process and restart
```

**Database errors:**
```bash
# Delete and regenerate database
rm weather_app.db
./gradlew build && java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

### Frontend Issues

**Port 9002 already in use:**
Edit `frontend/package.json`:
```json
"dev": "next dev -p 3000"  // Use different port
```
Then update `NEXT_PUBLIC_BACKEND_URL` CORS config in backend.

**Backend connection refused:**
1. Verify backend is running: `curl http://localhost:8080/weather?city=London`
2. Check `.env.local` has correct URL
3. Restart frontend: `npm run dev`

**Type errors after data structure changes:**
```bash
cd frontend
npm run typecheck  # Check for TypeScript errors
```

### CORS Issues

If you see CORS errors:
1. Verify backend CORS config in `src/main/kotlin/Main.kt` includes your frontend port
2. Restart backend after changes
3. Clear browser cache

## Production Deployment

### Backend Production Build
```bash
./gradlew build
java -jar build/libs/WeatherDesk-1.0-SNAPSHOT.jar
```

Configure:
- Externalize JWT secret via environment variable
- Use production database (PostgreSQL/MySQL instead of SQLite)
- Enable HTTPS
- Configure proper CORS origins

### Frontend Production Build
```bash
cd frontend
npm run build
npm run start
```

Configure:
- Update `NEXT_PUBLIC_BACKEND_URL` to production backend URL
- Set up proper environment variables
- Enable HTTPS
- Configure CDN for static assets

## Key Integration Points

### 1. Data Flow
```
User Input → Frontend Form → Server Action (actions.ts)
  → HTTP Request → Kotlin Backend (/weather endpoint)
  → OpenMeteo API → Weather Data → Frontend Display
```

### 2. Type Safety
- Frontend TypeScript types match Kotlin DTOs exactly
- Ensures compile-time safety on both ends
- Prevents runtime data structure mismatches

### 3. CORS Configuration
- Backend explicitly allows `localhost:9002` and `localhost:3000`
- Supports all necessary HTTP methods (GET, POST, PUT, DELETE)
- Allows Authorization and Content-Type headers

### 4. API Communication
- RESTful JSON API
- Consistent error handling
- Backend returns HTTP status codes
- Frontend handles errors gracefully

## Future Enhancements

- [ ] Add authentication UI (login/register forms)
- [ ] Implement user preferences UI
- [ ] Add saved locations feature
- [ ] Display rating averages from other users
- [ ] Add loading skeletons
- [ ] Implement unit tests (frontend + backend)
- [ ] Add E2E tests
- [ ] Containerize with Docker
- [ ] Set up CI/CD pipeline

## Technology Stack Summary

**Backend:**
- Kotlin 2.2.20
- Ktor 3.1.1 (web framework)
- Exposed ORM 0.41.1
- SQLite (development database)
- JWT authentication
- BCrypt password hashing
- Gson (JSON serialization)

**Frontend:**
- Next.js 15.3.3
- React 18.3.1
- TypeScript 5
- Tailwind CSS 3.4.1
- shadcn/ui components
- Radix UI primitives
- Zod validation

**External APIs:**
- OpenMeteo (weather data)
- OpenMeteo Geocoding (city search)

## License

This is an educational project.

## Support

For issues or questions:
1. Check this README
2. Review backend logs
3. Check browser console for frontend errors
4. Verify CORS configuration
5. Ensure both servers are running

---

**Happy coding! 🌤️**
