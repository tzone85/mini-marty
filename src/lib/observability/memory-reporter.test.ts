import { describe, expect, it } from "vitest";
import { MemoryErrorReporter } from "./memory-reporter";

describe("MemoryErrorReporter", () => {
  it("stores reported errors with context", () => {
    const r = new MemoryErrorReporter();
    const err = new Error("boom");
    r.report(err, { feature: "marty" });
    expect(r.entries).toEqual([{ error: err, context: { feature: "marty" } }]);
  });
  it("clear empties entries", () => {
    const r = new MemoryErrorReporter();
    r.report(new Error("x"));
    r.clear();
    expect(r.entries).toEqual([]);
  });
});
