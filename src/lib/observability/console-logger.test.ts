import { describe, expect, it, vi } from "vitest";
import { ConsoleLogger } from "./console-logger";

describe("ConsoleLogger", () => {
  it("forwards info to console.info with structured context", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = new ConsoleLogger();
    log.info("hello", { feature: "test" });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("hello"),
      expect.objectContaining({ feature: "test" }),
    );
    spy.mockRestore();
  });
  it("forwards warn and error", () => {
    const w = vi.spyOn(console, "warn").mockImplementation(() => {});
    const e = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = new ConsoleLogger();
    log.warn("w");
    log.error("e");
    expect(w).toHaveBeenCalled();
    expect(e).toHaveBeenCalled();
    w.mockRestore();
    e.mockRestore();
  });
});
