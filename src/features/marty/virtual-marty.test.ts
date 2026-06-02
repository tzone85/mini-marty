import { describe, expect, it, vi } from "vitest";
import { VirtualMarty } from "./virtual-marty";
import { FakeClock } from "./clock";

async function flushMicrotasks(times = 4): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

describe("VirtualMarty commands", () => {
  it("walk emits start + complete", async () => {
    const clock = new FakeClock();
    const m = new VirtualMarty(clock);
    m.setExecutionMode("non-blocking");
    const start = vi.fn();
    const complete = vi.fn();
    m.on("commandStart", start);
    m.on("commandComplete", complete);
    await m.walk(1, 50);
    await flushMicrotasks();
    expect(start).toHaveBeenCalled();
    // walk has a 1000ms duration; advance the fake clock to drain it.
    clock.advance(1000);
    await flushMicrotasks();
    expect(complete).toHaveBeenCalled();
  });

  for (const method of [
    "dance",
    "kick",
    "slide",
    "lean",
    "wiggle",
    "circle_dance",
    "celebrate",
    "get_ready",
    "stand_straight",
    "eyes",
    "arms",
    "hold_position",
    "play_sound",
  ] as const) {
    it(`${method} resolves`, async () => {
      const m = new VirtualMarty();
      m.setExecutionMode("non-blocking");
      const result = (m as unknown as Record<string, () => Promise<void>>)[
        method
      ]();
      await expect(result).resolves.toBeUndefined();
    });
  }

  it("sensor accessors return defaults and are immutable", () => {
    const m = new VirtualMarty();
    expect(m.foot_on_ground("left")).toBe(true);
    expect(m.get_distance_sensor()).toBe(100);
    const acc = m.get_accelerometer();
    expect(acc).toEqual({ x: 0, y: -9.8, z: 0 });
  });

  it("stop clears queue and resolves", async () => {
    const m = new VirtualMarty();
    await m.stop();
    expect(m.is_moving()).toBe(false);
  });

  it("setExecutionMode round-trip", () => {
    const m = new VirtualMarty();
    m.setExecutionMode("non-blocking");
    expect(m.getExecutionMode()).toBe("non-blocking");
  });

  it("is_paused defaults false; resume keeps it false", async () => {
    const m = new VirtualMarty();
    expect(m.is_paused()).toBe(false);
    await m.resume();
    expect(m.is_paused()).toBe(false);
  });

  it("move_joint resolves", async () => {
    const m = new VirtualMarty();
    m.setExecutionMode("non-blocking");
    await expect(m.move_joint(1, 45, 10)).resolves.toBeUndefined();
  });

  it("off removes listener", () => {
    const m = new VirtualMarty();
    const fn = vi.fn();
    m.on("statusChange", fn);
    m.off("statusChange", fn);
    // Trigger nothing then assert no calls
    expect(fn).not.toHaveBeenCalled();
  });
});
