# WeatherDesk - Setup & Troubleshooting Guide

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone and install:
```bash
git clone https://github.com/McMerger/weatherdesk-for-presentation.git
cd weatherdesk-for-presentation
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open browser: `http://localhost:9002`

## Why Components Don't Appear - Root Causes

### Issue #1: Dependencies Not Installed
**Symptom**: Module not found errors
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue #2: Port 9002 Already in Use
**Symptom**: EADDRINUSE error
**Fix**: Kill the process or change port in package.json

### Issue #3: Turbopack Compatibility
**Symptom**: White screen or components don't render
**Fix**: Run without turbopack:
```bash
next dev -p 9002
```

### Issue #4: Browser Cache
**Fix**: Hard refresh (Ctrl+Shift+R) or use incognito mode

### Issue #5: Build Cache Corruption
**Fix**:
```bash
rm -rf .next
npm run dev
```

## Component Architecture

The app structure:
- `src/app/page.tsx` - Imports WeatherDashboard
- `src/components/weather-dashboard.tsx` - Main component
- `src/components/current-weather-card.tsx` - Current weather
- `src/components/forecast-card.tsx` - 5-day forecast
- `src/app/api/weather/route.ts` - Mock API

## Debug Checklist

- [ ] `node --version` shows 18+
- [ ] `node_modules/` exists
- [ ] No console errors (F12)
- [ ] Port 9002 free
- [ ] Clear .next cache

## Component Export/Import Verification

All components use named exports:
- `export function WeatherDashboard()` in weather-dashboard.tsx
- `export function CurrentWeatherCard()` in current-weather-card.tsx  
- `export function ForecastCard()` in forecast-card.tsx

Imports are correct with @ alias:
- `import { WeatherDashboard } from "@/components/weather-dashboard"`

## Need Help?

Check:
1. Browser console (F12) for errors
2. Terminal for build errors
3. Network tab for failed API calls

The application uses a mock weather service, so no API keys needed!
