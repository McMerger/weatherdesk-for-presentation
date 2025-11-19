// weather icon picker component
import { Sun, Cloud, CloudSun, CloudRain, Snowflake, CloudLightning, CloudFog, CloudDrizzle, Cloudy } from 'lucide-react';
import type { ComponentProps } from 'react';

type WeatherIconProps = {
  condition: string;
} & ComponentProps<typeof Sun>;

// picks the right icon based on weather condition
export function WeatherIcon({ condition, ...props }: WeatherIconProps) {
  // just a big switch statement to match conditions
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun {...props} className="text-yellow-400" />;
    case 'clouds':
      return <Cloudy {...props} />;
    case 'few clouds':
      return <CloudSun {...props} />;
    case 'scattered clouds':
      return <Cloud {...props} />;
    case 'broken clouds':
      return <Cloudy {...props} />;
    case 'shower rain':
      return <CloudRain {...props} />;
    case 'rain':
      return <CloudDrizzle {...props} />;
    case 'thunderstorm':
      return <CloudLightning {...props} />;
    case 'snow':
      return <Snowflake {...props} />;
    case 'mist':
      return <CloudFog {...props} />;
    default:
      // fallback if condition doesnt match anything
      return <CloudSun {...props} />;
  }
}
