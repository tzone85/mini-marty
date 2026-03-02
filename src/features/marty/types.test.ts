import { describe, it, expect } from "vitest";
import type {
  Leg,
  Direction,
  Foot,
  AccelerometerData,
  CommandCategory,
  MartyCommand,
  CommandResult,
  ExecutionMode,
  CommandOptions,
  MartyStatus,
  MartyEventMap,
} from "./types";

describe("Marty types", () => {
  it("Leg type accepts left and right", () => {
    const left: Leg = "left";
    const right: Leg = "right";
    expect(left).toBe("left");
    expect(right).toBe("right");
  });

  it("Direction type accepts all four directions", () => {
    const directions: Direction[] = ["left", "right", "forward", "backward"];
    expect(directions).toHaveLength(4);
  });

  it("Foot type accepts left and right", () => {
    const foot: Foot = "left";
    expect(foot).toBe("left");
  });

  it("AccelerometerData has x, y, z", () => {
    const data: AccelerometerData = { x: 1, y: 2, z: 3 };
    expect(data.x).toBe(1);
    expect(data.y).toBe(2);
    expect(data.z).toBe(3);
  });

  it("CommandCategory includes all categories", () => {
    const categories: CommandCategory[] = [
      "movement",
      "joint",
      "status",
      "sensor",
      "sound",
    ];
    expect(categories).toHaveLength(5);
  });

  it("MartyCommand has required fields", () => {
    const cmd: MartyCommand = {
      id: "cmd-1",
      name: "walk",
      category: "movement",
      params: { steps: 2 },
      duration: 1000,
      createdAt: Date.now(),
    };
    expect(cmd.id).toBe("cmd-1");
    expect(cmd.name).toBe("walk");
    expect(cmd.category).toBe("movement");
    expect(cmd.duration).toBe(1000);
  });

  it("CommandResult has success and optional data/error", () => {
    const success: CommandResult = {
      commandId: "cmd-1",
      success: true,
      data: { moved: true },
    };
    const failure: CommandResult = {
      commandId: "cmd-2",
      success: false,
      error: "timeout",
    };
    expect(success.success).toBe(true);
    expect(success.data).toEqual({ moved: true });
    expect(failure.success).toBe(false);
    expect(failure.error).toBe("timeout");
  });

  it("ExecutionMode accepts blocking and non-blocking", () => {
    const modes: ExecutionMode[] = ["blocking", "non-blocking"];
    expect(modes).toHaveLength(2);
  });

  it("CommandOptions has mode", () => {
    const opts: CommandOptions = { mode: "blocking" };
    expect(opts.mode).toBe("blocking");
  });

  it("MartyStatus includes all states", () => {
    const states: MartyStatus[] = ["idle", "moving", "paused", "error"];
    expect(states).toHaveLength(4);
  });

  it("MartyEventMap keys include all events", () => {
    const event: MartyEventMap["statusChange"] = {
      previous: "idle",
      current: "moving",
    };
    expect(event.previous).toBe("idle");
    expect(event.current).toBe("moving");
  });
});
