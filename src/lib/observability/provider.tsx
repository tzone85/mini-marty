"use client";
import { createContext, useContext } from "react";
import type { Logger, ErrorReporter } from "./types";
import { noopLogger, noopReporter } from "./noop";

interface Ctx {
  readonly logger: Logger;
  readonly reporter: ErrorReporter;
}

const ObservabilityContext = createContext<Ctx | null>(null);

const DEFAULT_CTX: Ctx = { logger: noopLogger, reporter: noopReporter };

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
  return useContext(ObservabilityContext) ?? DEFAULT_CTX;
}
