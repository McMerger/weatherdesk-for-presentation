"use client";

import { useActionState, useTransition } from "react";
import { useEffect, useRef, useState } from "react";
import { CloudSun, Search } from "lucide-react";

import { getWeather } from "@/app/actions";
import type { WeatherData, WeatherState } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { useToast } from "@/hooks/use-toast";
import { CurrentWeatherCard } from "./current-weather-card";
import { ForecastCard } from "./forecast-card";
import { WeatherRecommendations } from "./weather-recommendations";
import { FeelsLikeWeather } from "./feels-like-weather";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoritesTabs } from "./favorites-tabs";
import { SettingsDialog } from "./settings-dialog";
import { ThemeToggle } from "./theme-toggle";
import { useUserPreferences } from "@/contexts/user-preferences-context";

const initialState: WeatherState = {
  weatherData: null,
  error: null,
  message: null
};

function WeatherResults({ data, isLoading }: { data: WeatherData | null | undefined; isLoading: boolean }) {
  const { preferences } = useUserPreferences();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[230px] w-full rounded-lg" />
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </div>
    );
  }

  if (data) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <CurrentWeatherCard data={data.current} />
        {preferences.showFeelsLike && <FeelsLikeWeather weather={data.current} />}
        <ForecastCard forecast={data.forecast} current={data.current} />
        {preferences.showRecommendations && <WeatherRecommendations weather={data.current} />}
      </div>
    );
  }

  return (
    <Card className="border-dashed glass-card">
      <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground h-96">
        <CloudSun className="w-16 h-16 mb-4 text-white/70"/>
        <h3 className="text-lg font-semibold text-white drop-shadow-md">Welcome to WeatherDesk</h3>
        <p className="text-white/80 drop-shadow-sm">Enter a city to get the latest weather forecast.</p>
      </CardContent>
    </Card>
  );
}


export function WeatherDashboard() {
  const [state, formAction, isPending] = useActionState(getWeather, initialState);
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  const { addFavorite, preferences } = useUserPreferences();
  const initialLoadRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialLoadRef.current) {
      const lastCity = localStorage.getItem('lastCity');
      if (lastCity) {
        const formData = new FormData();
        formData.append('city', lastCity);
        setIsLoading(true);
        startTransition(() => {
          formAction(formData);
        });
      }
      initialLoadRef.current = false;
    }
  }, [formAction, startTransition]);

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isPending]);

  useEffect(() => {
    if (state.error && !initialLoadRef.current) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
    if (state.weatherData) {
      localStorage.setItem('lastCity', state.weatherData.current.city);
    }
  }, [state, toast]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!preferences.autoRefresh || !state.weatherData) return;

    const intervalMs = preferences.refreshInterval * 60 * 1000;
    const intervalId = setInterval(() => {
      const lastCity = localStorage.getItem('lastCity');
      if (lastCity && formRef.current) {
        const formData = new FormData();
        formData.append('city', lastCity);
        setIsLoading(true);
        startTransition(() => {
          formAction(formData);
        });
      }
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [preferences.autoRefresh, preferences.refreshInterval, state.weatherData, formAction, startTransition]);

  const handleCitySelect = (city: string) => {
    const formData = new FormData();
    formData.append('city', city);
    setIsLoading(true);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleAddFavorite = () => {
    if (state.weatherData) {
      addFavorite(state.weatherData.current.city);
      toast({
        title: "Added to Favorites",
        description: `${state.weatherData.current.city} has been added to your favorites.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings and Search Bar */}
      <div className="flex gap-3">
        <Card className="glass-card shadow-2xl border-white/30 dark:border-white/10 flex-grow">
          <CardContent className="p-4">
            <form ref={formRef} action={formAction}>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70 dark:text-white/60" />
                  <Input
                    type="text"
                    name="city"
                    placeholder="E.g., London, New York, Tokyo"
                    className="pl-10 text-base glass-input text-white placeholder:text-white/60 dark:placeholder:text-white/50"
                    required
                  />
                </div>
                <SubmitButton>
                  <Search className="h-5 w-5 md:hidden" />
                  <span className="hidden md:inline">Search</span>
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
        <ThemeToggle />
        <SettingsDialog />
      </div>

      {/* Favorites Tabs */}
      <FavoritesTabs
        currentCity={state.weatherData?.current.city || null}
        onCitySelect={handleCitySelect}
        onAddFavorite={handleAddFavorite}
      />

      {/* Weather Results */}
      <WeatherResults data={state.weatherData} isLoading={isLoading} />
    </div>
  );
}
