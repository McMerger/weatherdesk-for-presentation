// utility to merge tailwind classes
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// combine tailwind classes - handles conflicts and stuff
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
