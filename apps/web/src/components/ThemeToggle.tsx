"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to Dark dark:Light Mode`}
      title={`Switch to Dark dark:Light Mode`}
      className={`relative p-2 rounded-xl transition-all duration-200 border flex items-center justify-center bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:shadow-sm ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
