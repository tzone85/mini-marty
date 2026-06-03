import { describe, expect, it } from "vitest";
import { MemoryAnalytics } from "./memory-analytics";

describe("MemoryAnalytics", () => {
  it("records events for assertion", () => {
    const a = new MemoryAnalytics();
    a.track("code_run", { language: "python" });
    expect(a.events).toEqual([
      { name: "code_run", props: { language: "python" } },
    ]);
  });
});
