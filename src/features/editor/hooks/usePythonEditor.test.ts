import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { usePythonEditor } from "./usePythonEditor";
import { STARTER_TEMPLATE } from "../martypy-completions";

describe("usePythonEditor", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with the starter template", () => {
    const { result } = renderHook(() => usePythonEditor());
    expect(result.current.code).toBe(STARTER_TEMPLATE);
  });

  it("updates code via setCode", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("print('hello')");
    });
    expect(result.current.code).toBe("print('hello')");
  });

  it("clears code to starter template", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("some code");
    });
    act(() => {
      result.current.clearCode();
    });
    expect(result.current.code).toBe(STARTER_TEMPLATE);
  });

  it("saves code to localStorage", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.setCode("saved code");
    });
    act(() => {
      result.current.saveCode();
    });
    expect(localStorage.getItem("mini-marty-python-code")).toBe("saved code");
  });

  it("loads code from localStorage", () => {
    localStorage.setItem("mini-marty-python-code", "loaded code");
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.loadCode();
    });
    expect(result.current.code).toBe("loaded code");
  });

  it("keeps starter template if no saved code in localStorage", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.loadCode();
    });
    expect(result.current.code).toBe(STARTER_TEMPLATE);
  });

  it("starts with isRunning false", () => {
    const { result } = renderHook(() => usePythonEditor());
    expect(result.current.isRunning).toBe(false);
  });

  it("sets isRunning to true when run is called", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.run();
    });
    expect(result.current.isRunning).toBe(true);
  });

  it("sets isRunning to false when stop is called", () => {
    const { result } = renderHook(() => usePythonEditor());
    act(() => {
      result.current.run();
    });
    act(() => {
      result.current.stop();
    });
    expect(result.current.isRunning).toBe(false);
  });
});
