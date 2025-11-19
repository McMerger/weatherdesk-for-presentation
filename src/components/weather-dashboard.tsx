// main weather dashboard component
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

// just the basic initial state stuff
const initialState: WeatherState = {
  weatherData: null,
  error: null,
  message: null
};

// show weather or loading stuff
function WeatherResults({ data, isLoading }: { data: WeatherData | null | undefined; isLoading: boolean }) {
  const { preferences } = useUserPreferences();

  // loading state - just show some skeletons
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[280px] w-full rounded-lg" />
        <Skeleton className="h-[320px] w-full rounded-lg" />
      </div>
    );
  }

  // got data? show it
  if (data) {
    return (
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        <CurrentWeatherCard data={data.current} />
        {preferences.showFeelsLike && <FeelsLikeWeather weather={data.current} />}
        <ForecastCard forecast={data.forecast} current={data.current} />
        {preferences.showRecommendations && <WeatherRecommendations weather={data.current} />}
      </div>
    );
  }

  // default welcome screen
  return (
    <Card className="border-dashed glass-card">
      <CardContent className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-96">
        <CloudSun className="w-24 h-24 sm:w-28 sm:h-28 mb-6 text-white/70"/>
        <h3 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow-md mb-3">Welcome to LunaWeather</h3>
        <p className="text-lg sm:text-xl text-white/80 drop-shadow-sm">Enter a city to get the latest weather forecast.</p>
      </CardContent>
    </Card>
  );
}


// main dashboard component
export function WeatherDashboard() {
  const [state, formAction, isPending] = useActionState(getWeather, initialState);
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  const { addFavorite, preferences } = useUserPreferences();
  const initialLoadRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // load last searched city when page loads
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

  // sync loading state with pending
  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isPending]);

  // show error toasts and save last city
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

  // auto refresh timer if enabled
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
    <div className="space-y-8">
      {/* header section */}
      <header className="w-full my-10">
        <div className="flex items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-bold text-white drop-shadow-lg backdrop-blur-sm bg-white/10 dark:bg-black/20 py-5 px-8 rounded-2xl shadow-2xl border border-white/20 inline-block">
              LunaWeather
            </h1>
            <p className="text-white/90 dark:text-white/80 mt-4 ml-2 text-xl sm:text-2xl font-medium drop-shadow-md">Your personal weather station</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <SettingsDialog />
          </div>
        </div>
      </header>

      {/* search bar */}
      <div className="w-full">
        <Card className="glass-card shadow-2xl border-white/30 dark:border-white/10">
          <CardContent className="p-5">
            <form ref={formRef} action={formAction}>
              <div className="flex items-center gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-white/70 dark:text-white/60" />
                  <Input
                    type="text"
                    name="city"
                    placeholder="E.g., London, New York, Tokyo"
                    className="pl-11 text-lg glass-input text-white placeholder:text-white/60 dark:placeholder:text-white/50"
                    required
                  />
                </div>
                <SubmitButton>
                  <Search className="h-6 w-6 md:hidden" />
                  <span className="hidden md:inline text-base">Search</span>
                </SubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* favorites section */}
      <FavoritesTabs
        currentCity={state.weatherData?.current.city || null}
        onCitySelect={handleCitySelect}
        onAddFavorite={handleAddFavorite}
      />

      {/* weather results display */}
      <WeatherResults data={state.weatherData} isLoading={isLoading} />
    </div>
  );
}
