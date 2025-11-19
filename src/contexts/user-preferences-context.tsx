// user preferences context
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserPreferences, FavoriteLocation, UserSettings } from "@/lib/types";

// default settings if user hasnt changed anything yet
const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  pressureUnit: "hpa",
  use24HourTime: false,
  showFeelsLike: true,
  showRecommendations: true,
  autoRefresh: false,
  refreshInterval: 30,
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  favorites: FavoriteLocation[];
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addFavorite: (city: string, country?: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (city: string) => boolean;
  clearAllFavorites: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// provider that manages user settings and favorites
export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // load saved settings when app starts
  useEffect(() => {
    try {
      const stored = localStorage.getItem("weatherdesk-settings");
      if (stored) {
        const settings: UserSettings = JSON.parse(stored);
        setPreferences(settings.preferences || DEFAULT_PREFERENCES);
        setFavorites(settings.favorites || []);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // save to localstorage whenever something changes
  useEffect(() => {
    if (!isLoaded) return; // skip first render

    try {
      const settings: UserSettings = {
        preferences,
        favorites,
      };
      localStorage.setItem("weatherdesk-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [preferences, favorites, isLoaded]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const addFavorite = (city: string, country?: string) => {
    const id = `${city}-${Date.now()}`;
    const newFavorite: FavoriteLocation = {
      id,
      city,
      country,
      addedAt: new Date().toISOString(),
    };
    setFavorites((prev) => {
      // dont add duplicates
      const exists = prev.some(
        (fav) => fav.city.toLowerCase() === city.toLowerCase()
      );
      if (exists) return prev;
      return [...prev, newFavorite];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const isFavorite = (city: string): boolean => {
    return favorites.some(
      (fav) => fav.city.toLowerCase() === city.toLowerCase()
    );
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        favorites,
        updatePreferences,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearAllFavorites,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

// hook to access user preferences anywhere
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
}
