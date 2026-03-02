import { describe, it, expect, vi } from "vitest";
import { MartyEventEmitter } from "./event-emitter";
import type { CommandStartEvent, StatusChangeEvent } from "./types";

describe("MartyEventEmitter", () => {
  it("creates an emitter instance", () => {
    const emitter = new MartyEventEmitter();
    expect(emitter).toBeDefined();
  });

  it("registers and triggers commandStart listeners", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    emitter.on("commandStart", listener);

    const event: CommandStartEvent = {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    };
    emitter.emit("commandStart", event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it("registers and triggers commandComplete listeners", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    emitter.on("commandComplete", listener);

    emitter.emit("commandComplete", {
      type: "commandComplete",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("registers and triggers commandError listeners", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    emitter.on("commandError", listener);

    emitter.emit("commandError", {
      type: "commandError",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
      error: "timeout",
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("registers and triggers statusChange listeners", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    emitter.on("statusChange", listener);

    const event: StatusChangeEvent = {
      type: "statusChange",
      isMoving: true,
      isPaused: false,
    };
    emitter.emit("statusChange", event);

    expect(listener).toHaveBeenCalledWith(event);
  });

  it("supports multiple listeners for the same event", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on("commandStart", listener1);
    emitter.on("commandStart", listener2);

    emitter.emit("commandStart", {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("removes a listener with off()", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    emitter.on("commandStart", listener);
    emitter.off("commandStart", listener);

    emitter.emit("commandStart", {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    });

    expect(listener).not.toHaveBeenCalled();
  });

  it("does not affect other listeners when removing one", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on("commandStart", listener1);
    emitter.on("commandStart", listener2);
    emitter.off("commandStart", listener1);

    emitter.emit("commandStart", {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("does nothing when emitting event with no listeners", () => {
    const emitter = new MartyEventEmitter();
    expect(() => {
      emitter.emit("commandStart", {
        type: "commandStart",
        commandId: "cmd-1",
        command: {
          type: "movement",
          action: "walk",
          params: {},
          duration: 1000,
        },
      });
    }).not.toThrow();
  });

  it("removes all listeners with removeAllListeners()", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on("commandStart", listener1);
    emitter.on("statusChange", listener2);
    emitter.removeAllListeners();

    emitter.emit("commandStart", {
      type: "commandStart",
      commandId: "cmd-1",
      command: { type: "movement", action: "walk", params: {}, duration: 1000 },
    });
    emitter.emit("statusChange", {
      type: "statusChange",
      isMoving: false,
      isPaused: false,
    });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it("off() is a no-op for unregistered listener", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    expect(() => emitter.off("commandStart", listener)).not.toThrow();
  });
});
