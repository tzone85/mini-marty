"use client";
import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { ObservabilityProvider } from "@/lib/observability/provider";
import { ConsoleLogger } from "@/lib/observability/console-logger";
import { MemoryErrorReporter } from "@/lib/observability/memory-reporter";
import {
  SentryErrorReporter,
  type SentryClient,
} from "@/lib/observability/sentry-reporter";
import { startWebVitals } from "@/lib/observability/web-vitals";
import { AnalyticsProvider } from "@/lib/analytics/provider";
import { NoopAnalytics } from "@/lib/analytics/noop-analytics";
import { VercelAnalytics } from "@/lib/analytics/vercel-analytics";
import { readFlags } from "@/lib/flags";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";
import type { ErrorReporter } from "@/lib/observability/types";

const flags = readFlags(process.env);

const logger = new ConsoleLogger();

function buildReporter(): ErrorReporter {
  if (!flags.sentryEnabled) return new MemoryErrorReporter();
  const sentryClient =
    typeof window !== "undefined"
      ? ((window as unknown as { Sentry?: SentryClient }).Sentry ?? null)
      : null;
  return new SentryErrorReporter(sentryClient);
}

const reporter = buildReporter();

const analytics = flags.analyticsEnabled
  ? new VercelAnalytics((event, props) => {
      if (typeof window !== "undefined") {
        const va = (
          window as unknown as {
            va?: (
              cmd: string,
              name: string,
              props?: Record<string, unknown>,
            ) => void;
          }
        ).va;
        va?.("event", event, props);
      }
    })
  : new NoopAnalytics();

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      startWebVitals(analytics);
    }
  }, []);

  return (
    <ObservabilityProvider logger={logger} reporter={reporter}>
      <AnalyticsProvider analytics={analytics}>
        <ThemeProvider>
          <ErrorBoundary
            reporter={reporter}
            fallback={
              <div role="alert" className="p-8 text-center">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="mt-2">Please reload the page.</p>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </AnalyticsProvider>
    </ObservabilityProvider>
  );
}
