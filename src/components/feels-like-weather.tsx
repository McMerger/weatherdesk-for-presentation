"use client";

import type { CurrentWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Cloud, Flame, Snowflake, Wind, Droplets, Zap } from "lucide-react";
import { useUserPreferences } from "@/contexts/user-preferences-context";
import { convertTemperature, convertWindSpeed, getTemperatureSymbol, getWindSpeedSymbol } from "@/lib/unit-conversions";

type FeelsLikeWeatherProps = {
  weather: CurrentWeather;
};

type FeelsLikeDescription = {
  icon: React.ReactNode;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
};

function getFeelsLikeDescription(weather: CurrentWeather): FeelsLikeDescription {
  const { condition, temperature, humidity, windSpeed } = weather;
  const temp = temperature;

  // Extreme heat combinations
  if (temp > 95 && humidity > 70) {
    return {
      icon: <Flame className="w-6 h-6" />,
      title: "Like a sauna wearing a wool sweater",
      description: "The air is so thick you could spread it on toast. Mother Nature cranked the difficulty slider to 'survival mode.' Even your sweat is sweating.",
      emoji: "🥵",
      gradient: "from-orange-500 to-red-600"
    };
  }

  if (temp > 95) {
    return {
      icon: <Flame className="w-6 h-6" />,
      title: "Like standing inside a pizza oven",
      description: "The sidewalk could double as a griddle. Satan called—he wants his thermostat back. You're not hot, you're medium-rare.",
      emoji: "🔥",
      gradient: "from-red-500 to-orange-600"
    };
  }

  if (temp > 85 && humidity > 70) {
    return {
      icon: <Droplets className="w-6 h-6" />,
      title: "Like swimming through hot soup",
      description: "The air has the consistency of warm Jell-O. It's not just humid, it's aggressively moist. Your clothes are having an identity crisis.",
      emoji: "💦",
      gradient: "from-orange-400 to-amber-500"
    };
  }

  if (temp > 85) {
    return {
      icon: <Flame className="w-6 h-6" />,
      title: "Like a hairdryer on full blast",
      description: "Step outside and instantly understand what popcorn feels like. The sun isn't just shining, it's showing off. Ice cream has a 30-second lifespan.",
      emoji: "☀️",
      gradient: "from-yellow-500 to-orange-500"
    };
  }

  // Pleasant weather
  if (temp >= 65 && temp <= 75 && condition.toLowerCase().includes("clear")) {
    return {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Like nature's perfect thermostat",
      description: "Goldilocks would be jealous. This is the weather that makes you forgive all past weather crimes. Birds are singing your favorite songs. Main character energy.",
      emoji: "✨",
      gradient: "from-green-400 to-blue-500"
    };
  }

  if (temp >= 65 && temp <= 75) {
    return {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Like being inside a perfect dream",
      description: "Mother Nature is showing off her A+ work. Not too hot, not too cold—it's the meteorological sweet spot. Cancel your AC subscription.",
      emoji: "🌟",
      gradient: "from-blue-400 to-green-500"
    };
  }

  // Cold weather
  if (temp < 20 && windSpeed > 15) {
    return {
      icon: <Wind className="w-6 h-6" />,
      title: "Like being slapped by frozen ninjas",
      description: "The wind isn't blowing, it's attacking. Your face is practicing to become an ice sculpture. Jack Frost is personally invested in your suffering.",
      emoji: "🥶",
      gradient: "from-blue-600 to-cyan-700"
    };
  }

  if (temp < 20) {
    return {
      icon: <Snowflake className="w-6 h-6" />,
      title: "Like living in a freezer's freezer",
      description: "Your nose hairs are icicles. Polar bears would complain. The air hurts your face—that's how you know you're alive. Penguins are sending sympathy cards.",
      emoji: "❄️",
      gradient: "from-blue-500 to-indigo-600"
    };
  }

  if (temp < 32 && condition.toLowerCase().includes("snow")) {
    return {
      icon: <Snowflake className="w-6 h-6" />,
      title: "Like being inside a snow globe",
      description: "Nature's confetti is falling, but it's the kind that freezes your eyelashes. The world is a winter wonderland, and you're the unwilling protagonist.",
      emoji: "⛄",
      gradient: "from-cyan-400 to-blue-500"
    };
  }

  if (temp < 40) {
    return {
      icon: <Snowflake className="w-6 h-6" />,
      title: "Like a very aggressive refrigerator",
      description: "Your breath is visible, and it's judging you for coming outside. Every surface is auditioning to become an ice rink. Layer up or become a human popsicle.",
      emoji: "🧊",
      gradient: "from-blue-400 to-cyan-500"
    };
  }

  // Rainy weather
  if (condition.toLowerCase().includes("rain") && windSpeed > 15) {
    return {
      icon: <Cloud className="w-6 h-6" />,
      title: "Like being in a car wash without the car",
      description: "The rain isn't falling, it's attacking horizontally. Umbrellas are decorative at best. The sky is throwing a very wet tantrum.",
      emoji: "🌧️",
      gradient: "from-slate-500 to-gray-600"
    };
  }

  if (condition.toLowerCase().includes("rain")) {
    return {
      icon: <Cloud className="w-6 h-6" />,
      title: "Like the sky is crying... aggressively",
      description: "Mother Nature left the tap running. Your umbrella is a suggestion, not a solution. Ducks are loving this; you probably aren't.",
      emoji: "☔",
      gradient: "from-gray-500 to-blue-600"
    };
  }

  if (condition.toLowerCase().includes("drizzle")) {
    return {
      icon: <Cloud className="w-6 h-6" />,
      title: "Like walking through a cloud's mist",
      description: "Not quite raining, not quite misting—nature's version of 'let me think about it.' Your hair is frizzing in solidarity. The sky is being passive-aggressive.",
      emoji: "🌦️",
      gradient: "from-gray-400 to-slate-500"
    };
  }

  // Stormy weather
  if (condition.toLowerCase().includes("thunder") || condition.toLowerCase().includes("storm")) {
    return {
      icon: <Zap className="w-6 h-6" />,
      title: "Like the sky is having a meltdown",
      description: "Thor is throwing a house party upstairs. Nature's light show with surround sound. The weather app should come with a warning label. Zeus is working overtime.",
      emoji: "⛈️",
      gradient: "from-purple-600 to-indigo-700"
    };
  }

  // Windy conditions
  if (windSpeed > 25) {
    return {
      icon: <Wind className="w-6 h-6" />,
      title: "Like being in nature's wind tunnel",
      description: "The wind is personally invested in ruining your hairstyle. Small objects are achieving flight without permission. Mother Nature is power-washing the neighborhood.",
      emoji: "💨",
      gradient: "from-gray-400 to-slate-600"
    };
  }

  // Cloudy/Overcast
  if (condition.toLowerCase().includes("cloud") || condition.toLowerCase().includes("overcast")) {
    return {
      icon: <Cloud className="w-6 h-6" />,
      title: "Like living inside a mood ring",
      description: "The sky is cosplaying as a gray blanket. Vitamin D is a distant memory. The sun called in sick. Perfect weather for your inner introvert.",
      emoji: "☁️",
      gradient: "from-gray-400 to-slate-500"
    };
  }

  // High humidity
  if (humidity > 80 && temp > 70) {
    return {
      icon: <Droplets className="w-6 h-6" />,
      title: "Like wearing a warm wet towel",
      description: "The air is 90% moisture, 10% questionable. You're not sweating, you're marinating. Fish are jealous of the humidity levels. Breathing requires effort.",
      emoji: "💧",
      gradient: "from-teal-500 to-cyan-600"
    };
  }

  // Moderate conditions (fallback for temp 50-65)
  if (temp >= 50 && temp < 65) {
    return {
      icon: <Cloud className="w-6 h-6" />,
      title: "Like a lukewarm hug from nature",
      description: "Not bad, not great—the Switzerland of weather. Your jacket is playing hard to get. The kind of day that makes you question all your clothing choices.",
      emoji: "😐",
      gradient: "from-slate-400 to-gray-500"
    };
  }

  // Clear/Sunny default
  if (condition.toLowerCase().includes("clear") || condition.toLowerCase().includes("sun")) {
    return {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Like sunshine gave you a high-five",
      description: "The sky is blue, the vibes are immaculate. Mother Nature is in a good mood. Main character walking to their favorite song energy. Sunglasses required.",
      emoji: "😎",
      gradient: "from-yellow-400 to-amber-500"
    };
  }

  // Default fallback
  return {
    icon: <Cloud className="w-6 h-6" />,
    title: "Like... weather is happening",
    description: "Nature is doing its thing. The atmosphere is atmospheric. It's outside. That's about it. The weather is weathering.",
    emoji: "🤷",
    gradient: "from-gray-400 to-slate-500"
  };
}

export function FeelsLikeWeather({ weather }: FeelsLikeWeatherProps) {
  const { preferences } = useUserPreferences();
  const feelsLike = getFeelsLikeDescription(weather);

  // Convert temperature (data is stored in Celsius)
  const displayTemp = convertTemperature(weather.temperature, "celsius", preferences.temperatureUnit);
  const tempSymbol = getTemperatureSymbol(preferences.temperatureUnit);

  // Convert wind speed (data is stored in km/h)
  const displayWindSpeed = convertWindSpeed(weather.windSpeed, "kmh", preferences.windSpeedUnit);
  const windSymbol = getWindSpeedSymbol(preferences.windSpeedUnit);

  return (
    <Card className="w-full glass-card shadow-2xl border-white/30 dark:border-white/10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${feelsLike.gradient} opacity-10`} />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-white drop-shadow-lg">
          <span className="text-3xl">{feelsLike.emoji}</span>
          <span>Feels like...</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`mt-1 text-white/90 drop-shadow-lg bg-gradient-to-br ${feelsLike.gradient} p-2 rounded-lg`}>
              {feelsLike.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-white drop-shadow-md">
                {feelsLike.title}
              </h3>
              <p className="text-white/90 dark:text-white/80 leading-relaxed drop-shadow-sm">
                {feelsLike.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Temp</p>
              <p className="text-lg font-bold text-white drop-shadow-md">{displayTemp}{tempSymbol}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Humidity</p>
              <p className="text-lg font-bold text-white drop-shadow-md">{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Wind</p>
              <p className="text-lg font-bold text-white drop-shadow-md">{displayWindSpeed} {windSymbol}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
