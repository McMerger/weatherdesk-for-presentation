/**
 * Mock Weather API Route
 * Simulates a real weather API backend for demo purposes
 */

import { NextRequest, NextResponse } from "next/server";
import { generateMockWeatherData } from "@/lib/mock-weather-service";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const latitudeParam = searchParams.get("latitude");
    const longitudeParam = searchParams.get("longitude");

    // Validate parameters
    if (!latitudeParam || !longitudeParam) {
      return NextResponse.json(
        { error: "Missing required parameters: latitude and longitude" },
        { status: 400 }
      );
    }

    const latitude = parseFloat(latitudeParam);
    const longitude = parseFloat(longitudeParam);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude values" },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90, longitude between -180 and 180" },
        { status: 400 }
      );
    }

    // Simulate network delay for realistic experience (200-500ms)
    const delay = Math.random() * 300 + 200;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Determine timezone based on longitude (simplified)
    const timezone = getTimezoneFromCoordinates(latitude, longitude);

    // Generate mock weather data
    const weatherData = generateMockWeatherData(latitude, longitude, timezone);

    // Return successful response
    return NextResponse.json(weatherData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error generating weather data:", error);
    return NextResponse.json(
      { error: "Internal server error while generating weather data" },
      { status: 500 }
    );
  }
}

/**
 * Get timezone from coordinates (simplified mapping)
 */
function getTimezoneFromCoordinates(latitude: number, longitude: number): string {
  // Simplified timezone detection based on longitude
  // In production, you'd use a proper timezone library

  const timezoneOffsetHours = Math.round(longitude / 15);

  // Map to common timezone names
  const timezoneMap: Record<number, string> = {
    "-12": "Pacific/Auckland",
    "-11": "Pacific/Midway",
    "-10": "Pacific/Honolulu",
    "-9": "America/Anchorage",
    "-8": "America/Los_Angeles",
    "-7": "America/Denver",
    "-6": "America/Chicago",
    "-5": "America/New_York",
    "-4": "America/Halifax",
    "-3": "America/Sao_Paulo",
    "-2": "Atlantic/South_Georgia",
    "-1": "Atlantic/Azores",
    "0": "Europe/London",
    "1": "Europe/Paris",
    "2": "Europe/Athens",
    "3": "Africa/Nairobi",
    "4": "Asia/Dubai",
    "5": "Asia/Karachi",
    "6": "Asia/Dhaka",
    "7": "Asia/Bangkok",
    "8": "Asia/Shanghai",
    "9": "Asia/Tokyo",
    "10": "Australia/Sydney",
    "11": "Pacific/Noumea",
    "12": "Pacific/Fiji",
  };

  return timezoneMap[timezoneOffsetHours.toString()] || "UTC";
}
