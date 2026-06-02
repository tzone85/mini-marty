import { describe, expect, it, vi } from "vitest";
import { PyodideLoader } from "./pyodide-loader";
import type { PyodideInstance } from "./pyodide-service";

const fakeInstance: PyodideInstance = {
  runPythonAsync: async () => null,
  registerJsModule: () => {},
  setStdout: () => {},
  setStderr: () => {},
  globals: { get: () => null },
};

describe("PyodideLoader", () => {
  it("returns existing instance if already loaded", async () => {
    const loader = new PyodideLoader({
      injectScript: async () => {},
      readGlobalLoader: () => async () => fakeInstance,
      events: { notify: vi.fn() },
    });
    const a = await loader.load();
    const b = await loader.load();
    expect(a).toBe(b);
  });
  it("rejects when global loader missing", async () => {
    const loader = new PyodideLoader({
      injectScript: async () => {},
      readGlobalLoader: () => null,
      events: { notify: vi.fn() },
    });
    await expect(loader.load()).rejects.toThrow(/loadPyodide/);
  });
  it("notifies loading then ready on success", async () => {
    const notify = vi.fn();
    const loader = new PyodideLoader({
      injectScript: async () => {},
      readGlobalLoader: () => async () => fakeInstance,
      events: { notify },
    });
    await loader.load();
    expect(notify).toHaveBeenCalledWith("loading");
    expect(notify).toHaveBeenCalledWith("ready");
  });
  it("notifies error when injectScript fails", async () => {
    const notify = vi.fn();
    const loader = new PyodideLoader({
      injectScript: async () => {
        throw new Error("network down");
      },
      readGlobalLoader: () => async () => fakeInstance,
      events: { notify },
    });
    await expect(loader.load()).rejects.toThrow(/network down/);
    expect(notify).toHaveBeenCalledWith("error", expect.any(String));
  });
});
