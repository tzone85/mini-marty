import { describe, expect, it, vi } from "vitest";
import {
  createMartyBridge,
  wrapUserCode,
  MARTYPY_MODULE_CODE,
} from "./martypy-module";
import { VirtualMarty } from "@/features/marty/virtual-marty";

describe("createMartyBridge", () => {
  it("exposes every public marty method", () => {
    const m = new VirtualMarty();
    const b = createMartyBridge(m) as Record<string, () => unknown>;
    for (const name of [
      "walk",
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
      "move_joint",
      "stop",
      "is_moving",
      "is_paused",
      "resume",
      "hold_position",
      "foot_on_ground",
      "get_distance_sensor",
      "get_accelerometer",
      "play_sound",
    ]) {
      expect(typeof b[name]).toBe("function");
    }
  });
  it("walk delegates to marty.walk", () => {
    const m = new VirtualMarty();
    const spy = vi.spyOn(m, "walk").mockResolvedValue();
    const b = createMartyBridge(m) as {
      walk: (n: number, s: number) => Promise<void>;
    };
    b.walk(3, 60);
    expect(spy).toHaveBeenCalledWith(3, 60);
  });
  it("get_distance_sensor delegates", () => {
    const m = new VirtualMarty();
    const b = createMartyBridge(m) as { get_distance_sensor: () => number };
    expect(b.get_distance_sensor()).toBe(100);
  });
  it("get_accelerometer delegates", () => {
    const m = new VirtualMarty();
    const b = createMartyBridge(m) as {
      get_accelerometer: () => { x: number; y: number; z: number };
    };
    expect(b.get_accelerometer()).toEqual({ x: 0, y: -9.8, z: 0 });
  });
});

describe("wrapUserCode", () => {
  it("indents user code 4 spaces", () => {
    const wrapped = wrapUserCode("a\nb");
    expect(wrapped).toContain("    a");
    expect(wrapped).toContain("    b");
  });
  it("contains the async runner scaffolding", () => {
    const wrapped = wrapUserCode("pass");
    expect(wrapped).toContain("async def __run_user_code");
    expect(wrapped).toContain("asyncio.ensure_future");
  });
});

describe("MARTYPY_MODULE_CODE", () => {
  it("exports a Marty class definition", () => {
    expect(MARTYPY_MODULE_CODE).toContain("class Marty");
  });
  it("registers the module in sys.modules", () => {
    expect(MARTYPY_MODULE_CODE).toContain('sys.modules["martypy"]');
  });
});
