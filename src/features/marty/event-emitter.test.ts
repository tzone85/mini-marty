import { describe, expect, it, vi } from "vitest";
import { MartyEventEmitter } from "./event-emitter";

describe("MartyEventEmitter", () => {
  it("on/emit", () => {
    const ee = new MartyEventEmitter();
    const fn = vi.fn();
    ee.on("statusChange", fn);
    ee.emit("statusChange", {
      type: "statusChange",
      isMoving: true,
      isPaused: false,
    });
    expect(fn).toHaveBeenCalledWith({
      type: "statusChange",
      isMoving: true,
      isPaused: false,
    });
  });
  it("off stops delivery", () => {
    const ee = new MartyEventEmitter();
    const fn = vi.fn();
    ee.on("statusChange", fn);
    ee.off("statusChange", fn);
    ee.emit("statusChange", {
      type: "statusChange",
      isMoving: false,
      isPaused: false,
    });
    expect(fn).not.toHaveBeenCalled();
  });
  it("removeAllListeners", () => {
    const ee = new MartyEventEmitter();
    const a = vi.fn();
    ee.on("statusChange", a);
    ee.removeAllListeners();
    ee.emit("statusChange", {
      type: "statusChange",
      isMoving: false,
      isPaused: false,
    });
    expect(a).not.toHaveBeenCalled();
  });
  it("emit to unknown type is a no-op", () => {
    const ee = new MartyEventEmitter();
    expect(() =>
      ee.emit("commandError", {
        type: "commandError",
        commandId: "x",
        command: {
          type: "status",
          action: "stop",
          params: {},
          duration: 0,
        },
        error: "e",
      }),
    ).not.toThrow();
  });
  it("off on unknown type is a no-op", () => {
    const ee = new MartyEventEmitter();
    const fn = vi.fn();
    expect(() => ee.off("commandError", fn)).not.toThrow();
  });
});
