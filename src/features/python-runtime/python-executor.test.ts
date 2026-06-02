import { describe, expect, it, vi } from "vitest";
import {
  formatPythonError,
  executePythonCode,
  registerMartyModule,
  resetEntryCounter,
} from "./python-executor";
import type { PyodideInstance } from "./pyodide-service";
import { VirtualMarty } from "@/features/marty/virtual-marty";

function fakePyodide(
  overrides: Partial<PyodideInstance> = {},
): PyodideInstance {
  return {
    runPythonAsync: async () => null,
    registerJsModule: () => {},
    setStdout: () => {},
    setStderr: () => {},
    globals: { get: () => null },
    ...overrides,
  };
}

describe("formatPythonError", () => {
  it("subtracts 5 from line numbers", () => {
    expect(formatPythonError("Error at line 6 of file")).toContain("line 1");
  });
  it("never goes below 1", () => {
    expect(formatPythonError("Error at line 2")).toContain("line 1");
  });
  it("leaves unrelated lines untouched", () => {
    expect(formatPythonError("NameError: x not defined")).toContain(
      "NameError",
    );
  });
});

describe("executePythonCode", () => {
  it("strips martypy imports and runs wrapped code", async () => {
    resetEntryCounter();
    const calls: string[] = [];
    const fake = fakePyodide({
      runPythonAsync: async (s: string) => {
        calls.push(s);
        return null;
      },
    });
    const r = await executePythonCode(
      fake,
      "from martypy import Marty\nprint('x')",
      {
        onStdout: vi.fn(),
        onStderr: vi.fn(),
      },
    );
    expect(r.success).toBe(true);
    expect(calls.join("\n")).not.toContain("from martypy import Marty");
  });
  it("surfaces errors via onStderr", async () => {
    const fake = fakePyodide({
      runPythonAsync: async () => {
        throw new Error("BAD");
      },
    });
    const onStderr = vi.fn();
    const r = await executePythonCode(fake, "x", {
      onStdout: vi.fn(),
      onStderr,
    });
    expect(r.success).toBe(false);
    expect(onStderr).toHaveBeenCalled();
  });
  it("strips plain `import martypy` lines as well", async () => {
    const calls: string[] = [];
    const fake = fakePyodide({
      runPythonAsync: async (s: string) => {
        calls.push(s);
        return null;
      },
    });
    await executePythonCode(fake, "import martypy\nprint('hi')", {
      onStdout: vi.fn(),
      onStderr: vi.fn(),
    });
    expect(calls.join("\n")).not.toContain("import martypy");
  });
});

describe("registerMartyModule", () => {
  it("registers bridge and runs module code", async () => {
    const registerJsModule = vi.fn();
    const runPythonAsync = vi.fn(async () => null);
    const fake = fakePyodide({ registerJsModule, runPythonAsync });
    await registerMartyModule(fake, new VirtualMarty());
    expect(registerJsModule).toHaveBeenCalledWith(
      "pyodide_js",
      expect.objectContaining({ _marty_bridge: expect.any(Object) }),
    );
    expect(runPythonAsync).toHaveBeenCalled();
  });
});
