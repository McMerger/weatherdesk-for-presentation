// current weather display card
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

// main weather card showing current conditions
export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  const { preferences, addFavorite, removeFavorite, isFavorite, favorites } = useUserPreferences();
  const favorite = isFavorite(data.city);

  // format the date nicely
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // convert temps based on user settings
  const displayTemp = convertTemperature(data.temperatureCelsius, "celsius", preferences.temperatureUnit);
  const tempSymbol = getTemperatureSymbol(preferences.temperatureUnit);

  // wind speed conversions - backend gives us m/s
  const windSpeedKmh = data.windSpeedMps * 3.6;
  const displayWindSpeed = convertWindSpeed(windSpeedKmh, "kmh", preferences.windSpeedUnit);
  const windSymbol = getWindSpeedSymbol(preferences.windSpeedUnit);

  // toggle favorite star
  const handleToggleFavorite = () => {
    if (favorite) {
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
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-2">{data.city}</CardTitle>
            <CardDescription className="text-lg sm:text-xl text-white/80 dark:text-white/70">{formattedDate}</CardDescription>
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
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center pt-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
          <div className="flex items-start">
            <span className="text-8xl sm:text-9xl font-bold text-yellow-300 dark:text-yellow-200 drop-shadow-2xl">{displayTemp}</span>
            <span className="text-3xl sm:text-4xl font-medium mt-2 text-white">{tempSymbol}</span>
          </div>
          <p className="text-2xl sm:text-3xl text-white/90 dark:text-white/80 capitalize font-medium mt-2">{data.condition}</p>
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-6">
          <WeatherIcon condition={data.condition} className="w-36 h-36 sm:w-44 sm:h-44 text-white drop-shadow-2xl" />
          <div className="flex space-x-8 text-white/90 dark:text-white/80">
            <div className="flex items-center gap-2">
              <Droplets className="w-7 h-7" />
              <span className="text-lg font-medium">{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-7 h-7" />
              <span className="text-lg font-medium">{displayWindSpeed} {windSymbol}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
