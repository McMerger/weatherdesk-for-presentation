// favorites tabs for saved cities
"use client";

import { useState } from "react";
import { Star, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/contexts/user-preferences-context";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FavoritesTabsProps {
  currentCity: string | null;
  onCitySelect: (city: string) => void;
  onAddFavorite?: () => void;
}

// shows favorite cities as clickable tabs
export function FavoritesTabs({ currentCity, onCitySelect, onAddFavorite }: FavoritesTabsProps) {
  const { favorites, removeFavorite, isFavorite, clearAllFavorites } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<string | null>(currentCity);

  const handleTabClick = (city: string) => {
    setActiveTab(city);
    onCitySelect(city);
  };

  const handleRemove = (e: React.MouseEvent, id: string, city: string) => {
    e.stopPropagation();
    removeFavorite(id);
    if (activeTab === city) {
      setActiveTab(null);
    }
  };

  // show empty state if no favorites yet
  if (favorites.length === 0) {
    return (
      <div className="glass-card p-6 text-center border-white/30 dark:border-white/10">
        <Star className="w-12 h-12 mx-auto mb-3 text-white/50" />
        <h3 className="text-white font-semibold mb-2 drop-shadow-md">No Favorite Locations</h3>
        <p className="text-white/70 text-sm mb-4 drop-shadow-sm">
          Search for a city and click the star icon to add it to your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
          <h3 className="text-white font-semibold drop-shadow-md">Favorite Locations</h3>
          <Badge variant="secondary" className="glass-button border-white/20">
            {favorites.length}
          </Badge>
        </div>
        {favorites.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-white/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white drop-shadow-md">
                  Clear All Favorites?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white/80 drop-shadow-sm">
                  This will remove all {favorites.length} favorite location{favorites.length > 1 ? 's' : ''} from your list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="glass-button text-white border-white/30">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAllFavorites}
                  className="bg-red-500/80 hover:bg-red-600/80 text-white"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map((favorite) => {
          const isActive = activeTab === favorite.city || currentCity === favorite.city;
          return (
            <button
              key={favorite.id}
              onClick={() => handleTabClick(favorite.city)}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all duration-200 ${
                isActive
                  ? "bg-white/30 dark:bg-black/40 border-white/50 dark:border-white/30 shadow-lg"
                  : "bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30"
              }`}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? "text-yellow-300 fill-yellow-300"
                    : "text-white/60 fill-white/60"
                }`}
              />
              <span className="text-white font-medium drop-shadow-md">
                {favorite.city}
              </span>
              {favorite.country && (
                <span className="text-white/60 text-xs drop-shadow-sm">
                  {favorite.country}
                </span>
              )}
              <button
                onClick={(e) => handleRemove(e, favorite.id, favorite.city)}
                className="ml-1 p-1 rounded-full hover:bg-red-500/50 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${favorite.city} from favorites`}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </button>
          );
        })}

        {onAddFavorite && currentCity && !isFavorite(currentCity) && (
          <button
            onClick={onAddFavorite}
            className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md bg-white/10 dark:bg-black/20 border border-dashed border-white/30 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4 text-white/70" />
            <span className="text-white/70 font-medium text-sm">Add Current</span>
          </button>
        )}
      </div>
    </div>
  );
}
