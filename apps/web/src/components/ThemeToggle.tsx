"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={`relative p-2 rounded-xl transition-all duration-200 border flex items-center justify-center ${
        isDark
          ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300 hover:bg-zinc-800 hover:border-zinc-700 shadow-sm"
          : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 shadow-sm"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
