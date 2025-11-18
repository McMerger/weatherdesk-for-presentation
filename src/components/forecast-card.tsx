import type { DailyForecast, CurrentWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./weather-icon";
import { Rating } from "./rating";
import { Separator } from "./ui/separator";

type ForecastCardProps = {
  forecast: DailyForecast[];
  current: CurrentWeather;
};

function ForecastItem({ day, condition, high, low }: DailyForecast) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-lg text-center hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200">
      <p className="font-semibold text-sm text-white drop-shadow-md">{day.substring(0, 3)}</p>
      <WeatherIcon condition={condition} className="w-10 h-10 text-white drop-shadow-lg" />
      <div className="flex gap-2 text-sm">
        <span className="font-bold text-white drop-shadow-md">{high}°</span>
        <span className="text-white/70 drop-shadow-sm">{low}°</span>
      </div>
    </div>
  );
}

export function ForecastCard({ forecast, current }: ForecastCardProps) {
  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <CardTitle className="text-white drop-shadow-lg">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {forecast.map((dayForecast) => (
            <ForecastItem key={dayForecast.day} {...dayForecast} />
          ))}
        </div>
        <Separator className="my-6 bg-white/20" />
        <Rating city={current.city} />
      </CardContent>
    </Card>
  );
}
