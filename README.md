# LunaWeather

A modern, full-stack weather application with real-time weather data, forecasts, and personalized weather insights.

## Features

- **Real-Time Weather Data**: Live weather conditions from OpenMeteo API
- **5-Day Forecast**: Detailed weather predictions with high/low temperatures
- **Global City Search**: Look up weather for any location worldwide
- **"Feels Like" Descriptions**: Quirky, relatable weather condition descriptions
- **Weather Recommendations**: Smart suggestions based on current conditions
- **Theme Support**: Light and dark mode with smooth transitions
- **Favorites & Preferences**: Save locations and customize display settings
- **Responsive Design**: Beautiful glass-morphism UI that works on all devices

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **shadcn/ui** - Premium component library

### Backend
- **Kotlin** - Type-safe backend development
- **Ktor** - Async web framework
- **OpenMeteo API** - Weather data provider
- **Nominatim** - Geocoding service

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+ (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/McMerger/LunaWeather.git
cd LunaWeather
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Start the backend server**
```bash
./run-backend.sh
```
Backend runs on `http://localhost:8080`

4. **Start the frontend** (in a new terminal)
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

## Project Structure

```
LunaWeather/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utilities
│   └── main/kotlin/            # Kotlin backend
│       ├── model/              # Data models
│       ├── service/            # Business logic
│       └── Main.kt             # Server entry point
├── build.gradle.kts            # Kotlin build config
├── package.json                # Node dependencies
└── run-backend.sh              # Backend startup script
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend
- `./run-backend.sh` - Build and run backend server
- `./gradlew build` - Build backend only

## API Endpoints

The backend provides the following endpoints:

- `GET /weather?city=<city_name>` - Get weather data for a city
- `POST /weather/rating` - Submit weather rating

## Customization

### User Preferences
- Temperature units (Celsius/Fahrenheit)
- Wind speed units (km/h, mph, m/s)
- Toggle "Feels Like" descriptions
- Toggle weather recommendations
- Auto-refresh settings

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Weather data: [OpenMeteo API](https://open-meteo.com/)
- Geocoding: [Nominatim](https://nominatim.openstreetmap.org/)
- UI components: [shadcn/ui](https://ui.shadcn.com/)
- Framework: [Next.js](https://nextjs.org/)
