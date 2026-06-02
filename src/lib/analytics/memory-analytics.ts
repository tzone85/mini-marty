import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

/**
 * Analytics implementation that records events in memory.
 * Use in tests to assert on emitted events.
 */
export class MemoryAnalytics implements Analytics {
  private _events: { name: AnalyticsEvent; props?: AnalyticsProps }[] = [];

  get events() {
    return this._events;
  }

  track(name: AnalyticsEvent, props?: AnalyticsProps): void {
    this._events = [...this._events, { name, props }];
  }
}
