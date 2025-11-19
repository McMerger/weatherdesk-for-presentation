// theme provider with auto mode
"use client";
import { createContext, useContext, useEffect, useState } from "react";

// just "light", "dark", or "auto" (let time decide)
type ThemeMode = "light" | "dark" | "auto";
interface ThemeContextType { theme: "light" | "dark"; mode: ThemeMode; setMode: (mode: ThemeMode) => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // figure out if it's daytime - 7am-7pm = light, else dark
  const getThemeFromTime = (): "light" | "dark" => { const hour = new Date().getHours(); return hour >= 7 && hour < 19 ? "light" : "dark"; };

  // load saved preference from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme-mode");
    if (saved === "light" || saved === "dark" || saved === "auto") setMode(saved);
    if (saved === "auto" || !saved) setTheme(getThemeFromTime()); else setTheme(saved as "light" | "dark");
  }, []);

  // save mode changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme-mode", mode);
    if (mode === "auto") setTheme(getThemeFromTime()); else setTheme(mode);
  }, [mode]);

  // auto-check time every minute if in auto mode
  useEffect(() => {
    if (mode !== "auto") return;
    const checkTime = () => setTheme(getThemeFromTime());
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  // apply theme class to html
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, mode, setMode }}>{children}</ThemeContext.Provider>;
}

// hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
