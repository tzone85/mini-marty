import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

export class NoopAnalytics implements Analytics {
  private _events: { name: AnalyticsEvent; props?: AnalyticsProps }[] = [];

  get events() {
    return this._events;
  }

  track(name: AnalyticsEvent, props?: AnalyticsProps): void {
    this._events = [...this._events, { name, props }];
  }
}
