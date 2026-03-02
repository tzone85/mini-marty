import { describe, it, expect, vi, beforeEach } from "vitest";
import { VirtualMarty } from "./virtual-marty";
import type { MartyCommand, CommandResult } from "./types";

describe("VirtualMarty", () => {
  let marty: VirtualMarty;

  beforeEach(() => {
    marty = new VirtualMarty();
  });

  describe("movement commands", () => {
    it("walk enqueues a movement command", async () => {
      const result = await marty.walk(2, 50);
      expect(result.success).toBe(true);
    });

    it("dance enqueues a movement command", async () => {
      const result = await marty.dance();
      expect(result.success).toBe(true);
    });

    it("kick enqueues a movement command", async () => {
      const result = await marty.kick("left");
      expect(result.success).toBe(true);
    });

    it("slide enqueues a movement command", async () => {
      const result = await marty.slide("left", 1);
      expect(result.success).toBe(true);
    });

    it("lean enqueues a movement command", async () => {
      const result = await marty.lean("forward", 30);
      expect(result.success).toBe(true);
    });

    it("wiggle enqueues a movement command", async () => {
      const result = await marty.wiggle();
      expect(result.success).toBe(true);
    });

    it("circle_dance enqueues a movement command", async () => {
      const result = await marty.circle_dance();
      expect(result.success).toBe(true);
    });

    it("celebrate enqueues a movement command", async () => {
      const result = await marty.celebrate();
      expect(result.success).toBe(true);
    });

    it("get_ready enqueues a movement command", async () => {
      const result = await marty.get_ready();
      expect(result.success).toBe(true);
    });

    it("stand_straight enqueues a movement command", async () => {
      const result = await marty.stand_straight();
      expect(result.success).toBe(true);
    });
  });

  describe("joint control", () => {
    it("eyes sets eye position", async () => {
      const result = await marty.eyes("happy");
      expect(result.success).toBe(true);
    });

    it("arms sets arm positions", async () => {
      const result = await marty.arms(45, -45);
      expect(result.success).toBe(true);
    });

    it("move_joint moves a specific joint", async () => {
      const result = await marty.move_joint(1, 90, 500);
      expect(result.success).toBe(true);
    });
  });

  describe("status commands", () => {
    it("is_moving returns false when idle", () => {
      expect(marty.is_moving()).toBe(false);
    });

    it("is_moving returns true during command execution", async () => {
      const promise = marty.walk(1, 50);
      expect(marty.is_moving()).toBe(true);
      await promise;
    });

    it("stop changes status to idle", async () => {
      marty.walk(1, 50);
      await marty.stop();
      expect(marty.is_moving()).toBe(false);
    });

    it("is_paused returns false initially", () => {
      expect(marty.is_paused()).toBe(false);
    });

    it("resume returns to idle when not paused", async () => {
      await marty.resume();
      expect(marty.is_paused()).toBe(false);
    });

    it("hold_position holds current position", async () => {
      const result = await marty.hold_position();
      expect(result.success).toBe(true);
    });
  });

  describe("sensors", () => {
    it("foot_on_ground returns boolean", () => {
      const result = marty.foot_on_ground("left");
      expect(typeof result).toBe("boolean");
    });

    it("foot_on_ground works for right foot", () => {
      const result = marty.foot_on_ground("right");
      expect(typeof result).toBe("boolean");
    });

    it("get_distance_sensor returns a number", () => {
      const distance = marty.get_distance_sensor();
      expect(typeof distance).toBe("number");
      expect(distance).toBeGreaterThanOrEqual(0);
    });

    it("get_accelerometer returns x, y, z values", () => {
      const data = marty.get_accelerometer();
      expect(data).toHaveProperty("x");
      expect(data).toHaveProperty("y");
      expect(data).toHaveProperty("z");
      expect(typeof data.x).toBe("number");
      expect(typeof data.y).toBe("number");
      expect(typeof data.z).toBe("number");
    });
  });

  describe("sound", () => {
    it("play_sound enqueues a sound command", async () => {
      const result = await marty.play_sound("excited");
      expect(result.success).toBe(true);
    });
  });

  describe("event emitter integration", () => {
    it("emits commandStart when a command begins", async () => {
      const listener = vi.fn();
      marty.on("commandStart", listener);

      await marty.walk(1, 50);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ name: "walk", category: "movement" }),
      );
    });

    it("emits commandComplete when a command finishes", async () => {
      const listener = vi.fn();
      marty.on("commandComplete", listener);

      await marty.dance();
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("emits statusChange when status transitions", async () => {
      const listener = vi.fn();
      marty.on("statusChange", listener);

      await marty.walk(1, 50);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ previous: "idle", current: "moving" }),
      );
    });

    it("removes listener with off", async () => {
      const listener = vi.fn();
      marty.on("commandStart", listener);
      marty.off("commandStart", listener);

      await marty.walk(1, 50);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("execution modes", () => {
    it("defaults to blocking mode", async () => {
      const result = await marty.walk(1, 50);
      expect(result.success).toBe(true);
      expect(marty.is_moving()).toBe(false);
    });

    it("non-blocking mode resolves immediately", async () => {
      marty.setExecutionMode("non-blocking");
      const result = await marty.walk(1, 50);
      expect(result.success).toBe(true);
    });

    it("can switch execution modes", () => {
      marty.setExecutionMode("non-blocking");
      expect(marty.getExecutionMode()).toBe("non-blocking");
      marty.setExecutionMode("blocking");
      expect(marty.getExecutionMode()).toBe("blocking");
    });
  });

  describe("command queue", () => {
    it("processes multiple commands sequentially", async () => {
      const order: string[] = [];
      marty.on("commandStart", (cmd: MartyCommand) => order.push(cmd.name));

      await marty.walk(1, 50);
      await marty.dance();
      await marty.celebrate();

      expect(order).toEqual(["walk", "dance", "celebrate"]);
    });
  });
});
