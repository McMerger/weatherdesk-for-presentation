// user settings dialog
"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/contexts/user-preferences-context";

// big settings dialog with all the user preferences
export function SettingsDialog() {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="glass-button text-white border-white/30 hover:border-white/50 h-20 sm:h-24 md:h-28 px-6 sm:px-8 md:px-10 shadow-xl transition-all hover:scale-105"
        >
          <Settings className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/30 dark:border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg flex items-center gap-3 text-2xl sm:text-3xl">
            <Settings className="h-7 w-7 sm:h-8 sm:w-8" />
            Weather Preferences
          </DialogTitle>
          <DialogDescription className="text-white/80 drop-shadow-sm text-base sm:text-lg mt-2">
            Customize how weather information is displayed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* units section */}
          <div className="space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Units
            </h3>

            <div className="space-y-4">
              {/* temp unit picker */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <Label htmlFor="temp-unit" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                  Temperature
                </Label>
                <Select
                  value={preferences.temperatureUnit}
                  onValueChange={(value: "celsius" | "fahrenheit") =>
                    updatePreferences({ temperatureUnit: value })
                  }
                >
                  <SelectTrigger id="temp-unit" className="w-[160px] sm:w-[180px] glass-input text-white border-white/30 text-base h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/30 text-base">
                    <SelectItem value="celsius" className="text-base py-3">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit" className="text-base py-3">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* wind speed unit */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <Label htmlFor="wind-unit" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                  Wind Speed
                </Label>
                <Select
                  value={preferences.windSpeedUnit}
                  onValueChange={(value: "kmh" | "mph" | "ms") =>
                    updatePreferences({ windSpeedUnit: value })
                  }
                >
                  <SelectTrigger id="wind-unit" className="w-[160px] sm:w-[180px] glass-input text-white border-white/30 text-base h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/30 text-base">
                    <SelectItem value="kmh" className="text-base py-3">km/h</SelectItem>
                    <SelectItem value="mph" className="text-base py-3">mph</SelectItem>
                    <SelectItem value="ms" className="text-base py-3">m/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* display toggles */}
          <div className="space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Display Options
            </h3>

            <div className="space-y-4">
              {/* feels like card toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-1">
                  <Label htmlFor="show-feels-like" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                    Show "Feels Like"
                  </Label>
                  <p className="text-sm sm:text-base text-white/60">Display quirky weather descriptions</p>
                </div>
                <Switch
                  id="show-feels-like"
                  checked={preferences.showFeelsLike}
                  onCheckedChange={(checked) =>
                    updatePreferences({ showFeelsLike: checked })
                  }
                  className="scale-125"
                />
              </div>

              {/* recommendations toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-1">
                  <Label htmlFor="show-recommendations" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                    Show Recommendations
                  </Label>
                  <p className="text-sm sm:text-base text-white/60">Display weather advice and tips</p>
                </div>
                <Switch
                  id="show-recommendations"
                  checked={preferences.showRecommendations}
                  onCheckedChange={(checked) =>
                    updatePreferences({ showRecommendations: checked })
                  }
                  className="scale-125"
                />
              </div>

              {/* 24hr time format */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-1">
                  <Label htmlFor="24-hour" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                    24-Hour Time Format
                  </Label>
                  <p className="text-sm sm:text-base text-white/60">Use 24-hour clock instead of AM/PM</p>
                </div>
                <Switch
                  id="24-hour"
                  checked={preferences.use24HourTime}
                  onCheckedChange={(checked) =>
                    updatePreferences({ use24HourTime: checked })
                  }
                  className="scale-125"
                />
              </div>
            </div>
          </div>

          {/* auto refresh stuff */}
          <div className="space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Auto-Refresh
            </h3>

            <div className="space-y-4">
              {/* toggle auto refresh */}
              <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-1">
                  <Label htmlFor="auto-refresh" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                    Auto-Refresh Weather
                  </Label>
                  <p className="text-sm sm:text-base text-white/60">Automatically update weather data</p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={preferences.autoRefresh}
                  onCheckedChange={(checked) =>
                    updatePreferences({ autoRefresh: checked })
                  }
                  className="scale-125"
                />
              </div>

              {/* interval picker - only shows if auto refresh is on */}
              {preferences.autoRefresh && (
                <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                  <Label htmlFor="refresh-interval" className="text-white/90 drop-shadow-sm cursor-pointer text-base sm:text-lg font-medium">
                    Refresh Interval
                  </Label>
                  <Select
                    value={preferences.refreshInterval.toString()}
                    onValueChange={(value) =>
                      updatePreferences({ refreshInterval: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="refresh-interval" className="w-[160px] sm:w-[180px] glass-input text-white border-white/30 text-base h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/30 text-base">
                      <SelectItem value="15" className="text-base py-3">15 minutes</SelectItem>
                      <SelectItem value="30" className="text-base py-3">30 minutes</SelectItem>
                      <SelectItem value="60" className="text-base py-3">1 hour</SelectItem>
                      <SelectItem value="120" className="text-base py-3">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
