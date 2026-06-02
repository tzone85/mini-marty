import { describe, expect, it } from "vitest";
import { NoopAnalytics } from "./noop-analytics";

describe("NoopAnalytics", () => {
  it("records events for assertion", () => {
    const a = new NoopAnalytics();
    a.track("code_run", { language: "python" });
    expect(a.events).toEqual([
      { name: "code_run", props: { language: "python" } },
    ]);
  });
});
