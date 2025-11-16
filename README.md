# WeatherDesk

A modern weather application built with Next.js and React, featuring real-time weather data, forecasts, and AI-powered weather recommendations.

## Features

- **Real-Time Weather Data**: Fetch current weather conditions from OpenMeteo API
- **5-Day Forecast**: View detailed weather predictions with hourly breakdowns
- **City Search**: Look up weather for any location worldwide
- **Weather Recommendations**: AI-powered suggestions for activities based on current conditions
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **Modern UI Components**: Leveraging shadcn/ui for a polished user experience
- **Server Actions**: Efficient data fetching with Next.js server-side capabilities

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React** - UI component library
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component system
- **Lucide React** - Icon library

### APIs & Services
- **OpenMeteo API** - Weather data provider
- **Firebase Genkit** - AI integration capabilities

## Project Structure

```
WeatherDesk/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── actions.ts    # Server actions for data fetching
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── ai/               # AI integration (Genkit)
├── public/               # Static assets
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A backend API endpoint (optional - can use OpenMeteo directly)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/McMerger/WeatherDesk.git
cd WeatherDesk
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Features in Detail

### Weather Display
- Current temperature with real-time updates
- Weather condition descriptions (sunny, cloudy, rainy, etc.)
- Humidity and wind speed metrics
- Day/night detection

### Forecast View
- 5-day weather forecast
- Daily high/low temperatures
- Weather condition icons
- Easy-to-read card layout

### City Search
- Search for any city worldwide
- Predefined popular cities for quick access
- Coordinate-based weather lookup support

## Backend Integration

This frontend is designed to work with a separate backend service. The frontend handles:
- User interface and interactions
- Weather data display and formatting
- AI-powered recommendations
- Responsive design and animations

The backend should provide:
- Weather data endpoints
- API authentication (if required)
- Data processing and caching

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Weather data provided by [OpenMeteo API](https://open-meteo.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/)
