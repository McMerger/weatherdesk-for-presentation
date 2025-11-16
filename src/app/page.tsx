import { WeatherDashboard } from "@/components/weather-dashboard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl my-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-white drop-shadow-lg backdrop-blur-sm bg-white/10 dark:bg-black/20 py-4 px-6 rounded-2xl shadow-2xl border border-white/20 inline-block">
          WeatherDesk
        </h1>
        <p className="text-white/90 dark:text-white/80 mt-3 text-lg font-medium drop-shadow-md">Your personal weather station</p>
      </header>
      <main className="w-full max-w-4xl">
        <WeatherDashboard />
      </main>
    </div>
  );
}
