import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryAnalytics } from "./memory-analytics";
import { AnalyticsProvider, useAnalytics } from "./provider";

describe("AnalyticsProvider", () => {
  it("provides injected analytics", () => {
    const a = new MemoryAnalytics();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AnalyticsProvider analytics={a}>{children}</AnalyticsProvider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current).toBe(a);
  });
  it("throws outside provider", () => {
    expect(() => renderHook(() => useAnalytics())).toThrow();
  });
});
