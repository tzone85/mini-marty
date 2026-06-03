import { describe, expect, it, vi } from "vitest";
import { PyodideEventBus } from "./pyodide-events";

describe("PyodideEventBus", () => {
  it("notifies and unsubscribes", () => {
    const bus = new PyodideEventBus();
    const fn = vi.fn();
    const off = bus.onStateChange(fn);
    bus.notify("loading");
    expect(fn).toHaveBeenCalledWith("loading", undefined);
    off();
    bus.notify("ready");
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it("passes error string to listener", () => {
    const bus = new PyodideEventBus();
    const fn = vi.fn();
    bus.onStateChange(fn);
    bus.notify("error", "boom");
    expect(fn).toHaveBeenCalledWith("error", "boom");
  });
});
