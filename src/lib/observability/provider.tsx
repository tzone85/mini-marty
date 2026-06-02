"use client";
import { createContext, useContext } from "react";
import type { Logger, ErrorReporter } from "./types";

interface Ctx {
  readonly logger: Logger;
  readonly reporter: ErrorReporter;
}

const ObservabilityContext = createContext<Ctx | null>(null);

export function ObservabilityProvider({
  logger,
  reporter,
  children,
}: {
  readonly logger: Logger;
  readonly reporter: ErrorReporter;
  readonly children: React.ReactNode;
}) {
  return (
    <ObservabilityContext.Provider value={{ logger, reporter }}>
      {children}
    </ObservabilityContext.Provider>
  );
}

export function useObservability(): Ctx {
  const ctx = useContext(ObservabilityContext);
  if (!ctx) {
    throw new Error("Observability provider missing — wrap your app");
  }
  return ctx;
}
