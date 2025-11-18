"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CurrentWeather } from "@/lib/types";
import { WeatherIcon } from "@/components/weather-icon";
import { Wind, Droplets, Star } from "lucide-react";
import { useUserPreferences } from "@/contexts/user-preferences-context";
import { convertTemperature, convertWindSpeed, getTemperatureSymbol, getWindSpeedSymbol } from "@/lib/unit-conversions";
import { Button } from "@/components/ui/button";

type CurrentWeatherCardProps = {
  data: CurrentWeather;
};

export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  const { preferences, addFavorite, removeFavorite, isFavorite, favorites } = useUserPreferences();
  const favorite = isFavorite(data.city);

  // Format date from ISO string
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Convert temperature from Celsius (backend data) to user preference
  const displayTemp = convertTemperature(data.temperatureCelsius, "celsius", preferences.temperatureUnit);
  const tempSymbol = getTemperatureSymbol(preferences.temperatureUnit);

  // Convert wind speed from m/s (backend data) to user preference
  const windSpeedKmh = data.windSpeedMps * 3.6; // Convert m/s to km/h first
  const displayWindSpeed = convertWindSpeed(windSpeedKmh, "kmh", preferences.windSpeedUnit);
  const windSymbol = getWindSpeedSymbol(preferences.windSpeedUnit);

  const handleToggleFavorite = () => {
    if (favorite) {
      // Find the favorite to remove
      const favToRemove = favorites.find(
        (fav) => fav.city.toLowerCase() === data.city.toLowerCase()
      );
      if (favToRemove) {
        removeFavorite(favToRemove.id);
      }
    } else {
      addFavorite(data.city);
    }
  };

  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">{data.city}</CardTitle>
            <CardDescription className="text-white/80 dark:text-white/70">{formattedDate}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="hover:bg-white/10 transition-colors"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                favorite
                  ? "text-yellow-300 fill-yellow-300"
                  : "text-white/50 hover:text-white/70"
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl font-bold text-yellow-300 dark:text-yellow-200 drop-shadow-2xl">{displayTemp}</span>
            <span className="text-2xl sm:text-3xl font-medium mt-2 text-white">{tempSymbol}</span>
          </div>
          <p className="text-xl text-white/90 dark:text-white/80 capitalize font-medium">{data.condition}</p>
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-4">
          <WeatherIcon condition={data.condition} className="w-24 h-24 sm:w-32 sm:h-32 text-white drop-shadow-2xl" />
          <div className="flex space-x-6 text-white/90 dark:text-white/80">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              <span>{displayWindSpeed} {windSymbol}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
