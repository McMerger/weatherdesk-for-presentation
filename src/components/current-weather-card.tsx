import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CurrentWeather } from "@/lib/types";
import { WeatherIcon } from "@/components/weather-icon";
import { Wind, Droplets } from "lucide-react";

type CurrentWeatherCardProps = {
  data: CurrentWeather;
};

export function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">{data.city}</CardTitle>
        <CardDescription className="text-white/80 dark:text-white/70">{data.date}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl font-bold text-yellow-300 dark:text-yellow-200 drop-shadow-2xl">{data.temperature}</span>
            <span className="text-2xl sm:text-3xl font-medium mt-2 text-white">°C</span>
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
              <span>{data.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
