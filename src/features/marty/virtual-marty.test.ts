import { describe, it, expect, vi, beforeEach } from "vitest";
import { VirtualMarty } from "./virtual-marty";

describe("VirtualMarty", () => {
  let marty: VirtualMarty;

  beforeEach(() => {
    vi.useFakeTimers();
    marty = new VirtualMarty();
  });

  it("creates an instance", () => {
    expect(marty).toBeDefined();
  });

  describe("movement commands", () => {
    it("walk enqueues a walk command", async () => {
      const promise = marty.walk(2, 50);
      expect(promise).toBeInstanceOf(Promise);
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("walk uses default params", async () => {
      const promise = marty.walk();
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("dance enqueues a dance command", async () => {
      const promise = marty.dance();
      await vi.advanceTimersByTimeAsync(2000);
      await promise;
    });

    it("kick enqueues a kick command", async () => {
      const promise = marty.kick("left");
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("kick uses default leg", async () => {
      const promise = marty.kick();
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("slide enqueues a slide command", async () => {
      const promise = marty.slide("left", 2);
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("slide uses defaults", async () => {
      const promise = marty.slide();
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
    });

    it("lean enqueues a lean command", async () => {
      const promise = marty.lean("left", 50);
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });

    it("lean uses defaults", async () => {
      const promise = marty.lean();
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });

    it("wiggle enqueues a wiggle command", async () => {
      const promise = marty.wiggle();
      await vi.advanceTimersByTimeAsync(1500);
      await promise;
    });

    it("circle_dance enqueues a circle_dance command", async () => {
      const promise = marty.circle_dance();
      await vi.advanceTimersByTimeAsync(3000);
      await promise;
    });

    it("celebrate enqueues a celebrate command", async () => {
      const promise = marty.celebrate();
      await vi.advanceTimersByTimeAsync(2000);
      await promise;
    });

    it("get_ready enqueues a get_ready command", async () => {
      const promise = marty.get_ready();
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });

    it("stand_straight enqueues a stand_straight command", async () => {
      const promise = marty.stand_straight();
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });
  });

  describe("joint control commands", () => {
    it("eyes enqueues an eyes command", async () => {
      const promise = marty.eyes("wide");
      await vi.advanceTimersByTimeAsync(300);
      await promise;
    });

    it("eyes uses default position", async () => {
      const promise = marty.eyes();
      await vi.advanceTimersByTimeAsync(300);
      await promise;
    });

    it("arms enqueues an arms command", async () => {
      const promise = marty.arms(45, -45);
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });

    it("arms uses defaults", async () => {
      const promise = marty.arms();
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });

    it("move_joint enqueues a move_joint command", async () => {
      const promise = marty.move_joint(1, 90, 500);
      await vi.advanceTimersByTimeAsync(500);
      await promise;
    });
  });

  describe("status commands", () => {
    it("is_moving returns false initially", () => {
      expect(marty.is_moving()).toBe(false);
    });

    it("is_moving returns true during command execution", async () => {
      marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(0);
      expect(marty.is_moving()).toBe(true);
    });

    it("is_moving returns false after command completes", async () => {
      const promise = marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(1000);
      await promise;
      expect(marty.is_moving()).toBe(false);
    });

    it("stop halts execution", async () => {
      marty.walk(2, 50);
      await marty.stop();
      expect(marty.is_moving()).toBe(false);
    });

    it("is_paused returns false initially", () => {
      expect(marty.is_paused()).toBe(false);
    });

    it("resume resumes from paused state", async () => {
      await marty.resume();
      expect(marty.is_paused()).toBe(false);
    });

    it("hold_position issues a hold command", async () => {
      const promise = marty.hold_position();
      await vi.advanceTimersByTimeAsync(100);
      await promise;
    });
  });

  describe("sensor commands", () => {
    it("foot_on_ground returns boolean for left foot", () => {
      expect(typeof marty.foot_on_ground("left")).toBe("boolean");
    });

    it("foot_on_ground returns boolean for right foot", () => {
      expect(typeof marty.foot_on_ground("right")).toBe("boolean");
    });

    it("get_distance_sensor returns a number", () => {
      expect(typeof marty.get_distance_sensor()).toBe("number");
    });

    it("get_accelerometer returns x, y, z values", () => {
      const accel = marty.get_accelerometer();
      expect(accel).toHaveProperty("x");
      expect(accel).toHaveProperty("y");
      expect(accel).toHaveProperty("z");
      expect(typeof accel.x).toBe("number");
    });
  });

  describe("sound commands", () => {
    it("play_sound enqueues a sound command", async () => {
      const promise = marty.play_sound("beep");
      await vi.advanceTimersByTimeAsync(2000);
      await promise;
    });
  });

  describe("event emitter integration", () => {
    it("emits commandStart on command execution", async () => {
      const listener = vi.fn();
      marty.on("commandStart", listener);

      marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(0);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "commandStart" }),
      );
    });

    it("emits commandComplete after command finishes", async () => {
      const listener = vi.fn();
      marty.on("commandComplete", listener);

      const promise = marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(1000);
      await promise;

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "commandComplete" }),
      );
    });

    it("emits statusChange when moving state changes", async () => {
      const listener = vi.fn();
      marty.on("statusChange", listener);

      const promise = marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(0);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "statusChange", isMoving: true }),
      );

      await vi.advanceTimersByTimeAsync(1000);
      await promise;

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "statusChange", isMoving: false }),
      );
    });

    it("removes listener with off()", async () => {
      const listener = vi.fn();
      marty.on("commandStart", listener);
      marty.off("commandStart", listener);

      marty.walk(2, 50);
      await vi.advanceTimersByTimeAsync(0);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("execution mode", () => {
    it("defaults to blocking mode", () => {
      expect(marty.getExecutionMode()).toBe("blocking");
    });

    it("can switch to non-blocking mode", () => {
      marty.setExecutionMode("non-blocking");
      expect(marty.getExecutionMode()).toBe("non-blocking");
    });

    it("non-blocking commands resolve immediately", async () => {
      marty.setExecutionMode("non-blocking");
      const promise = marty.walk(2, 50);
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
