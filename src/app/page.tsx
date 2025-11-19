// home page - main entry point
import { WeatherDashboard } from "@/components/weather-dashboard";

// home page - just shows the dashboard
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 text-foreground p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-6xl">
        <WeatherDashboard />
      </main>
    </div>
  );
}
