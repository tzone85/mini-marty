import { describe, expect, it, vi } from "vitest";
import {
  formatPythonError,
  executePythonCode,
  registerMartyModule,
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
  it("offsets reported line numbers by the wrapper prelude", () => {
    // The wrapper adds 6 prelude lines, so wrapped line 7 maps to user line 1.
    expect(formatPythonError("Error at line 7 of file")).toContain("line 1");
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
  it("strips martypy imports from the user-supplied code", async () => {
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
    // The wrapper adds its own `from martypy import Marty` at the top;
    // the user-code section (indented 4 spaces) should not contain the import.
    expect(calls.join("\n")).not.toContain("    from martypy import Marty");
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
  it("strips plain `import martypy` lines from user code", async () => {
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
    // The indented user-code section should not contain `import martypy`.
    expect(calls.join("\n")).not.toContain("    import martypy");
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
