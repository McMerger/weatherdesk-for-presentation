"use client";

import { Sun, Moon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";

// simple toggle button that cycles through: auto -> light -> dark -> auto
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  // click to cycle: auto -> light -> dark -> auto
  const cycleMode = () => {
    if (mode === "auto") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else {
      setMode("auto");
    }
  };

  // pick icon based on current mode
  const Icon = mode === "auto" ? Clock : mode === "light" ? Sun : Moon;

  // tooltip text for user to understand what's active
  const getLabel = () => {
    if (mode === "auto") return "Auto (time-based)";
    if (mode === "light") return "Light mode";
    return "Dark mode";
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleMode}
      className="glass-button text-white border-white/30 hover:border-white/50"
      title={getLabel()}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}
