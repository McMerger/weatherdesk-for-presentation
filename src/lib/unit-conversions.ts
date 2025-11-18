import type { TemperatureUnit, WindSpeedUnit } from "./types";

/**
 * Convert temperature between units
 */
export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return Math.round(value);

  if (from === "celsius" && to === "fahrenheit") {
    return Math.round((value * 9/5) + 32);
  }

  if (from === "fahrenheit" && to === "celsius") {
    return Math.round((value - 32) * 5/9);
  }

  return Math.round(value);
}

/**
 * Convert wind speed between units
 */
export function convertWindSpeed(value: number, from: WindSpeedUnit, to: WindSpeedUnit): number {
  if (from === to) return Math.round(value);

  // Convert to m/s first (base unit)
  let inMs: number;
  switch (from) {
    case "kmh":
      inMs = value / 3.6;
      break;
    case "mph":
      inMs = value / 2.237;
      break;
    case "ms":
      inMs = value;
      break;
    default:
      inMs = value;
  }

  // Convert from m/s to target unit
  switch (to) {
    case "kmh":
      return Math.round(inMs * 3.6);
    case "mph":
      return Math.round(inMs * 2.237);
    case "ms":
      return Math.round(inMs);
    default:
      return Math.round(inMs);
  }
}

/**
 * Get temperature unit symbol
 */
export function getTemperatureSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

/**
 * Get wind speed unit symbol
 */
export function getWindSpeedSymbol(unit: WindSpeedUnit): string {
  switch (unit) {
    case "kmh":
      return "km/h";
    case "mph":
      return "mph";
    case "ms":
      return "m/s";
    default:
      return "km/h";
  }
}

/**
 * Format temperature with unit
 */
export function formatTemperature(value: number, unit: TemperatureUnit): string {
  return `${value}${getTemperatureSymbol(unit)}`;
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(value: number, unit: WindSpeedUnit): string {
  return `${value} ${getWindSpeedSymbol(unit)}`;
}
