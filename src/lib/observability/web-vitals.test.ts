import { describe, expect, it, vi } from "vitest";
import type { Analytics } from "@/lib/analytics/types";

vi.mock("web-vitals", () => ({
  onCLS: vi.fn((cb) => cb({ name: "CLS", value: 0.01, id: "a" })),
  onFCP: vi.fn((cb) => cb({ name: "FCP", value: 100, id: "b" })),
  onINP: vi.fn((cb) => cb({ name: "INP", value: 50, id: "c" })),
  onLCP: vi.fn((cb) => cb({ name: "LCP", value: 200, id: "d" })),
  onTTFB: vi.fn((cb) => cb({ name: "TTFB", value: 10, id: "e" })),
}));

describe("startWebVitals", () => {
  it("forwards each metric to analytics.track", async () => {
    const { startWebVitals } = await import("./web-vitals");
    const calls: Array<{ event: string; props?: Record<string, unknown> }> = [];
    const analytics: Analytics = {
      track: (event, props) => {
        calls.push({ event, props });
      },
    };
    startWebVitals(analytics);
    expect(calls).toHaveLength(5);
    expect(calls[0].event).toBe("code_run");
    expect(calls[0].props?.metric).toBe("CLS");
    expect(calls[2].props?.metric).toBe("INP");
  });
});
