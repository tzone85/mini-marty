import { describe, expect, it } from "vitest";
import { NoopAnalytics } from "./noop-analytics";

describe("NoopAnalytics", () => {
  it("discards events without throwing", () => {
    const a = new NoopAnalytics();
    expect(() => a.track("code_run", { language: "python" })).not.toThrow();
    // Public contract is intentionally minimal — no events array.
    expect(a).not.toHaveProperty("events");
  });
});
