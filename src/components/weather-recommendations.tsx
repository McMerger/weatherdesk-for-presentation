// weather recommendations based on conditions
import type { CurrentWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Umbrella, Sun, Snowflake, Wind, Droplets } from "lucide-react";

type WeatherRecommendationsProps = {
  weather: CurrentWeather;
};

type Recommendation = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

// give some recommendations based on weather
function getWeatherRecommendations(weather: CurrentWeather): Recommendation[] {
  const { condition, temperatureCelsius, humidity, windSpeedMps } = weather;
  const recommendations: Recommendation[] = [];

  const windSpeedKmh = windSpeedMps * 3.6;
  const conditionUpper = condition.toUpperCase();

  // temperature recommendations - always add one
  if (temperatureCelsius > 27) {
    recommendations.push({
      icon: <Sun className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Stay Cool",
      description: "It's hot outside! Stay hydrated, wear light clothing, and seek shade during peak hours.",
      color: "text-orange-500",
    });
  } else if (temperatureCelsius < 4) { // cold
    recommendations.push({
      icon: <Snowflake className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Bundle Up",
      description: "It's cold! Dress in layers, wear a warm coat, and don't forget gloves and a hat.",
      color: "text-blue-400",
    });
  } else if (temperatureCelsius >= 15 && temperatureCelsius <= 24) { // perfect
    recommendations.push({
      icon: <Sun className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Perfect Weather",
      description: "Ideal temperature for outdoor activities! Great day for a walk, jog, or picnic.",
      color: "text-green-500",
    });
  } else {
    // moderate temps (4-15°C or 24-27°C)
    recommendations.push({
      icon: <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Moderate Temperature",
      description: "Comfortable conditions. A light jacket might be useful depending on the time of day.",
      color: "text-blue-500",
    });
  }

  // weather condition recommendations
  if (conditionUpper.includes("RAIN") || conditionUpper.includes("SHOWER") || conditionUpper.includes("DRIZZLE")) {
    recommendations.push({
      icon: <Umbrella className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Bring an Umbrella",
      description: "Rain is expected. Don't forget your umbrella and wear waterproof shoes.",
      color: "text-blue-500",
    });
  } else if (conditionUpper.includes("SNOW")) {
    recommendations.push({
      icon: <Snowflake className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Snow Day",
      description: "Snowy conditions ahead. Drive carefully, clear walkways, and enjoy winter activities!",
      color: "text-cyan-400",
    });
  } else if (conditionUpper.includes("CLEAR")) {
    recommendations.push({
      icon: <Sun className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Clear Skies",
      description: "Clear skies! Perfect for outdoor activities, but don't forget sunscreen.",
      color: "text-yellow-500",
    });
  } else if (conditionUpper.includes("CLOUD")) {
    recommendations.push({
      icon: <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Cloudy Skies",
      description: "Overcast conditions. Good for outdoor activities without harsh sun exposure.",
      color: "text-gray-400",
    });
  } else if (conditionUpper.includes("THUNDER") || conditionUpper.includes("STORM")) {
    recommendations.push({
      icon: <Umbrella className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Thunderstorm Alert",
      description: "Thunderstorms expected. Stay indoors, avoid open areas, and postpone outdoor activities.",
      color: "text-purple-600",
    });
  } else if (conditionUpper.includes("MIST") || conditionUpper.includes("FOG")) {
    recommendations.push({
      icon: <Droplets className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Reduced Visibility",
      description: "Misty or foggy conditions. Drive carefully with headlights on and allow extra time.",
      color: "text-gray-500",
    });
  }

  // windy conditions
  if (windSpeedKmh > 32) {
    recommendations.push({
      icon: <Wind className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Windy Conditions",
      description: "Strong winds today. Secure outdoor items and be cautious when driving.",
      color: "text-gray-500",
    });
  }

  // humid conditions
  if (humidity > 70 && temperatureCelsius > 15) {
    recommendations.push({
      icon: <Droplets className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "High Humidity",
      description: "It feels muggy. Stay cool, drink water, and take breaks if exercising outdoors.",
      color: "text-teal-500",
    });
  }

  // always return at least 2-3 recommendations
  return recommendations.slice(0, 3);
}

export function WeatherRecommendations({ weather }: WeatherRecommendationsProps) {
  const recommendations = getWeatherRecommendations(weather);

  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl text-white drop-shadow-lg">
          <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-lg" />
          Weather Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200"
            >
              <div className={`mt-1 ${rec.color} drop-shadow-lg`}>{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg sm:text-xl mb-2 text-white drop-shadow-md">{rec.title}</h4>
                <p className="text-base sm:text-lg text-white/80 dark:text-white/70 drop-shadow-sm">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
