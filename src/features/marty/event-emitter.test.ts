import { describe, it, expect, vi } from "vitest";
import { MartyEventEmitter } from "./event-emitter";
import type { MartyEventMap } from "./types";

describe("MartyEventEmitter", () => {
  it("calls listener when event is emitted", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();

    emitter.on("commandStart", listener);
    const command: MartyEventMap["commandStart"] = {
      id: "cmd-1",
      name: "walk",
      category: "movement",
      params: {},
      duration: 1000,
      createdAt: Date.now(),
    };
    emitter.emit("commandStart", command);

    expect(listener).toHaveBeenCalledWith(command);
  });

  it("supports multiple listeners for the same event", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("commandComplete", listener1);
    emitter.on("commandComplete", listener2);
    const result = { commandId: "cmd-1", success: true };
    emitter.emit("commandComplete", result);

    expect(listener1).toHaveBeenCalledWith(result);
    expect(listener2).toHaveBeenCalledWith(result);
  });

  it("removes listener with off", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();

    emitter.on("statusChange", listener);
    emitter.off("statusChange", listener);
    emitter.emit("statusChange", { previous: "idle", current: "moving" });

    expect(listener).not.toHaveBeenCalled();
  });

  it("does not affect other listeners when removing one", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("commandError", listener1);
    emitter.on("commandError", listener2);
    emitter.off("commandError", listener1);

    const result = { commandId: "cmd-1", success: false, error: "fail" };
    emitter.emit("commandError", result);

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalledWith(result);
  });

  it("does nothing when emitting an event with no listeners", () => {
    const emitter = new MartyEventEmitter();
    expect(() =>
      emitter.emit("statusChange", { previous: "idle", current: "moving" }),
    ).not.toThrow();
  });

  it("does nothing when removing a listener that was never added", () => {
    const emitter = new MartyEventEmitter();
    const listener = vi.fn();
    expect(() => emitter.off("commandStart", listener)).not.toThrow();
  });

  it("removeAllListeners clears all listeners for an event", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("commandStart", listener1);
    emitter.on("commandStart", listener2);
    emitter.removeAllListeners("commandStart");

    emitter.emit("commandStart", {
      id: "cmd-1",
      name: "walk",
      category: "movement",
      params: {},
      duration: 1000,
      createdAt: Date.now(),
    });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it("removeAllListeners without args clears all events", () => {
    const emitter = new MartyEventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    emitter.on("commandStart", listener1);
    emitter.on("statusChange", listener2);
    emitter.removeAllListeners();

    emitter.emit("commandStart", {
      id: "cmd-1",
      name: "walk",
      category: "movement",
      params: {},
      duration: 1000,
      createdAt: Date.now(),
    });
    emitter.emit("statusChange", { previous: "idle", current: "moving" });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });
});
