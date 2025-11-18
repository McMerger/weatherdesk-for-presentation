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

function getWeatherRecommendations(weather: CurrentWeather): Recommendation[] {
  const { condition, temperatureCelsius, humidity, windSpeedMps } = weather;
  const recommendations: Recommendation[] = [];

  // Convert wind speed from m/s to km/h for comparisons
  const windSpeedKmh = windSpeedMps * 3.6;

  // Temperature-based recommendations (using Celsius)
  if (temperatureCelsius > 27) { // ~80°F
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Stay Cool",
      description: "It's hot outside! Stay hydrated, wear light clothing, and seek shade during peak hours.",
      color: "text-orange-500",
    });
  } else if (temperatureCelsius < 4) { // ~40°F
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Bundle Up",
      description: "It's cold! Dress in layers, wear a warm coat, and don't forget gloves and a hat.",
      color: "text-blue-400",
    });
  } else if (temperatureCelsius >= 15 && temperatureCelsius <= 24) { // ~60-75°F
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Perfect Weather",
      description: "Ideal temperature for outdoor activities! Great day for a walk, jog, or picnic.",
      color: "text-green-500",
    });
  }

  // Condition-based recommendations
  if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("drizzle")) {
    recommendations.push({
      icon: <Umbrella className="w-5 h-5" />,
      title: "Bring an Umbrella",
      description: "Rain is expected. Don't forget your umbrella and wear waterproof shoes.",
      color: "text-blue-500",
    });
  } else if (condition.toLowerCase().includes("snow")) {
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Snow Day",
      description: "Snowy conditions ahead. Drive carefully, clear walkways, and enjoy winter activities!",
      color: "text-cyan-400",
    });
  } else if (condition.toLowerCase().includes("clear") || condition.toLowerCase().includes("sun")) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Sunny Day",
      description: "Clear skies! Perfect for outdoor activities, but don't forget sunscreen.",
      color: "text-yellow-500",
    });
  }

  // Wind-based recommendations (using km/h)
  if (windSpeedKmh > 32) { // ~20 mph
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Windy Conditions",
      description: "Strong winds today. Secure outdoor items and be cautious when driving.",
      color: "text-gray-500",
    });
  }

  // Humidity-based recommendations
  if (humidity > 70) {
    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "High Humidity",
      description: "It feels muggy. Stay cool, drink water, and take breaks if exercising outdoors.",
      color: "text-teal-500",
    });
  }

  // Ensure at least one general recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "General Advice",
      description: "Check the weather conditions before heading out and plan your day accordingly.",
      color: "text-purple-500",
    });
  }

  return recommendations.slice(0, 3); // Return max 3 recommendations
}

export function WeatherRecommendations({ weather }: WeatherRecommendationsProps) {
  const recommendations = getWeatherRecommendations(weather);

  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
          <Lightbulb className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
          Weather Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200"
            >
              <div className={`mt-0.5 ${rec.color} drop-shadow-lg`}>{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1 text-white drop-shadow-md">{rec.title}</h4>
                <p className="text-sm text-white/80 dark:text-white/70 drop-shadow-sm">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
