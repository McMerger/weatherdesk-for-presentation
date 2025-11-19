// forecast card showing daily weather
"use client";

import type { DailyForecast, CurrentWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./weather-icon";
import { Rating } from "./rating";
import { Separator } from "./ui/separator";
import { useUserPreferences } from "@/contexts/user-preferences-context";
import { convertTemperature } from "@/lib/unit-conversions";

type ForecastCardProps = {
  forecast: DailyForecast[];
  current: CurrentWeather;
};

// single forecast day item
function ForecastItem({ date, condition, highTempCelsius, lowTempCelsius }: DailyForecast) {
  const { preferences } = useUserPreferences();

  // get day name like "Mon" "Tue" etc
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

  // temps in whatever unit user wants
  const displayHigh = convertTemperature(highTempCelsius, "celsius", preferences.temperatureUnit);
  const displayLow = convertTemperature(lowTempCelsius, "celsius", preferences.temperatureUnit);

  return (
    <div className="flex flex-col items-center gap-3 p-4 backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-lg text-center hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200">
      <p className="font-semibold text-base sm:text-lg text-white drop-shadow-md">{dayName}</p>
      <WeatherIcon condition={condition} className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
      <div className="flex gap-2 text-base sm:text-lg">
        <span className="font-bold text-white drop-shadow-md">{displayHigh}°</span>
        <span className="text-white/70 drop-shadow-sm">{displayLow}°</span>
      </div>
    </div>
  );
}

// 5 day forecast card
export function ForecastCard({ forecast, current }: ForecastCardProps) {
  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl text-white drop-shadow-lg">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {forecast.map((dayForecast) => (
            <ForecastItem key={dayForecast.date} {...dayForecast} />
          ))}
        </div>
        <Separator className="my-6 bg-white/20" />
        <Rating city={current.city} />
      </CardContent>
    </Card>
  );
}
