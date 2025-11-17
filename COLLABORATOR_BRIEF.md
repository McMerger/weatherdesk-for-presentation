# WeatherDesk - Quick Technical Brief

## What It Is
A modern weather app built with **Next.js 15 + React 18 + TypeScript** that shows current weather, 5-day forecasts, and intelligent recommendations. Currently runs on **mock data** awaiting backend integration.

## Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **State:** React hooks + Server Actions (no Redux)
- **APIs:** Ready for real weather APIs (OpenMeteo/OpenWeather support built-in)
- **Current Mode:** Deterministic mock data (25+ cities, 567 lines)

## How It Works Now

```
User searches city
  ↓
Server Action (src/app/actions.ts)
  ↓
Mock Weather Service (src/lib/weather/mockWeatherService.ts)
  - Generates realistic, deterministic data
  - 25+ global cities with coordinates
  - Seasonal weather patterns
  ↓
Recommendation Engine (src/lib/weather-recommendations.ts)
  - 492 lines of multi-factor analysis
  - Temperature, humidity, wind, conditions
  - 6+ context-aware suggestions per query
  ↓
UI Components render results
```

## Backend Integration Points

### What Your Backend Should Provide

**Single endpoint:** `getWeather(cityName: string)`

**Expected response:**
```typescript
{
  current: {
    city: string,           // "London"
    temperature: number,    // 15 (Celsius)
    condition: string,      // "Rainy", "Clear", etc.
    humidity: number,       // 75 (percent)
    windSpeed: number,      // 12 (km/h)
    date: string           // "Monday, November 17, 2025"
  },
  forecast: [              // 5 days
    { day: "Mon", high: 18, low: 12, condition: "Rainy" },
    // ... 4 more
  ]
}
```

### Integration Steps

1. **Review types:** `src/lib/types.ts` (42 lines - defines data contracts)
2. **Update Server Action:** `src/app/actions.ts` line 15 - replace mock service call with your API
3. **Add env variables:** Your backend URL/API keys in `.env.local`
4. **Test:** Everything else (UI, recommendations, error handling) is done

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/app/actions.ts` | **Main integration point** - Update this | 67 |
| `src/lib/types.ts` | **Data contracts** - Match these interfaces | 42 |
| `src/lib/weather/mockWeatherService.ts` | Current mock - Replace with your API | 567 |
| `src/lib/weather-recommendations.ts` | Smart recommendations - Keep as-is | 492 |

## What's Already Built

✅ Complete UI/UX (current weather, 5-day forecast, recommendations)
✅ 492-line recommendation engine (multi-factor weather analysis)
✅ Full TypeScript type safety
✅ Error handling & loading states
✅ 5-star rating system (needs DB for persistence)
✅ Dark/light theme auto-switching
✅ Responsive design

## What Needs Your Backend

🔄 Weather data source (replace mock service)
🔄 Rating persistence (currently localStorage)
🔄 City geocoding (currently 25 hardcoded cities)

## Quick Start

```bash
npm install
npm run dev
# Visit http://localhost:9002
# Search "London" or "Tokyo" to see mock data
```

## Questions for Alignment

1. What's your API base URL?
2. Need authentication headers?
3. Can you return temperatures in Celsius?
4. Will you handle city → coordinates geocoding?
5. Database ready for storing user ratings?

---

**Bottom Line:** App is production-ready with mock data. Integration = updating one file (`actions.ts`) to call your APIs instead of mock service. All UI, logic, and types are complete.
