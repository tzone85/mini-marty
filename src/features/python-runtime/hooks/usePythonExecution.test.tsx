import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

vi.mock("../python-executor", () => ({
  registerMartyModule: vi.fn(async () => {}),
  executePythonCode: vi.fn(async (_p: unknown, _code: string, cb: any) => {
    cb.onStdout({
      id: "1",
      type: "stdout",
      text: "hello\n",
      timestamp: 0,
    });
    return { success: true, error: null };
  }),
}));

import { usePythonExecution } from "./usePythonExecution";
import * as executor from "../python-executor";
import { VirtualMarty } from "@/features/marty/virtual-marty";

const fakePyodide = {
  runPythonAsync: vi.fn(),
  registerJsModule: vi.fn(),
  setStdout: vi.fn(),
  setStderr: vi.fn(),
  globals: { get: () => null },
};

describe("usePythonExecution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ignores run() when pyodide or marty is null", async () => {
    const { result } = renderHook(() => usePythonExecution(null, null));
    await act(async () => {
      await result.current.run("print('hi')");
    });
    expect(result.current.isRunning).toBe(false);
    expect(executor.executePythonCode).not.toHaveBeenCalled();
  });

  it("captures stdout entries and flips isRunning during execution", async () => {
    const marty = new VirtualMarty();
    const { result } = renderHook(() =>
      usePythonExecution(fakePyodide as any, marty),
    );

    await act(async () => {
      await result.current.run("print('hi')");
    });

    expect(executor.registerMartyModule).toHaveBeenCalledTimes(1);
    expect(executor.executePythonCode).toHaveBeenCalledTimes(1);
    expect(result.current.consoleEntries.length).toBe(1);
    expect(result.current.consoleEntries[0].text).toBe("hello\n");
    expect(result.current.isRunning).toBe(false);
    expect(result.current.lastError).toBeNull();
  });

  it("records lastError when execution returns a failure result", async () => {
    vi.mocked(executor.executePythonCode).mockResolvedValueOnce({
      success: false,
      error: "SyntaxError: bad",
    });
    const marty = new VirtualMarty();
    const { result } = renderHook(() =>
      usePythonExecution(fakePyodide as any, marty),
    );

    await act(async () => {
      await result.current.run("oops");
    });

    expect(result.current.lastError).toBe("SyntaxError: bad");
  });

  it("only registers the marty module once across multiple runs", async () => {
    const marty = new VirtualMarty();
    const { result } = renderHook(() =>
      usePythonExecution(fakePyodide as any, marty),
    );
    await act(async () => {
      await result.current.run("print(1)");
    });
    await act(async () => {
      await result.current.run("print(2)");
    });
    expect(executor.registerMartyModule).toHaveBeenCalledTimes(1);
    expect(executor.executePythonCode).toHaveBeenCalledTimes(2);
  });

  it("clearConsole resets entries and lastError", async () => {
    const marty = new VirtualMarty();
    const { result } = renderHook(() =>
      usePythonExecution(fakePyodide as any, marty),
    );
    await act(async () => {
      await result.current.run("print('hi')");
    });
    expect(result.current.consoleEntries.length).toBeGreaterThan(0);
    act(() => {
      result.current.clearConsole();
    });
    expect(result.current.consoleEntries.length).toBe(0);
    expect(result.current.lastError).toBeNull();
  });

  it("stop() calls marty.stop and flips isRunning false", async () => {
    const marty = new VirtualMarty();
    const stopSpy = vi.spyOn(marty, "stop");
    const { result } = renderHook(() =>
      usePythonExecution(fakePyodide as any, marty),
    );
    act(() => {
      result.current.stop();
    });
    expect(stopSpy).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });
});
