// theme toggle button
"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";

// just a button to switch between light/dark mode
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  // toggle between modes
  const cycleMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  // show sun in light mode, moon in dark mode
  const Icon = mode === "light" ? Sun : Moon;

  const getLabel = () => {
    if (mode === "light") return "Light mode";
    return "Dark mode";
  };

  return (
    <Button
      variant="outline"
      onClick={cycleMode}
      className="glass-button text-white border-white/30 hover:border-white/50 h-20 sm:h-24 md:h-28 px-6 sm:px-8 md:px-10 shadow-xl transition-all hover:scale-105"
      title={getLabel()}
    >
      <Icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" />
    </Button>
  );
}
