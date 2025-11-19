LunaWeather

LunaWeather is a full-stack weather app with live weather data, detailed forecasts, and some personality in the “feels like” insights. It's designed to be user-friendly and modern.
What it does
•	Real-time weather: Get current conditions from OpenMeteo for any city worldwide.
•	5-day forecast: See high/low temps and details for the week ahead.
•	Global search: Type in any location, it works.
•	Relatable “feels like” lines: Short descriptions that actually make sense.
•	Weather recommendations: Handy suggestions for things like clothing or gear.
•	Theme support: Dark and light modes, with smooth transitions.
•	Favorites: Save locations and adjust preferences for display.
•	Responsive design: Looks good on phones, tablets, and desktops (glassmorphism-style UI).
Tech stack
Frontend
•	Next.js 14 (with app router, based on React)
•	TypeScript
•	Tailwind CSS
•	shadcn/ui library (UI components)
Backend
•	Kotlin & Ktor (backend API)
•	OpenMeteo (weather data)
•	Nominatim (city-to-coordinates geocoding)

Project structure
text
LunaWeather/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React UI components
│   ├── contexts/     # Theme and preferences
│   ├── lib/          # Utility code
│   └── main/kotlin/  # Backend (Kotlin/Ktor)
│       ├── model/    # Data models
│       ├── service/  # API/business logic
│       └── Main.kt   # Entry point for server
├── build.gradle.kts  # Kotlin build config
├── package.json      # Frontend dependencies
└── run-backend.sh    # Backend start script
Useful scripts
Frontend:
•	npm run dev – development mode
•	npm run build – build for production
•	npm start – serve built frontend
Backend:
•	./run-backend.sh – build and run backend
•	./gradlew build – build backend by itself

API endpoints
•	GET /weather?city=<city_name>: Get current weather and forecast for a city
•	POST /weather/rating: Send a weather rating (demo endpoint)
Customization options
•	Change units (°C/°F, km/h, mph, m/s)
•	Toggle “feels like” and recommendations on or off
•	Set auto-refresh intervals for live data
Credits
•	Weather: OpenMeteo
•	Geocoding: Nominatim
•	UI: shadcn/ui
•	Framework: Next.js

