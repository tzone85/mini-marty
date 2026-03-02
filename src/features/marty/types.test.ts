import { describe, it, expect } from "vitest";
import type {
  Direction,
  Leg,
  EyePosition,
  FootSide,
  CommandStatus,
  MovementCommand,
  JointCommand,
  SoundCommand,
  StatusCommand,
  MartyCommand,
  QueuedCommand,
  MartyEventType,
  CommandStartEvent,
  CommandCompleteEvent,
  CommandErrorEvent,
  StatusChangeEvent,
  MartyEvent,
  SensorData,
  ExecutionMode,
} from "./types";

describe("Marty types", () => {
  it("Direction type accepts left and right", () => {
    const left: Direction = "left";
    const right: Direction = "right";
    expect(left).toBe("left");
    expect(right).toBe("right");
  });

  it("Leg type accepts left and right", () => {
    const left: Leg = "left";
    const right: Leg = "right";
    expect(left).toBe("left");
    expect(right).toBe("right");
  });

  it("EyePosition type accepts valid positions", () => {
    const positions: EyePosition[] = [
      "normal",
      "wide",
      "angry",
      "excited",
      "squint",
    ];
    expect(positions).toHaveLength(5);
  });

  it("FootSide type accepts left and right", () => {
    const left: FootSide = "left";
    const right: FootSide = "right";
    expect(left).toBe("left");
    expect(right).toBe("right");
  });

  it("CommandStatus type accepts all states", () => {
    const statuses: CommandStatus[] = [
      "pending",
      "running",
      "completed",
      "error",
    ];
    expect(statuses).toHaveLength(4);
  });

  it("MovementCommand has correct structure", () => {
    const cmd: MovementCommand = {
      type: "movement",
      action: "walk",
      params: { steps: 2, speed: 50 },
      duration: 1000,
    };
    expect(cmd.type).toBe("movement");
    expect(cmd.action).toBe("walk");
  });

  it("JointCommand has correct structure", () => {
    const cmd: JointCommand = {
      type: "joint",
      action: "eyes",
      params: { position: "wide" },
      duration: 500,
    };
    expect(cmd.type).toBe("joint");
    expect(cmd.action).toBe("eyes");
  });

  it("SoundCommand has correct structure", () => {
    const cmd: SoundCommand = {
      type: "sound",
      action: "play_sound",
      params: { name: "beep" },
      duration: 2000,
    };
    expect(cmd.type).toBe("sound");
  });

  it("StatusCommand has correct structure", () => {
    const cmd: StatusCommand = {
      type: "status",
      action: "stop",
      params: {},
      duration: 0,
    };
    expect(cmd.type).toBe("status");
  });

  it("MartyCommand union type accepts all command types", () => {
    const commands: MartyCommand[] = [
      { type: "movement", action: "walk", params: {}, duration: 1000 },
      { type: "joint", action: "eyes", params: {}, duration: 500 },
      { type: "sound", action: "play_sound", params: {}, duration: 2000 },
      { type: "status", action: "stop", params: {}, duration: 0 },
    ];
    expect(commands).toHaveLength(4);
  });

  it("QueuedCommand has correct structure", () => {
    const queued: QueuedCommand = {
      id: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
      status: "pending",
      blocking: true,
      createdAt: Date.now(),
    };
    expect(queued.id).toBe("cmd-1");
    expect(queued.status).toBe("pending");
  });

  it("MartyEventType accepts all event types", () => {
    const types: MartyEventType[] = [
      "commandStart",
      "commandComplete",
      "commandError",
      "statusChange",
    ];
    expect(types).toHaveLength(4);
  });

  it("CommandStartEvent has correct structure", () => {
    const event: CommandStartEvent = {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    };
    expect(event.type).toBe("commandStart");
  });

  it("CommandCompleteEvent has correct structure", () => {
    const event: CommandCompleteEvent = {
      type: "commandComplete",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    };
    expect(event.type).toBe("commandComplete");
  });

  it("CommandErrorEvent has error field", () => {
    const event: CommandErrorEvent = {
      type: "commandError",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
      error: "Timeout",
    };
    expect(event.error).toBe("Timeout");
  });

  it("StatusChangeEvent has state fields", () => {
    const event: StatusChangeEvent = {
      type: "statusChange",
      isMoving: true,
      isPaused: false,
    };
    expect(event.isMoving).toBe(true);
    expect(event.isPaused).toBe(false);
  });

  it("MartyEvent union type accepts all events", () => {
    const events: MartyEvent[] = [
      {
        type: "commandStart",
        commandId: "1",
        command: { type: "movement", action: "walk", params: {}, duration: 0 },
      },
      {
        type: "commandComplete",
        commandId: "1",
        command: { type: "movement", action: "walk", params: {}, duration: 0 },
      },
      {
        type: "commandError",
        commandId: "1",
        command: { type: "movement", action: "walk", params: {}, duration: 0 },
        error: "fail",
      },
      { type: "statusChange", isMoving: false, isPaused: false },
    ];
    expect(events).toHaveLength(4);
  });

  it("SensorData has correct structure", () => {
    const data: SensorData = {
      footOnGround: { left: true, right: false },
      distance: 42.5,
      accelerometer: { x: 0.1, y: -9.8, z: 0.3 },
    };
    expect(data.distance).toBe(42.5);
    expect(data.footOnGround.left).toBe(true);
  });

  it("ExecutionMode accepts blocking and non-blocking", () => {
    const modes: ExecutionMode[] = ["blocking", "non-blocking"];
    expect(modes).toHaveLength(2);
  });
});
