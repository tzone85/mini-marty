import { describe, expect, it, vi } from "vitest";
import { RealClock, FakeClock } from "./clock";

describe("FakeClock", () => {
  it("schedules and advances", () => {
    const c = new FakeClock();
    const cb = vi.fn();
    c.setTimeout(cb, 100);
    expect(cb).not.toHaveBeenCalled();
    c.advance(50);
    expect(cb).not.toHaveBeenCalled();
    c.advance(50);
    expect(cb).toHaveBeenCalled();
  });
  it("supports cancellation via returned disposer", () => {
    const c = new FakeClock();
    const cb = vi.fn();
    const cancel = c.setTimeout(cb, 100);
    cancel();
    c.advance(200);
    expect(cb).not.toHaveBeenCalled();
  });
  it("reports current time via now()", () => {
    const c = new FakeClock();
    expect(c.now()).toBe(0);
    c.advance(42);
    expect(c.now()).toBe(42);
  });
});

describe("RealClock", () => {
  it("uses setTimeout under the hood", async () => {
    const c = new RealClock();
    const result = await new Promise<string>((resolve) => {
      c.setTimeout(() => resolve("done"), 5);
    });
    expect(result).toBe("done");
  });
  it("now() returns a number close to Date.now()", () => {
    const c = new RealClock();
    const drift = Math.abs(c.now() - Date.now());
    expect(drift).toBeLessThan(100);
  });
});
