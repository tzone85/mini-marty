import { describe, expect, it } from "vitest";
import { PyodideRegistry } from "./pyodide-registry";
import type { PyodideInstance } from "./pyodide-service";

describe("PyodideRegistry", () => {
  it("starts empty", () => {
    const r = new PyodideRegistry();
    expect(r.getInstance()).toBeNull();
  });
  it("sets and resets", () => {
    const r = new PyodideRegistry();
    const fake = {
      runPythonAsync: async () => null,
      registerJsModule: () => {},
      setStdout: () => {},
      setStderr: () => {},
      globals: { get: () => null },
    } satisfies PyodideInstance;
    r.setInstance(fake);
    expect(r.getInstance()).toBe(fake);
    r.reset();
    expect(r.getInstance()).toBeNull();
  });
});
