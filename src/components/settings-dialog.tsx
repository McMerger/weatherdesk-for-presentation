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

export function SettingsDialog() {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass-button text-white border-white/30 hover:border-white/50"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/30 dark:border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Weather Preferences
          </DialogTitle>
          <DialogDescription className="text-white/80 drop-shadow-sm">
            Customize how weather information is displayed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Units Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Units
            </h3>

            <div className="space-y-3">
              {/* Temperature Unit */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <Label htmlFor="temp-unit" className="text-white/90 drop-shadow-sm cursor-pointer">
                  Temperature
                </Label>
                <Select
                  value={preferences.temperatureUnit}
                  onValueChange={(value: "celsius" | "fahrenheit") =>
                    updatePreferences({ temperatureUnit: value })
                  }
                >
                  <SelectTrigger id="temp-unit" className="w-[140px] glass-input text-white border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/30">
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wind Speed Unit */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <Label htmlFor="wind-unit" className="text-white/90 drop-shadow-sm cursor-pointer">
                  Wind Speed
                </Label>
                <Select
                  value={preferences.windSpeedUnit}
                  onValueChange={(value: "kmh" | "mph" | "ms") =>
                    updatePreferences({ windSpeedUnit: value })
                  }
                >
                  <SelectTrigger id="wind-unit" className="w-[140px] glass-input text-white border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/30">
                    <SelectItem value="kmh">km/h</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                    <SelectItem value="ms">m/s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Display Options Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Display Options
            </h3>

            <div className="space-y-3">
              {/* Show Feels Like */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-0.5">
                  <Label htmlFor="show-feels-like" className="text-white/90 drop-shadow-sm cursor-pointer">
                    Show "Feels Like"
                  </Label>
                  <p className="text-xs text-white/60">Display quirky weather descriptions</p>
                </div>
                <Switch
                  id="show-feels-like"
                  checked={preferences.showFeelsLike}
                  onCheckedChange={(checked) =>
                    updatePreferences({ showFeelsLike: checked })
                  }
                />
              </div>

              {/* Show Recommendations */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-0.5">
                  <Label htmlFor="show-recommendations" className="text-white/90 drop-shadow-sm cursor-pointer">
                    Show Recommendations
                  </Label>
                  <p className="text-xs text-white/60">Display weather advice and tips</p>
                </div>
                <Switch
                  id="show-recommendations"
                  checked={preferences.showRecommendations}
                  onCheckedChange={(checked) =>
                    updatePreferences({ showRecommendations: checked })
                  }
                />
              </div>

              {/* 24-Hour Time */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-0.5">
                  <Label htmlFor="24-hour" className="text-white/90 drop-shadow-sm cursor-pointer">
                    24-Hour Time Format
                  </Label>
                  <p className="text-xs text-white/60">Use 24-hour clock instead of AM/PM</p>
                </div>
                <Switch
                  id="24-hour"
                  checked={preferences.use24HourTime}
                  onCheckedChange={(checked) =>
                    updatePreferences({ use24HourTime: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Auto-Refresh Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white drop-shadow-md uppercase tracking-wide">
              Auto-Refresh
            </h3>

            <div className="space-y-3">
              {/* Auto-Refresh Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh" className="text-white/90 drop-shadow-sm cursor-pointer">
                    Auto-Refresh Weather
                  </Label>
                  <p className="text-xs text-white/60">Automatically update weather data</p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={preferences.autoRefresh}
                  onCheckedChange={(checked) =>
                    updatePreferences({ autoRefresh: checked })
                  }
                />
              </div>

              {/* Refresh Interval */}
              {preferences.autoRefresh && (
                <div className="flex items-center justify-between p-3 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
                  <Label htmlFor="refresh-interval" className="text-white/90 drop-shadow-sm cursor-pointer">
                    Refresh Interval
                  </Label>
                  <Select
                    value={preferences.refreshInterval.toString()}
                    onValueChange={(value) =>
                      updatePreferences({ refreshInterval: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="refresh-interval" className="w-[140px] glass-input text-white border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/30">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
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
