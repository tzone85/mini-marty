import { describe, it, expect, vi } from "vitest";
import {
  createMartyBridge,
  MARTYPY_MODULE_CODE,
  EXECUTION_WRAPPER_CODE,
  wrapUserCode,
} from "./martypy-module";
import { VirtualMarty } from "@/features/marty/virtual-marty";

describe("martypy-module", () => {
  describe("createMartyBridge", () => {
    it("creates a bridge with all movement methods", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty);

      expect(bridge).toHaveProperty("walk");
      expect(bridge).toHaveProperty("dance");
      expect(bridge).toHaveProperty("kick");
      expect(bridge).toHaveProperty("slide");
      expect(bridge).toHaveProperty("lean");
      expect(bridge).toHaveProperty("wiggle");
      expect(bridge).toHaveProperty("circle_dance");
      expect(bridge).toHaveProperty("celebrate");
      expect(bridge).toHaveProperty("get_ready");
      expect(bridge).toHaveProperty("stand_straight");
    });

    it("creates a bridge with joint control methods", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty);

      expect(bridge).toHaveProperty("eyes");
      expect(bridge).toHaveProperty("arms");
      expect(bridge).toHaveProperty("move_joint");
    });

    it("creates a bridge with sensor methods", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty);

      expect(bridge).toHaveProperty("foot_on_ground");
      expect(bridge).toHaveProperty("get_distance_sensor");
      expect(bridge).toHaveProperty("get_accelerometer");
    });

    it("creates a bridge with status methods", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty);

      expect(bridge).toHaveProperty("stop");
      expect(bridge).toHaveProperty("is_moving");
      expect(bridge).toHaveProperty("is_paused");
      expect(bridge).toHaveProperty("resume");
      expect(bridge).toHaveProperty("hold_position");
    });

    it("creates a bridge with sound method", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty);

      expect(bridge).toHaveProperty("play_sound");
    });

    it("delegates walk to VirtualMarty", async () => {
      vi.useFakeTimers();
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => Promise<void>
      >;

      const walkPromise = bridge.walk(3, 100);
      await vi.advanceTimersByTimeAsync(1100);
      await walkPromise;

      vi.useRealTimers();
    });

    it("delegates dance to VirtualMarty", async () => {
      vi.useFakeTimers();
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => Promise<void>
      >;

      const dancePromise = bridge.dance();
      await vi.advanceTimersByTimeAsync(2100);
      await dancePromise;

      vi.useRealTimers();
    });

    it("delegates kick with leg parameter", async () => {
      vi.useFakeTimers();
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => Promise<void>
      >;

      const kickPromise = bridge.kick("left");
      await vi.advanceTimersByTimeAsync(1100);
      await kickPromise;

      vi.useRealTimers();
    });

    it("delegates is_moving returning boolean", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => unknown
      >;

      expect(bridge.is_moving()).toBe(false);
    });

    it("delegates foot_on_ground returning boolean", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => unknown
      >;

      expect(bridge.foot_on_ground("left")).toBe(true);
    });

    it("delegates get_distance_sensor returning number", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => unknown
      >;

      expect(typeof bridge.get_distance_sensor()).toBe("number");
    });

    it("delegates get_accelerometer returning object", () => {
      const marty = new VirtualMarty();
      const bridge = createMartyBridge(marty) as Record<
        string,
        (...args: unknown[]) => unknown
      >;

      const acc = bridge.get_accelerometer() as {
        x: number;
        y: number;
        z: number;
      };
      expect(acc).toHaveProperty("x");
      expect(acc).toHaveProperty("y");
      expect(acc).toHaveProperty("z");
    });
  });

  describe("MARTYPY_MODULE_CODE", () => {
    it("contains the Marty class definition", () => {
      expect(MARTYPY_MODULE_CODE).toContain("class Marty:");
    });

    it("contains virtual connection type check", () => {
      expect(MARTYPY_MODULE_CODE).toContain('"virtual"');
    });

    it("contains all movement methods", () => {
      const methods = [
        "async def walk",
        "async def dance",
        "async def kick",
        "async def slide",
        "async def lean",
        "async def wiggle",
        "async def circle_dance",
        "async def celebrate",
        "async def get_ready",
        "async def stand_straight",
      ];
      for (const method of methods) {
        expect(MARTYPY_MODULE_CODE).toContain(method);
      }
    });

    it("contains joint control methods", () => {
      expect(MARTYPY_MODULE_CODE).toContain("async def eyes");
      expect(MARTYPY_MODULE_CODE).toContain("async def arms");
      expect(MARTYPY_MODULE_CODE).toContain("async def move_joint");
    });

    it("contains sensor methods", () => {
      expect(MARTYPY_MODULE_CODE).toContain("def foot_on_ground");
      expect(MARTYPY_MODULE_CODE).toContain("def get_distance_sensor");
      expect(MARTYPY_MODULE_CODE).toContain("def get_accelerometer");
    });

    it("raises ValueError for non-virtual connection", () => {
      expect(MARTYPY_MODULE_CODE).toContain("raise ValueError");
    });

    it("registers martypy in sys.modules for import support", () => {
      expect(MARTYPY_MODULE_CODE).toContain('sys.modules["martypy"]');
    });

    it("creates a proper Python module via types.ModuleType", () => {
      expect(MARTYPY_MODULE_CODE).toContain("types.ModuleType");
      expect(MARTYPY_MODULE_CODE).toContain('"martypy"');
    });

    it("assigns Marty class to the module", () => {
      expect(MARTYPY_MODULE_CODE).toContain("_martypy_mod.Marty = Marty");
    });
  });

  describe("EXECUTION_WRAPPER_CODE", () => {
    it("contains async run function", () => {
      expect(EXECUTION_WRAPPER_CODE).toContain("async def __run_user_code():");
    });

    it("contains user code placeholder", () => {
      expect(EXECUTION_WRAPPER_CODE).toContain("{user_code}");
    });

    it("imports Marty class", () => {
      expect(EXECUTION_WRAPPER_CODE).toContain("from martypy import Marty");
    });
  });

  describe("wrapUserCode", () => {
    it("wraps single-line code with indentation", () => {
      const result = wrapUserCode('print("hello")');
      expect(result).toContain('    print("hello")');
    });

    it("wraps multi-line code preserving structure", () => {
      const code = 'my_marty = Marty("virtual")\nmy_marty.walk(2)';
      const result = wrapUserCode(code);
      expect(result).toContain('    my_marty = Marty("virtual")');
      expect(result).toContain("    my_marty.walk(2)");
    });

    it("includes the async wrapper function", () => {
      const result = wrapUserCode("pass");
      expect(result).toContain("async def __run_user_code():");
    });

    it("includes asyncio.ensure_future call", () => {
      const result = wrapUserCode("pass");
      expect(result).toContain("asyncio.ensure_future(__run_user_code())");
    });

    it("indents empty lines", () => {
      const code = "line1\n\nline3";
      const result = wrapUserCode(code);
      expect(result).toContain("    line1");
      expect(result).toContain("    line3");
    });
  });
});
