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
  const { condition, temperature, humidity, windSpeed } = weather;
  const recommendations: Recommendation[] = [];
  const conditionLower = condition.toLowerCase();

  // PRIORITY 1: SAFETY-CRITICAL CONDITIONS (always show first)
  if (conditionLower.includes("thunderstorm") || conditionLower.includes("thunder")) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Thunderstorm Warning",
      description: "Severe weather! Stay indoors, avoid windows, and unplug electronics. Do not go outside until storm passes.",
      color: "text-red-600",
    });
  }

  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Reduced Visibility",
      description: "Foggy conditions. Drive slowly with headlights on, increase following distance, and avoid unnecessary travel.",
      color: "text-gray-600",
    });
  }

  // PRIORITY 2: COMPREHENSIVE TEMPERATURE COVERAGE (November-appropriate)
  if (temperature < 0) {
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Freezing Conditions",
      description: "Below freezing! Watch for ice on roads. Bundle up in winter coat, gloves, hat, and scarf. Limit outdoor time.",
      color: "text-blue-600",
    });
  } else if (temperature >= 0 && temperature < 4) {
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Very Cold",
      description: "Near freezing temperatures. Wear a heavy coat and layers. Great for ice skating or winter sports if no precipitation.",
      color: "text-blue-500",
    });
  } else if (temperature >= 4 && temperature < 10) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Cool November Weather",
      description: "Typical fall temps. Wear a warm jacket and long sleeves. Perfect for autumn walks, visiting pumpkin patches, or cozy cafes.",
      color: "text-blue-400",
    });
  } else if (temperature >= 10 && temperature < 16) {
    recommendations.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Mild & Pleasant",
      description: "Cool but comfortable. Light jacket recommended. Great for hiking, cycling, or outdoor November activities.",
      color: "text-green-400",
    });
  } else if (temperature >= 16 && temperature < 20) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Perfect Fall Weather",
      description: "Ideal November temperature! Perfect for outdoor activities, farmers markets, or scenic drives to see fall foliage.",
      color: "text-green-500",
    });
  } else if (temperature >= 20 && temperature < 25) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Warm & Comfortable",
      description: "Unseasonably warm for November! Great day for outdoor dining, park visits, or last outdoor activities before winter.",
      color: "text-yellow-500",
    });
  } else if (temperature >= 25 && temperature <= 27) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Warm Day",
      description: "Quite warm for November! Stay hydrated, wear breathable clothing. Perfect for beach visits in warmer regions.",
      color: "text-orange-400",
    });
  } else if (temperature > 27 && temperature <= 30) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Hot Weather",
      description: "Hot for this time of year! Stay hydrated, wear light clothing, and seek shade during midday. Great for swimming.",
      color: "text-orange-500",
    });
  } else if (temperature > 30) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Very Hot",
      description: "Extremely hot! Stay indoors during peak heat, drink plenty of water, and apply sunscreen if going out. Avoid strenuous activity.",
      color: "text-red-500",
    });
  }

  // PRIORITY 3: WEATHER CONDITIONS (comprehensive coverage)
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    const isHeavy = conditionLower.includes("heavy") || conditionLower.includes("moderate");
    recommendations.push({
      icon: <Umbrella className="w-5 h-5" />,
      title: isHeavy ? "Heavy Rain Alert" : "Rainy Day",
      description: isHeavy
        ? "Heavy rain expected. Stay indoors if possible. If driving, reduce speed and use caution on wet roads."
        : "Light rain ahead. Bring an umbrella, wear waterproof shoes, and carry a light rain jacket.",
      color: "text-blue-500",
    });
  } else if (conditionLower.includes("snow")) {
    const isHeavy = conditionLower.includes("heavy") || conditionLower.includes("moderate");
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: isHeavy ? "Heavy Snow Warning" : "Snowy Conditions",
      description: isHeavy
        ? "Heavy snow expected. Avoid travel if possible. Clear walkways and driveways. Stock up on essentials."
        : "Light snow forecast. Drive carefully on slippery roads. Enjoy winter activities like sledding or building snowmen!",
      color: "text-cyan-400",
    });
  } else if (conditionLower.includes("overcast")) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Overcast Skies",
      description: "Gray and cloudy. Good day for indoor activities like museums or shopping. Bring a light jacket for comfort.",
      color: "text-gray-500",
    });
  } else if (conditionLower.includes("partly cloudy") || conditionLower.includes("partial")) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Partly Cloudy",
      description: "Mix of sun and clouds. Perfect November day for outdoor walks, photography, or visiting local attractions.",
      color: "text-gray-400",
    });
  } else if (conditionLower.includes("cloudy")) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Cloudy Day",
      description: "Mostly cloudy skies. Comfortable for outdoor activities without harsh sun. Good for walking tours or sightseeing.",
      color: "text-gray-400",
    });
  } else if (conditionLower.includes("clear") || conditionLower.includes("sun") || conditionLower.includes("mainly clear")) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Clear Skies",
      description: "Beautiful clear day! Perfect for outdoor November activities. Don't forget sunscreen even in fall weather.",
      color: "text-yellow-500",
    });
  }

  // PRIORITY 4: WIND CONDITIONS (enhanced thresholds)
  if (windSpeed > 30) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Very Windy",
      description: "Strong winds! Secure loose items, avoid parking under trees, and be extra careful if driving high-profile vehicles.",
      color: "text-red-500",
    });
  } else if (windSpeed > 20) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Windy Conditions",
      description: "Moderate winds today. Secure outdoor furniture and be cautious when opening car doors. Good for kite flying!",
      color: "text-gray-500",
    });
  }

  // PRIORITY 5: HUMIDITY CONDITIONS (expanded ranges)
  if (humidity > 85) {
    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "Very Humid",
      description: "Extremely muggy conditions. Stay cool, drink extra water, and take frequent breaks if exercising outdoors.",
      color: "text-teal-600",
    });
  } else if (humidity > 70) {
    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "High Humidity",
      description: "It feels humid outside. Wear breathable fabrics, stay hydrated, and seek air-conditioned spaces when needed.",
      color: "text-teal-500",
    });
  } else if (humidity < 30) {
    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "Dry Air",
      description: "Low humidity today. Use moisturizer for skin, drink extra water, and consider using a humidifier indoors.",
      color: "text-amber-500",
    });
  }

  // PRIORITY 6: MULTI-FACTOR COMBINATIONS (context-aware)
  if (temperature < 4 && (conditionLower.includes("rain") || conditionLower.includes("drizzle"))) {
    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "⚠️ Hypothermia Risk",
      description: "Cold and wet conditions! Stay indoors if possible. If outside, wear waterproof layers to prevent hypothermia.",
      color: "text-red-600",
    });
  }

  if (temperature > 27 && humidity > 70) {
    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "⚠️ Heat Index High",
      description: "Hot and humid! Risk of heat exhaustion. Stay in air conditioning, drink water frequently, and avoid midday sun.",
      color: "text-red-500",
    });
  }

  if (windSpeed > 20 && (conditionLower.includes("rain") || conditionLower.includes("snow"))) {
    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Storm Conditions",
      description: "Wind and precipitation combined. Avoid travel if possible. If driving, use extreme caution and reduce speed significantly.",
      color: "text-red-500",
    });
  }

  // PRIORITY 7: Ensure at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Typical November Day",
      description: "Standard fall weather. Check local forecasts for any changes and dress appropriately for seasonal temperatures.",
      color: "text-purple-500",
    });
  }

  // Return top 3 highest priority recommendations
  return recommendations.slice(0, 3);
}

export function WeatherRecommendations({ weather }: WeatherRecommendationsProps) {
  const recommendations = getWeatherRecommendations(weather);

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Weather Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={`mt-0.5 ${rec.color}`}>{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
