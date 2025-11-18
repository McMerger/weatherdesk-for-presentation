/**
 * Mock Weather Service
 *
 * ⚠️ DEPRECATED - This file is no longer used in production
 *
 * The application now uses the Kotlin backend which fetches REAL weather data
 * from OpenMeteo API. This file is kept for reference and testing purposes only.
 *
 * All weather data now comes from: src/main/kotlin/service/WeatherService.kt
 * which calls https://api.open-meteo.com/v1/forecast
 */

export interface CityCoordinates {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
}

export interface MockWeatherData {
  longitude: number;
  latitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
  };
}

// Comprehensive city database with coordinates
export const CITY_DATABASE: Record<string, CityCoordinates> = {
  // North America
  "new york": { name: "New York", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York", country: "USA" },
  "los angeles": { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles", country: "USA" },
  "chicago": { name: "Chicago", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago", country: "USA" },
  "toronto": { name: "Toronto", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto", country: "Canada" },
  "vancouver": { name: "Vancouver", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver", country: "Canada" },
  "mexico city": { name: "Mexico City", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City", country: "Mexico" },
  "miami": { name: "Miami", latitude: 25.7617, longitude: -80.1918, timezone: "America/New_York", country: "USA" },
  "san francisco": { name: "San Francisco", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", country: "USA" },
  "seattle": { name: "Seattle", latitude: 47.6062, longitude: -122.3321, timezone: "America/Los_Angeles", country: "USA" },
  "thunder bay": { name: "Thunder Bay", latitude: 48.3809, longitude: -89.2477, timezone: "America/Thunder_Bay", country: "Canada" },

  // Europe
  "london": { name: "London", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London", country: "UK" },
  "paris": { name: "Paris", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", country: "France" },
  "berlin": { name: "Berlin", latitude: 52.5200, longitude: 13.4050, timezone: "Europe/Berlin", country: "Germany" },
  "madrid": { name: "Madrid", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid", country: "Spain" },
  "rome": { name: "Rome", latitude: 41.9028, longitude: 12.4964, timezone: "Europe/Rome", country: "Italy" },
  "amsterdam": { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam", country: "Netherlands" },
  "barcelona": { name: "Barcelona", latitude: 41.3851, longitude: 2.1734, timezone: "Europe/Madrid", country: "Spain" },
  "vienna": { name: "Vienna", latitude: 48.2082, longitude: 16.3738, timezone: "Europe/Vienna", country: "Austria" },
  "prague": { name: "Prague", latitude: 50.0755, longitude: 14.4378, timezone: "Europe/Prague", country: "Czech Republic" },
  "dublin": { name: "Dublin", latitude: 53.3498, longitude: -6.2603, timezone: "Europe/Dublin", country: "Ireland" },

  // Asia
  "tokyo": { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", country: "Japan" },
  "beijing": { name: "Beijing", latitude: 39.9042, longitude: 116.4074, timezone: "Asia/Shanghai", country: "China" },
  "shanghai": { name: "Shanghai", latitude: 31.2304, longitude: 121.4737, timezone: "Asia/Shanghai", country: "China" },
  "hong kong": { name: "Hong Kong", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong", country: "China" },
  "singapore": { name: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore", country: "Singapore" },
  "seoul": { name: "Seoul", latitude: 37.5665, longitude: 126.9780, timezone: "Asia/Seoul", country: "South Korea" },
  "mumbai": { name: "Mumbai", latitude: 19.0760, longitude: 72.8777, timezone: "Asia/Kolkata", country: "India" },
  "delhi": { name: "Delhi", latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata", country: "India" },
  "bangkok": { name: "Bangkok", latitude: 13.7563, longitude: 100.5018, timezone: "Asia/Bangkok", country: "Thailand" },
  "dubai": { name: "Dubai", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai", country: "UAE" },

  // Oceania
  "sydney": { name: "Sydney", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", country: "Australia" },
  "melbourne": { name: "Melbourne", latitude: -37.8136, longitude: 144.9631, timezone: "Australia/Melbourne", country: "Australia" },
  "auckland": { name: "Auckland", latitude: -36.8485, longitude: 174.7633, timezone: "Pacific/Auckland", country: "New Zealand" },
  "brisbane": { name: "Brisbane", latitude: -27.4698, longitude: 153.0251, timezone: "Australia/Brisbane", country: "Australia" },
  "perth": { name: "Perth", latitude: -31.9505, longitude: 115.8605, timezone: "Australia/Perth", country: "Australia" },

  // South America
  "sao paulo": { name: "São Paulo", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo", country: "Brazil" },
  "rio de janeiro": { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo", country: "Brazil" },
  "buenos aires": { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires", country: "Argentina" },
  "santiago": { name: "Santiago", latitude: -33.4489, longitude: -70.6693, timezone: "America/Santiago", country: "Chile" },
  "lima": { name: "Lima", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima", country: "Peru" },

  // Africa
  "cairo": { name: "Cairo", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", country: "Egypt" },
  "lagos": { name: "Lagos", latitude: 6.5244, longitude: 3.3792, timezone: "Africa/Lagos", country: "Nigeria" },
  "johannesburg": { name: "Johannesburg", latitude: -26.2041, longitude: 28.0473, timezone: "Africa/Johannesburg", country: "South Africa" },
  "nairobi": { name: "Nairobi", latitude: -1.2921, longitude: 36.8219, timezone: "Africa/Nairobi", country: "Kenya" },
  "casablanca": { name: "Casablanca", latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca", country: "Morocco" },
};

// Weather code descriptions (WMO Weather interpretation codes)
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "sun" },
  1: { description: "Mainly clear", icon: "sun" },
  2: { description: "Partly cloudy", icon: "cloud-sun" },
  3: { description: "Overcast", icon: "cloud" },
  45: { description: "Foggy", icon: "cloud-fog" },
  48: { description: "Depositing rime fog", icon: "cloud-fog" },
  51: { description: "Light drizzle", icon: "cloud-drizzle" },
  53: { description: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { description: "Dense drizzle", icon: "cloud-drizzle" },
  56: { description: "Light freezing drizzle", icon: "cloud-drizzle" },
  57: { description: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { description: "Slight rain", icon: "cloud-rain" },
  63: { description: "Moderate rain", icon: "cloud-rain" },
  65: { description: "Heavy rain", icon: "cloud-rain" },
  66: { description: "Light freezing rain", icon: "cloud-rain" },
  67: { description: "Heavy freezing rain", icon: "cloud-rain" },
  71: { description: "Slight snow", icon: "cloud-snow" },
  73: { description: "Moderate snow", icon: "cloud-snow" },
  75: { description: "Heavy snow", icon: "cloud-snow" },
  77: { description: "Snow grains", icon: "cloud-snow" },
  80: { description: "Slight rain showers", icon: "cloud-rain" },
  81: { description: "Moderate rain showers", icon: "cloud-rain" },
  82: { description: "Violent rain showers", icon: "cloud-rain" },
  85: { description: "Slight snow showers", icon: "cloud-snow" },
  86: { description: "Heavy snow showers", icon: "cloud-snow" },
  95: { description: "Thunderstorm", icon: "cloud-lightning" },
  96: { description: "Thunderstorm with slight hail", icon: "cloud-lightning" },
  99: { description: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};

/**
 * Get seasonal base temperature for a location
 * Enhanced for November 2025 - Late Fall/Early Summer patterns
 */
function getSeasonalBaseTemp(latitude: number, month: number): number {
  const isNorthernHemisphere = latitude >= 0;
  const absoluteLatitude = Math.abs(latitude);

  // Month: 0 = January, 10 = November (current month)
  // Northern Hemisphere: Late Fall transitioning to Winter
  // Southern Hemisphere: Late Spring transitioning to Summer

  let season: "winter" | "spring" | "summer" | "fall";

  if (isNorthernHemisphere) {
    if (month >= 11 || month <= 1) season = "winter";
    else if (month >= 2 && month <= 4) season = "spring";
    else if (month >= 5 && month <= 7) season = "summer";
    else season = "fall";
  } else {
    if (month >= 11 || month <= 1) season = "summer";
    else if (month >= 2 && month <= 4) season = "fall";
    else if (month >= 5 && month <= 7) season = "winter";
    else season = "spring";
  }

  // Enhanced temperature model based on latitude zones
  // Tropical (0-23.5°), Subtropical (23.5-35°), Temperate (35-55°), Polar (55-90°)

  let baseTemp: number;

  if (absoluteLatitude < 23.5) {
    // Tropical zone - warm year-round, minimal seasonal variation
    baseTemp = season === "winter" ? 26 : season === "summer" ? 29 : 28;
  } else if (absoluteLatitude < 35) {
    // Subtropical zone - mild winters, hot summers
    const seasonalTemps = {
      winter: 15,
      spring: 20,
      summer: 30,
      fall: 22,
    };
    baseTemp = seasonalTemps[season];
  } else if (absoluteLatitude < 55) {
    // Temperate zone - distinct four seasons
    const seasonalTemps = {
      winter: 3,
      spring: 13,
      summer: 24,
      fall: 10,
    };
    baseTemp = seasonalTemps[season];
  } else {
    // Polar/Subpolar zone - cold year-round
    const seasonalTemps = {
      winter: -15,
      spring: 0,
      summer: 12,
      fall: -5,
    };
    baseTemp = seasonalTemps[season];
  }

  // For November specifically, adjust for late fall cooling (Northern) or spring warming (Southern)
  if (month === 10) { // November (0-indexed)
    if (isNorthernHemisphere && absoluteLatitude > 35) {
      baseTemp -= 3; // Cooler in late fall for temperate/polar regions
    } else if (!isNorthernHemisphere && absoluteLatitude > 35) {
      baseTemp += 3; // Warmer in late spring for temperate/polar regions
    }
  }

  return baseTemp;
}

/**
 * Get realistic weather code based on season and location
 * Enhanced for November 2025 patterns
 */
function getRealisticWeatherCode(latitude: number, month: number, dayOffset: number = 0): number {
  const isNorthernHemisphere = latitude >= 0;
  const absoluteLatitude = Math.abs(latitude);

  // Determine season
  let isWinterSeason = false;
  let isSummerSeason = false;
  let isFallSeason = false;
  let isSpringSeason = false;

  if (isNorthernHemisphere) {
    isWinterSeason = month >= 11 || month <= 1;
    isSummerSeason = month >= 5 && month <= 7;
    isFallSeason = month >= 8 && month <= 10;
    isSpringSeason = month >= 2 && month <= 4;
  } else {
    isWinterSeason = month >= 5 && month <= 7;
    isSummerSeason = month >= 11 || month <= 1;
    isFallSeason = month >= 2 && month <= 4;
    isSpringSeason = month >= 8 && month <= 10;
  }

  // Random factor for variety (deterministic based on day)
  const random = (Math.sin(dayOffset * 12345 + latitude * 100) + 1) / 2;

  // Tropical regions (0-23.5° latitude) - Warm and humid year-round
  if (absoluteLatitude < 23.5) {
    if (random < 0.35) return 0; // Clear
    if (random < 0.65) return 2; // Partly cloudy
    if (random < 0.85) return 61; // Light rain (tropical showers)
    return 80; // Rain showers
  }

  // Subtropical regions (23.5-35°)
  if (absoluteLatitude < 35) {
    if (isWinterSeason) {
      if (random < 0.5) return 0; // Clear (mild winter)
      if (random < 0.75) return 2; // Partly cloudy
      if (random < 0.9) return 61; // Light rain
      return 3; // Overcast
    } else if (isSummerSeason) {
      if (random < 0.6) return 0; // Clear (hot summer)
      if (random < 0.85) return 2; // Partly cloudy
      return 61; // Light rain
    } else {
      if (random < 0.55) return 0; // Clear
      if (random < 0.8) return 2; // Partly cloudy
      return 61; // Light rain
    }
  }

  // Temperate regions (35-55°) - Four distinct seasons
  if (absoluteLatitude < 55) {
    // November specific patterns for Northern Hemisphere (Late Fall)
    if (month === 10 && isNorthernHemisphere) {
      if (random < 0.25) return 0; // Clear but cool
      if (random < 0.4) return 1; // Mainly clear
      if (random < 0.6) return 3; // Overcast (common in November)
      if (random < 0.8) return 61; // Rain (wet season)
      if (absoluteLatitude > 45 && random < 0.95) return 71; // Early snow possible
      return 61; // Rain
    }

    // November specific patterns for Southern Hemisphere (Late Spring)
    if (month === 10 && !isNorthernHemisphere) {
      if (random < 0.5) return 0; // Clear spring days
      if (random < 0.75) return 2; // Partly cloudy
      if (random < 0.9) return 61; // Spring rain
      return 95; // Occasional thunderstorm
    }

    if (isWinterSeason) {
      if (random < 0.25) return 0; // Clear
      if (random < 0.4) return 3; // Overcast
      if (random < 0.6) return 61; // Rain
      if (random < 0.8) return 71; // Light snow
      return 73; // Moderate snow
    } else if (isSummerSeason) {
      if (random < 0.55) return 0; // Clear
      if (random < 0.75) return 2; // Partly cloudy
      if (random < 0.9) return 61; // Light rain
      return 95; // Thunderstorm
    } else if (isFallSeason) {
      if (random < 0.35) return 1; // Mainly clear
      if (random < 0.55) return 2; // Partly cloudy
      if (random < 0.75) return 3; // Overcast (common in fall)
      return 61; // Rain (wet season)
    } else { // Spring
      if (random < 0.45) return 0; // Clear
      if (random < 0.7) return 2; // Partly cloudy
      if (random < 0.85) return 61; // Spring rain
      return 95; // Spring thunderstorm
    }
  }

  // Polar/Subpolar regions (55-90°) - Cold year-round
  if (isWinterSeason) {
    if (random < 0.15) return 0; // Rarely clear
    if (random < 0.35) return 3; // Overcast
    if (random < 0.55) return 71; // Light snow
    if (random < 0.75) return 73; // Moderate snow
    return 75; // Heavy snow
  } else if (isSummerSeason) {
    if (random < 0.4) return 1; // Mainly clear (short summer)
    if (random < 0.65) return 2; // Partly cloudy
    if (random < 0.85) return 3; // Overcast
    return 61; // Light rain
  } else {
    if (random < 0.3) return 1; // Mainly clear
    if (random < 0.5) return 3; // Overcast
    if (random < 0.7) return 71; // Light snow
    return 61; // Rain/sleet
  }
}

/**
 * Generate realistic mock weather data
 */
export function generateMockWeatherData(
  latitude: number,
  longitude: number,
  timezone: string
): MockWeatherData {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentHour = now.getHours();

  // Determine if it's day or night (simplified)
  const isDaytime = currentHour >= 6 && currentHour < 19;

  // Get seasonal base temperature
  const baseTemp = getSeasonalBaseTemp(latitude, currentMonth);

  // Add daily and random variation
  const dailyVariation = Math.sin((currentHour - 6) / 12 * Math.PI) * 5; // Warmer during day
  const randomVariation = (Math.sin(latitude + longitude + now.getDate()) + 1) * 3;
  const currentTemp = Math.round(baseTemp + dailyVariation + randomVariation);

  // Generate weather code
  const weatherCode = getRealisticWeatherCode(latitude, currentMonth, 0);

  // Calculate other current conditions
  const humidity = Math.round(60 + (Math.sin(latitude) * 20) + (Math.random() * 20));
  const windSpeed = Math.round(5 + Math.random() * 15);
  const cloudCover = weatherCode === 0 ? Math.round(Math.random() * 20) :
                     weatherCode <= 2 ? Math.round(30 + Math.random() * 40) :
                     Math.round(70 + Math.random() * 30);

  // Generate 7-day forecast
  const forecastDays = 7;
  const dailyTimes: string[] = [];
  const weatherCodes: number[] = [];
  const maxTemps: number[] = [];
  const minTemps: number[] = [];
  const precipSums: number[] = [];
  const windSpeedMax: number[] = [];
  const uvIndex: number[] = [];

  for (let i = 0; i < forecastDays; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);
    dailyTimes.push(forecastDate.toISOString().split('T')[0]);

    const dayBaseTemp = getSeasonalBaseTemp(latitude, forecastDate.getMonth());
    const dayVariation = (Math.sin(i * 0.5) * 3) + ((Math.random() - 0.5) * 4);

    const dayWeatherCode = getRealisticWeatherCode(latitude, forecastDate.getMonth(), i);
    weatherCodes.push(dayWeatherCode);

    maxTemps.push(Math.round(dayBaseTemp + dayVariation + 5));
    minTemps.push(Math.round(dayBaseTemp + dayVariation - 5));

    // Precipitation based on weather code
    const hasPrecip = dayWeatherCode >= 51;
    precipSums.push(hasPrecip ? Math.round(Math.random() * 15 + 2) : 0);

    windSpeedMax.push(Math.round(windSpeed + Math.random() * 10));

    // UV index (higher in summer, lower in winter, varies with latitude)
    const absoluteLatitude = Math.abs(latitude);
    const baseUV = 11 - (absoluteLatitude / 90) * 8;
    const seasonalUV = Math.sin(currentMonth / 6 * Math.PI) * 3;
    uvIndex.push(Math.max(0, Math.round(baseUV + seasonalUV)));
  }

  return {
    longitude,
    latitude,
    timezone,
    current: {
      time: now.toISOString(),
      temperature_2m: currentTemp,
      relative_humidity_2m: humidity,
      apparent_temperature: currentTemp - 2,
      is_day: isDaytime ? 1 : 0,
      precipitation: weatherCode >= 51 && weatherCode <= 67 ? Math.round(Math.random() * 5) : 0,
      rain: weatherCode >= 61 && weatherCode <= 67 ? Math.round(Math.random() * 5) : 0,
      showers: weatherCode >= 80 && weatherCode <= 82 ? Math.round(Math.random() * 8) : 0,
      snowfall: weatherCode >= 71 && weatherCode <= 77 ? Math.round(Math.random() * 10) : 0,
      weather_code: weatherCode,
      cloud_cover: cloudCover,
      pressure_msl: Math.round(1013 + (Math.random() - 0.5) * 20),
      surface_pressure: Math.round(1010 + (Math.random() - 0.5) * 20),
      wind_speed_10m: windSpeed,
      wind_direction_10m: Math.round(Math.random() * 360),
      wind_gusts_10m: Math.round(windSpeed * 1.5),
    },
    daily: {
      time: dailyTimes,
      weather_code: weatherCodes,
      temperature_2m_max: maxTemps,
      temperature_2m_min: minTemps,
      apparent_temperature_max: maxTemps.map(t => t - 1),
      apparent_temperature_min: minTemps.map(t => t - 2),
      sunrise: dailyTimes.map(() => "06:30"),
      sunset: dailyTimes.map(() => "18:30"),
      precipitation_sum: precipSums,
      rain_sum: precipSums.map(p => weatherCodes[precipSums.indexOf(p)] >= 61 && weatherCodes[precipSums.indexOf(p)] <= 67 ? p : 0),
      showers_sum: precipSums.map(p => weatherCodes[precipSums.indexOf(p)] >= 80 && weatherCodes[precipSums.indexOf(p)] <= 82 ? p : 0),
      snowfall_sum: precipSums.map(p => weatherCodes[precipSums.indexOf(p)] >= 71 && weatherCodes[precipSums.indexOf(p)] <= 77 ? p : 0),
      precipitation_hours: precipSums.map(p => p > 0 ? Math.round(Math.random() * 6 + 2) : 0),
      precipitation_probability_max: precipSums.map(p => p > 0 ? Math.round(60 + Math.random() * 40) : Math.round(Math.random() * 30)),
      wind_speed_10m_max: windSpeedMax,
      wind_gusts_10m_max: windSpeedMax.map(w => Math.round(w * 1.6)),
      wind_direction_10m_dominant: windSpeedMax.map(() => Math.round(Math.random() * 360)),
      uv_index_max: uvIndex,
    },
  };
}

/**
 * Search for a city in the database (case-insensitive, partial match)
 */
export function searchCity(cityName: string): CityCoordinates | null {
  const normalizedSearch = cityName.toLowerCase().trim();

  // Exact match first
  if (CITY_DATABASE[normalizedSearch]) {
    return CITY_DATABASE[normalizedSearch];
  }

  // Partial match
  const partialMatch = Object.entries(CITY_DATABASE).find(([key]) =>
    key.includes(normalizedSearch) || normalizedSearch.includes(key)
  );

  return partialMatch ? partialMatch[1] : null;
}
