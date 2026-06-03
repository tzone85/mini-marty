"use client";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { Analytics } from "@/lib/analytics/types";

interface WebVitalMetric {
  readonly name: string;
  readonly value: number;
  readonly id: string;
}

export function startWebVitals(analytics: Analytics): void {
  const handler = (m: WebVitalMetric) => {
    analytics.track("web_vitals", {
      metric: m.name,
      value: m.value,
      id: m.id,
    });
  };
  onCLS(handler);
  onFCP(handler);
  onINP(handler);
  onLCP(handler);
  onTTFB(handler);
}
