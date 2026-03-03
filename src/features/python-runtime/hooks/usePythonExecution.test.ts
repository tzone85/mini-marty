import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePythonExecution } from "./usePythonExecution";
import * as pythonExecutor from "../python-executor";
import type { PyodideInstance } from "../pyodide-service";
import { VirtualMarty } from "@/features/marty/virtual-marty";

vi.mock("../python-executor", () => ({
  registerMartyModule: vi.fn().mockResolvedValue(undefined),
  executePythonCode: vi.fn().mockResolvedValue({ success: true, error: null }),
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

describe("usePythonExecution", () => {
  let mockPyodide: PyodideInstance;
  let mockMarty: VirtualMarty;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPyodide = createMockPyodide();
    mockMarty = new VirtualMarty();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    expect(result.current.isRunning).toBe(false);
    expect(result.current.consoleEntries).toHaveLength(0);
    expect(result.current.lastError).toBeNull();
  });

  it("provides run, stop, and clearConsole functions", () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    expect(typeof result.current.run).toBe("function");
    expect(typeof result.current.stop).toBe("function");
    expect(typeof result.current.clearConsole).toBe("function");
  });

  it("does nothing when run called without pyodide", async () => {
    const { result } = renderHook(() => usePythonExecution(null, mockMarty));

    await act(async () => {
      await result.current.run("print('hello')");
    });

    expect(pythonExecutor.executePythonCode).not.toHaveBeenCalled();
  });

  it("does nothing when run called without marty", async () => {
    const { result } = renderHook(() => usePythonExecution(mockPyodide, null));

    await act(async () => {
      await result.current.run("print('hello')");
    });

    expect(pythonExecutor.executePythonCode).not.toHaveBeenCalled();
  });

  it("registers marty module on first run", async () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("print('hello')");
    });

    expect(pythonExecutor.registerMartyModule).toHaveBeenCalledWith(
      mockPyodide,
      mockMarty,
    );
  });

  it("only registers marty module once", async () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("print('hello')");
    });

    await act(async () => {
      await result.current.run("print('world')");
    });

    expect(pythonExecutor.registerMartyModule).toHaveBeenCalledTimes(1);
  });

  it("executes python code", async () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("print('hello')");
    });

    expect(pythonExecutor.executePythonCode).toHaveBeenCalledWith(
      mockPyodide,
      "print('hello')",
      expect.objectContaining({
        onStdout: expect.any(Function),
        onStderr: expect.any(Function),
      }),
    );
  });

  it("sets lastError on execution failure", async () => {
    vi.mocked(pythonExecutor.executePythonCode).mockResolvedValue({
      success: false,
      error: "SyntaxError",
    });

    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("bad code");
    });

    expect(result.current.lastError).toBe("SyntaxError");
  });

  it("sets lastError on thrown exception", async () => {
    vi.mocked(pythonExecutor.executePythonCode).mockRejectedValue(
      new Error("Unexpected failure"),
    );

    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("crash");
    });

    expect(result.current.lastError).toBe("Unexpected failure");
  });

  it("clears console entries", async () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    await act(async () => {
      await result.current.run("print('hello')");
    });

    act(() => {
      result.current.clearConsole();
    });

    expect(result.current.consoleEntries).toHaveLength(0);
    expect(result.current.lastError).toBeNull();
  });

  it("stop calls marty.stop()", () => {
    const stopSpy = vi.spyOn(mockMarty, "stop");
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    act(() => {
      result.current.stop();
    });

    expect(stopSpy).toHaveBeenCalled();
  });

  it("sets isRunning to false on stop", () => {
    const { result } = renderHook(() =>
      usePythonExecution(mockPyodide, mockMarty),
    );

    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
  });
});
