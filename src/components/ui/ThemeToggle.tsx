"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
