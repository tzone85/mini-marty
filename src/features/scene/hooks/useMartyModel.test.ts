import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMartyModel } from "./useMartyModel";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import { DEFAULT_POSE } from "../types";

describe("useMartyModel", () => {
  let marty: VirtualMarty;

  beforeEach(() => {
    vi.useFakeTimers();
    marty = new VirtualMarty();
  });

  it("returns default pose initially", () => {
    const { result } = renderHook(() => useMartyModel({ marty }));
    expect(result.current.pose).toEqual(DEFAULT_POSE);
  });

  it("returns isConnected true when marty is provided", () => {
    const { result } = renderHook(() => useMartyModel({ marty }));
    expect(result.current.isConnected).toBe(true);
  });

  it("returns isConnected false when marty is null", () => {
    const { result } = renderHook(() => useMartyModel({ marty: null }));
    expect(result.current.isConnected).toBe(false);
  });

  it("returns null currentAction initially", () => {
    const { result } = renderHook(() => useMartyModel({ marty }));
    expect(result.current.currentAction).toBeNull();
  });

  it("updates currentAction when command starts", async () => {
    const { result } = renderHook(() => useMartyModel({ marty }));

    act(() => {
      marty.walk(2, 50);
    });

    // Allow microtasks to settle
    await vi.advanceTimersByTimeAsync(0);

    expect(result.current.currentAction).toBe("walk");
  });

  it("clears currentAction when command completes", async () => {
    const { result } = renderHook(() => useMartyModel({ marty }));

    let walkPromise: Promise<void>;
    act(() => {
      walkPromise = marty.walk(2, 50);
    });

    await vi.advanceTimersByTimeAsync(0);
    expect(result.current.currentAction).toBe("walk");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
      await walkPromise!;
    });

    expect(result.current.currentAction).toBeNull();
  });

  it("resets pose to default when command completes", async () => {
    const { result } = renderHook(() => useMartyModel({ marty }));

    let walkPromise: Promise<void>;
    act(() => {
      walkPromise = marty.walk(2, 50);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
      await walkPromise!;
    });

    expect(result.current.pose).toEqual(DEFAULT_POSE);
  });

  it("provides an onModelReady callback", () => {
    const { result } = renderHook(() => useMartyModel({ marty }));
    expect(result.current.onModelReady).toBeTypeOf("function");
  });

  it("calls applyPose on model handle when command completes", async () => {
    const mockApplyPose = vi.fn();
    const mockHandle = {
      applyPose: mockApplyPose,
      getRootRef: () => null,
    };

    const { result } = renderHook(() => useMartyModel({ marty }));

    act(() => {
      result.current.onModelReady(mockHandle);
    });

    let walkPromise: Promise<void>;
    act(() => {
      walkPromise = marty.walk(2, 50);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
      await walkPromise!;
    });

    expect(mockApplyPose).toHaveBeenCalledWith(DEFAULT_POSE);
  });

  it("cleans up event listeners on unmount", async () => {
    const offSpy = vi.spyOn(marty, "off");

    const { unmount } = renderHook(() => useMartyModel({ marty }));
    unmount();

    expect(offSpy).toHaveBeenCalledWith("commandStart", expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith(
      "commandComplete",
      expect.any(Function),
    );
  });

  it("reconnects when marty instance changes", () => {
    const { result, rerender } = renderHook(
      ({ marty: m }) => useMartyModel({ marty: m }),
      { initialProps: { marty: marty as VirtualMarty | null } },
    );

    expect(result.current.isConnected).toBe(true);

    rerender({ marty: null });
    expect(result.current.isConnected).toBe(false);

    const newMarty = new VirtualMarty();
    rerender({ marty: newMarty });
    expect(result.current.isConnected).toBe(true);
  });
});
