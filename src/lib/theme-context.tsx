"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createSafeStorage } from "@/lib/storage/safe-storage";
import { migrateInPlaceIfRaw } from "@/lib/storage/migrate";
import { ThemeSchema, type Theme } from "@/lib/schemas/theme";

interface ThemeContextValue {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
}
const STORAGE_KEY = "mini-marty-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

const themeStorage = createSafeStorage(STORAGE_KEY, ThemeSchema);

function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  // One-time migration: legacy versions stored "dark" / "light" as a
  // bare string. Re-encode to JSON so the schema parses cleanly.
  migrateInPlaceIfRaw(window.localStorage, STORAGE_KEY, isTheme, (raw) => raw);
  const stored = themeStorage.get();
  if (stored !== null) return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      themeStorage.set(next);
      return next;
    });
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
