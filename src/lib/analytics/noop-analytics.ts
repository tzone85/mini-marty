import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

/**
 * No-op analytics implementation. Used in production when the
 * analytics flag is disabled — discards every event with zero
 * side effects.
 */
export class NoopAnalytics implements Analytics {
  // Signature kept for the Analytics contract; arguments are
  // intentionally unused.
  track(_name: AnalyticsEvent, _props?: AnalyticsProps): void {
    // intentionally empty
  }
}
