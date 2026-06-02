import { describe, expect, it, vi } from "vitest";
import { SentryErrorReporter } from "./sentry-reporter";

describe("SentryErrorReporter", () => {
  it("calls captureException with error + context", () => {
    const captureException = vi.fn();
    const reporter = new SentryErrorReporter({ captureException });
    reporter.report(new Error("x"), { feature: "marty" });
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ extra: { feature: "marty" } }),
    );
  });
  it("does nothing if client missing", () => {
    const reporter = new SentryErrorReporter(null);
    expect(() => reporter.report(new Error("x"))).not.toThrow();
  });
});
