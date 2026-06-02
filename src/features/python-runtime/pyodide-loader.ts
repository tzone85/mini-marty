import type { PyodideInstance } from "./pyodide-service";

const PYODIDE_VERSION = "0.27.5";
export const PYODIDE_CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;
export const PYODIDE_CDN_URL = `${PYODIDE_CDN_BASE}/pyodide.js`;

export type GlobalLoaderFn = (opts: {
  indexURL: string;
}) => Promise<PyodideInstance>;

export interface LoaderDeps {
  injectScript(url: string): Promise<void>;
  readGlobalLoader(): GlobalLoaderFn | null;
  events: {
    notify(state: "loading" | "ready" | "error", error?: string): void;
  };
}

export class PyodideLoader {
  private instance: PyodideInstance | null = null;
  private inflight: Promise<PyodideInstance> | null = null;

  constructor(private readonly deps: LoaderDeps) {}

  async load(): Promise<PyodideInstance> {
    if (this.instance) return this.instance;
    if (this.inflight) return this.inflight;
    this.inflight = (async () => {
      try {
        this.deps.events.notify("loading");
        await this.deps.injectScript(PYODIDE_CDN_URL);
        const fn = this.deps.readGlobalLoader();
        if (!fn) throw new Error("loadPyodide function not found on window");
        const i = await fn({ indexURL: `${PYODIDE_CDN_BASE}/` });
        this.instance = i;
        this.deps.events.notify("ready");
        return i;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        this.inflight = null;
        this.deps.events.notify("error", msg);
        throw new Error(`Pyodide initialization failed: ${msg}`);
      }
    })();
    return this.inflight;
  }
}

export function browserScriptInjector(): LoaderDeps["injectScript"] {
  return async (url: string) => {
    if (typeof window === "undefined") {
      throw new Error("Pyodide can only be loaded in a browser environment");
    }
    if (document.querySelector(`script[src="${url}"]`)) return;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Pyodide script"));
      document.head.appendChild(s);
    });
  };
}

export function browserGlobalLoaderReader(): LoaderDeps["readGlobalLoader"] {
  return () => {
    if (typeof window === "undefined") return null;
    return (
      (window as unknown as { loadPyodide?: GlobalLoaderFn }).loadPyodide ??
      null
    );
  };
}
