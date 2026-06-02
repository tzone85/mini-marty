import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

export type VercelTrackFn = (event: string, props?: AnalyticsProps) => void;

export class VercelAnalytics implements Analytics {
  constructor(private readonly trackFn: VercelTrackFn) {}
  track(event: AnalyticsEvent, props?: AnalyticsProps): void {
    this.trackFn(event, props);
  }
}
