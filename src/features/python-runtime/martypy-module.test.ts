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

  it("forwards every action method to the underlying VirtualMarty", () => {
    const m = new VirtualMarty();
    const spies = {
      dance: vi.spyOn(m, "dance").mockResolvedValue(),
      kick: vi.spyOn(m, "kick").mockResolvedValue(),
      slide: vi.spyOn(m, "slide").mockResolvedValue(),
      lean: vi.spyOn(m, "lean").mockResolvedValue(),
      wiggle: vi.spyOn(m, "wiggle").mockResolvedValue(),
      circle_dance: vi.spyOn(m, "circle_dance").mockResolvedValue(),
      celebrate: vi.spyOn(m, "celebrate").mockResolvedValue(),
      get_ready: vi.spyOn(m, "get_ready").mockResolvedValue(),
      stand_straight: vi.spyOn(m, "stand_straight").mockResolvedValue(),
      eyes: vi.spyOn(m, "eyes").mockResolvedValue(),
      arms: vi.spyOn(m, "arms").mockResolvedValue(),
      move_joint: vi.spyOn(m, "move_joint").mockResolvedValue(),
      stop: vi.spyOn(m, "stop").mockResolvedValue(),
      resume: vi.spyOn(m, "resume").mockResolvedValue(),
      hold_position: vi.spyOn(m, "hold_position").mockResolvedValue(),
      play_sound: vi.spyOn(m, "play_sound").mockResolvedValue(),
    };
    const b = createMartyBridge(m) as Record<
      string,
      (...a: unknown[]) => unknown
    >;
    b.dance();
    b.kick("left");
    b.slide("right", 2);
    b.lean("right", 45);
    b.wiggle();
    b.circle_dance();
    b.celebrate();
    b.get_ready();
    b.stand_straight();
    b.eyes("wide");
    b.arms(10, -10);
    b.move_joint(1, 30, 500);
    b.stop();
    b.resume();
    b.hold_position();
    b.play_sound("excited");

    expect(spies.dance).toHaveBeenCalled();
    expect(spies.kick).toHaveBeenCalledWith("left");
    expect(spies.slide).toHaveBeenCalledWith("right", 2);
    expect(spies.lean).toHaveBeenCalledWith("right", 45);
    expect(spies.wiggle).toHaveBeenCalled();
    expect(spies.circle_dance).toHaveBeenCalled();
    expect(spies.celebrate).toHaveBeenCalled();
    expect(spies.get_ready).toHaveBeenCalled();
    expect(spies.stand_straight).toHaveBeenCalled();
    expect(spies.eyes).toHaveBeenCalledWith("wide");
    expect(spies.arms).toHaveBeenCalledWith(10, -10);
    expect(spies.move_joint).toHaveBeenCalledWith(1, 30, 500);
    expect(spies.stop).toHaveBeenCalled();
    expect(spies.resume).toHaveBeenCalled();
    expect(spies.hold_position).toHaveBeenCalled();
    expect(spies.play_sound).toHaveBeenCalledWith("excited");
  });

  it("returns sensor readings via the synchronous bridge methods", () => {
    const m = new VirtualMarty();
    const b = createMartyBridge(m) as {
      is_moving: () => boolean;
      is_paused: () => boolean;
      foot_on_ground: (s: string) => boolean;
    };
    expect(typeof b.is_moving()).toBe("boolean");
    expect(typeof b.is_paused()).toBe("boolean");
    expect(b.foot_on_ground("left")).toBe(true);
    expect(b.foot_on_ground("right")).toBe(true);
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
