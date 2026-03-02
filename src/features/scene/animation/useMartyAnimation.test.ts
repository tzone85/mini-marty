import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock useFrame — capture the callback so we can invoke it manually
const frameCallbacks: Array<(state: unknown, delta: number) => void> = [];
vi.mock("@react-three/fiber", () => ({
  useFrame: (cb: (state: unknown, delta: number) => void) => {
    frameCallbacks.push(cb);
  },
}));

import { useMartyAnimation } from "./useMartyAnimation";
import { VirtualMarty } from "@/features/marty/virtual-marty";

describe("useMartyAnimation", () => {
  let marty: VirtualMarty;

  beforeEach(() => {
    vi.useFakeTimers();
    marty = new VirtualMarty();
    frameCallbacks.length = 0;
  });

  it("returns idle action initially", () => {
    const { result } = renderHook(() =>
      useMartyAnimation({ marty }),
    );
    expect(result.current.currentAction).toBe("idle");
    expect(result.current.isAnimating).toBe(false);
  });

  it("provides onModelReady callback", () => {
    const { result } = renderHook(() =>
      useMartyAnimation({ marty }),
    );
    expect(result.current.onModelReady).toBeTypeOf("function");
  });

  it("starts animating when command starts", async () => {
    const { result } = renderHook(() =>
      useMartyAnimation({ marty }),
    );

    act(() => {
      marty.walk(2, 50);
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(result.current.currentAction).toBe("walk");
    expect(result.current.isAnimating).toBe(true);
  });

  it("stops animating when command completes", async () => {
    const { result } = renderHook(() =>
      useMartyAnimation({ marty }),
    );

    let walkPromise: Promise<void>;
    act(() => {
      walkPromise = marty.walk(2, 50);
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(result.current.isAnimating).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
      await walkPromise!;
    });

    expect(result.current.currentAction).toBe("idle");
    expect(result.current.isAnimating).toBe(false);
  });

  it("cleans up listeners on unmount", () => {
    const offSpy = vi.spyOn(marty, "off");
    const { unmount } = renderHook(() =>
      useMartyAnimation({ marty }),
    );

    unmount();

    expect(offSpy).toHaveBeenCalledWith("commandStart", expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith("commandComplete", expect.any(Function));
  });

  it("handles null marty without error", () => {
    const { result } = renderHook(() =>
      useMartyAnimation({ marty: null }),
    );
    expect(result.current.currentAction).toBe("idle");
    expect(result.current.isAnimating).toBe(false);
  });

  it("calls applyPose on model handle during frame updates", async () => {
    const mockApplyPose = vi.fn();
    const mockHandle = {
      applyPose: mockApplyPose,
      getRootRef: () => null,
    };

    const { result } = renderHook(() =>
      useMartyAnimation({ marty }),
    );

    act(() => {
      result.current.onModelReady(mockHandle);
    });

    act(() => {
      marty.walk(2, 50);
    });

    await vi.advanceTimersByTimeAsync(0);

    // Simulate a frame update
    act(() => {
      const latestCb = frameCallbacks[frameCallbacks.length - 1];
      latestCb?.({}, 0.016); // ~16ms at 60fps
    });

    expect(mockApplyPose).toHaveBeenCalled();
  });
});
