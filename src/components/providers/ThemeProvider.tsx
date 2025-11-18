"use client";

import { createContext, useContext, useEffect, useState } from "react";

// just "light", "dark", or "auto" (let time decide)
type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: "light" | "dark"; // actual applied theme
  mode: ThemeMode; // what the user picked (or auto)
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // default to dark mode - users can manually switch
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // figure out if it's daytime based on local clock
  // simple: 7am-7pm = light, everything else = dark
  const getThemeFromTime = (): "light" | "dark" => {
    const hour = new Date().getHours();
    // daytime hours: 7 (7am) through 18 (6pm) - light mode
    // everything else (19-6) - dark mode
    return hour >= 7 && hour < 19 ? "light" : "dark";
  };

  // load saved preference from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("theme-mode");
    if (saved === "light" || saved === "dark" || saved === "auto") {
      setMode(saved);
    }

    // set initial theme based on mode
    if (saved === "auto" || !saved) {
      setTheme(getThemeFromTime());
    } else {
      setTheme(saved as "light" | "dark");
    }
  }, []);

  // when mode changes, save to localStorage and update theme
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("theme-mode", mode);

    if (mode === "auto") {
      // use time-based theme
      setTheme(getThemeFromTime());
    } else {
      // use whatever they picked manually
      setTheme(mode);
    }
  }, [mode]);

  // auto-check time every minute if in auto mode
  // so theme updates when crossing 7am or 7pm
  useEffect(() => {
    if (mode !== "auto") return; // skip if manually set

    const checkTime = () => {
      const newTheme = getThemeFromTime();
      setTheme(newTheme);
    };

    // check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  // apply theme class to html element
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
