import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePyodide } from "./usePyodide";
import * as pyodideService from "../pyodide-service";
import type { PyodideInstance } from "../pyodide-service";

vi.mock("../pyodide-service", () => ({
  loadPyodide: vi.fn(),
  onStateChange: vi.fn().mockReturnValue(vi.fn()),
  getLoadingState: vi.fn().mockReturnValue("idle"),
  getInstance: vi.fn().mockReturnValue(null),
}));

function createMockPyodide(): PyodideInstance {
  return {
    runPythonAsync: vi.fn().mockResolvedValue(undefined),
    registerJsModule: vi.fn(),
    setStdout: vi.fn(),
    setStderr: vi.fn(),
    globals: { get: vi.fn() },
  };
}

describe("usePyodide", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns idle state initially", () => {
    const { result } = renderHook(() => usePyodide());

    expect(result.current.state).toBe("idle");
    expect(result.current.error).toBeNull();
    expect(result.current.instance).toBeNull();
  });

  it("subscribes to state changes on mount", () => {
    renderHook(() => usePyodide());

    expect(pyodideService.onStateChange).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    vi.mocked(pyodideService.onStateChange).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => usePyodide());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("provides an initialize function", () => {
    const { result } = renderHook(() => usePyodide());

    expect(typeof result.current.initialize).toBe("function");
  });

  it("calls loadPyodide on initialize", async () => {
    const mockPyodide = createMockPyodide();
    vi.mocked(pyodideService.loadPyodide).mockResolvedValue(mockPyodide);

    const { result } = renderHook(() => usePyodide());

    await act(async () => {
      await result.current.initialize();
    });

    expect(pyodideService.loadPyodide).toHaveBeenCalled();
  });

  it("sets error on initialize failure", async () => {
    vi.mocked(pyodideService.loadPyodide).mockRejectedValue(
      new Error("Load failed"),
    );

    const { result } = renderHook(() => usePyodide());

    await act(async () => {
      await result.current.initialize();
    });

    expect(result.current.error).toBe("Load failed");
  });

  it("handles non-Error rejection", async () => {
    vi.mocked(pyodideService.loadPyodide).mockRejectedValue("unknown");

    const { result } = renderHook(() => usePyodide());

    await act(async () => {
      await result.current.initialize();
    });

    expect(result.current.error).toBe("Failed to initialize Pyodide");
  });

  it("updates state when listener fires", () => {
    let capturedListener: Function | null = null;
    vi.mocked(pyodideService.onStateChange).mockImplementation((listener) => {
      capturedListener = listener;
      return vi.fn();
    });

    const { result } = renderHook(() => usePyodide());

    expect(capturedListener).not.toBeNull();

    act(() => {
      capturedListener!("loading");
    });

    expect(result.current.state).toBe("loading");
  });

  it("sets error from listener", () => {
    let capturedListener: Function | null = null;
    vi.mocked(pyodideService.onStateChange).mockImplementation((listener) => {
      capturedListener = listener;
      return vi.fn();
    });

    const { result } = renderHook(() => usePyodide());

    act(() => {
      capturedListener!("error", "Network error");
    });

    expect(result.current.state).toBe("error");
    expect(result.current.error).toBe("Network error");
  });

  it("sets instance when state becomes ready", () => {
    let capturedListener: Function | null = null;
    vi.mocked(pyodideService.onStateChange).mockImplementation((listener) => {
      capturedListener = listener;
      return vi.fn();
    });

    const mockPyodide = createMockPyodide();
    vi.mocked(pyodideService.getInstance).mockReturnValue(mockPyodide);

    const { result } = renderHook(() => usePyodide());

    act(() => {
      capturedListener!("ready");
    });

    expect(result.current.state).toBe("ready");
    expect(result.current.instance).toBe(mockPyodide);
  });
});
