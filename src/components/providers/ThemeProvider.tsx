"use client";

import { useEffect, useState } from "react";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");

  // Calculate if it's currently nighttime based on coordinates
  const isNightTime = (lat: number, lon: number): boolean => {
    const now = new Date();
    const hours = now.getHours();
    
    // Simple approximation: calculate sunset/sunrise times
    // This uses a simplified calculation based on latitude
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const latRad = (lat * Math.PI) / 180;
    
    // Solar declination
    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
    const declinationRad = (declination * Math.PI) / 180;
    
    // Hour angle for sunrise/sunset
    const cosHourAngle = -Math.tan(latRad) * Math.tan(declinationRad);
    
    // Check if there's a normal day/night cycle at this location
    if (cosHourAngle < -1 || cosHourAngle > 1) {
      // Polar day or polar night
      return cosHourAngle > 1; // If > 1, it's polar night
    }
    
    const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);
    const sunriseHour = 12 - hourAngle / 15;
    const sunsetHour = 12 + hourAngle / 15;
    
    // Add longitude offset for local time
    const timeOffset = lon / 15; // 15 degrees per hour
    const localSunrise = sunriseHour + timeOffset;
    const localSunset = sunsetHour + timeOffset;
    
    return hours < localSunrise || hours >= localSunset;
  };

  // Request geolocation and set theme based on time
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    // Check if we already have permission
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state as "granted" | "denied" | "prompt");
        
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const isDark = isNightTime(position.coords.latitude, position.coords.longitude);
              setTheme(isDark ? "dark" : "light");
            },
            () => {
              // Fallback to system time if geolocation fails
              const hours = new Date().getHours();
              setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
            }
          );
        } else if (result.state === "prompt") {
          // Request permission
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission("granted");
              const isDark = isNightTime(position.coords.latitude, position.coords.longitude);
              setTheme(isDark ? "dark" : "light");
            },
            () => {
              setLocationPermission("denied");
              // Fallback to system time
              const hours = new Date().getHours();
              setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
            }
          );
        } else {
          // Permission denied, use fallback
          const hours = new Date().getHours();
          setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
        }
      });
    } else {
      // No permissions API, just request
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const isDark = isNightTime(position.coords.latitude, position.coords.longitude);
          setTheme(isDark ? "dark" : "light");
        },
        () => {
          // Fallback to system time
          const hours = new Date().getHours();
          setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
        }
      );
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  // Update theme every minute to check for sunrise/sunset changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (locationPermission === "granted" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const isDark = isNightTime(position.coords.latitude, position.coords.longitude);
            setTheme(isDark ? "dark" : "light");
          },
          () => {
            // Fallback to system time
            const hours = new Date().getHours();
            setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
          }
        );
      } else {
        // Fallback to system time
        const hours = new Date().getHours();
        setTheme(hours < 6 || hours >= 18 ? "dark" : "light");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [locationPermission]);

  return <>{children}</>;
}
