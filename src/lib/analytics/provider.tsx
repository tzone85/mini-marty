"use client";
import { createContext, useContext } from "react";
import type { Analytics } from "./types";

const AnalyticsContext = createContext<Analytics | null>(null);

export function AnalyticsProvider({
  analytics,
  children,
}: {
  readonly analytics: Analytics;
  readonly children: React.ReactNode;
}) {
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): Analytics {
  const a = useContext(AnalyticsContext);
  if (!a) throw new Error("Analytics provider missing");
  return a;
}
