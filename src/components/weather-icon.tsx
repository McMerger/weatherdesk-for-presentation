import { Sun, Cloud, CloudSun, CloudRain, Snowflake, CloudLightning, CloudFog, CloudDrizzle, Cloudy } from 'lucide-react';
import type { ComponentProps } from 'react';

type WeatherIconProps = {
  condition: string;
} & ComponentProps<typeof Sun>;

export function WeatherIcon({ condition, ...props }: WeatherIconProps) {
  const lowerCondition = condition.toLowerCase();

  // Check for specific weather conditions using substring matching
  // Order matters: check most specific conditions first
  if (lowerCondition.includes('thunderstorm') || lowerCondition.includes('lightning')) {
    return <CloudLightning {...props} />;
  }
  if (lowerCondition.includes('snow')) {
    return <Snowflake {...props} />;
  }
  if (lowerCondition.includes('drizzle')) {
    return <CloudDrizzle {...props} />;
  }
  if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
    return <CloudRain {...props} />;
  }
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
    return <CloudFog {...props} />;
  }
  if (lowerCondition.includes('overcast') || lowerCondition.includes('broken')) {
    return <Cloudy {...props} />;
  }
  if (lowerCondition.includes('partly') || lowerCondition.includes('scattered') || lowerCondition.includes('few')) {
    return <CloudSun {...props} />;
  }
  if (lowerCondition.includes('cloud')) {
    return <Cloud {...props} />;
  }
  if (lowerCondition.includes('clear') || lowerCondition.includes('sun') || lowerCondition.includes('mainly clear')) {
    return <Sun {...props} className="text-yellow-400" />;
  }

  // Default fallback
  return <CloudSun {...props} />;
}
