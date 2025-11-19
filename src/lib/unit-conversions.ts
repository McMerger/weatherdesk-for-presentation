// temperature and wind unit conversions
import type { TemperatureUnit, WindSpeedUnit } from "./types";

// temp conversions
export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit
): number {
  if (from === to) return Math.round(value);

  // celsius to fahrenheit
  if (from === "celsius" && to === "fahrenheit") {
    return Math.round((value * 9) / 5 + 32);
  }

  // fahrenheit to celsius
  if (from === "fahrenheit" && to === "celsius") {
    return Math.round(((value - 32) * 5) / 9);
  }

  return Math.round(value);
}

// wind speed conversions
export function convertWindSpeed(
  value: number,
  from: WindSpeedUnit,
  to: WindSpeedUnit
): number {
  if (from === to) return Math.round(value);

  let kmh: number;

  // convert everything to km/h first
  switch (from) {
    case "kmh":
      kmh = value;
      break;
    case "mph":
      kmh = value * 1.60934;
      break;
    case "ms":
      kmh = value * 3.6;
      break;
  }

  // then convert to target unit
  switch (to) {
    case "kmh":
      return Math.round(kmh);
    case "mph":
      return Math.round(kmh / 1.60934);
    case "ms":
      return Math.round(kmh / 3.6);
    default:
      return Math.round(kmh);
  }
}

export function getTemperatureSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function getWindSpeedSymbol(unit: WindSpeedUnit): string {
  switch (unit) {
    case "kmh":
      return "km/h";
    case "mph":
      return "mph";
    case "ms":
      return "m/s";
  }
}
