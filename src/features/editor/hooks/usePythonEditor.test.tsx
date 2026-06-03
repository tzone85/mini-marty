import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePythonEditor } from "./usePythonEditor";
import { STARTER_TEMPLATE } from "../martypy-completions";

describe("usePythonEditor", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with the starter template and not running", () => {
    const { result } = renderHook(() => usePythonEditor());
    expect(result.current.code).toBe(STARTER_TEMPLATE);
    expect(result.current.isRunning).toBe(false);
  });

  it("setCode replaces the code", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("print('hi')");
    });
    expect(result.current.code).toBe("print('hi')");
  });

  it("clearCode resets to the starter template", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("garbage");
    });
    act(() => {
      result.current.clearCode();
    });
    expect(result.current.code).toBe(STARTER_TEMPLATE);
  });

  it("saveCode persists current code and loadCode restores it", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("custom code");
    });
    act(() => {
      result.current.saveCode();
    });
    act(() => {
      result.current.clearCode();
    });
    expect(result.current.code).toBe(STARTER_TEMPLATE);
    act(() => {
      result.current.loadCode();
    });
    expect(result.current.code).toBe("custom code");
  });

  it("loadCode is a no-op when nothing is saved", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.loadCode();
    });
    expect(result.current.code).toBe(STARTER_TEMPLATE);
  });

  it("run + stop toggle the isRunning flag", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.run();
    });
    expect(result.current.isRunning).toBe(true);
    act(() => {
      result.current.stop();
    });
    expect(result.current.isRunning).toBe(false);
  });
});
