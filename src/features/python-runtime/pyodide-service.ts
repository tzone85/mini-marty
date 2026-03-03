import type { PyodideLoadingState } from "./types";

const PYODIDE_VERSION = "0.27.5";
const PYODIDE_CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;
const PYODIDE_CDN_URL = `${PYODIDE_CDN_BASE}/pyodide.js`;

export interface PyodideInstance {
  readonly runPythonAsync: (code: string) => Promise<unknown>;
  readonly registerJsModule: (name: string, module: object) => void;
  readonly setStdout: (options: { batched: (text: string) => void }) => void;
  readonly setStderr: (options: { batched: (text: string) => void }) => void;
  readonly globals: { get: (name: string) => unknown };
}

type StateListener = (state: PyodideLoadingState, error?: string) => void;

let pyodideInstance: PyodideInstance | null = null;
let loadPromise: Promise<PyodideInstance> | null = null;
const stateListeners: StateListener[] = [];

function notifyListeners(state: PyodideLoadingState, error?: string): void {
  for (const listener of stateListeners) {
    listener(state, error);
  }
}

export function onStateChange(listener: StateListener): () => void {
  stateListeners.push(listener);
  return () => {
    const index = stateListeners.indexOf(listener);
    if (index >= 0) {
      stateListeners.splice(index, 1);
    }
  };
}

export function getLoadingState(): PyodideLoadingState {
  if (pyodideInstance) return "ready";
  if (loadPromise) return "loading";
  return "idle";
}

export function getInstance(): PyodideInstance | null {
  return pyodideInstance;
}

async function loadPyodideScript(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Pyodide can only be loaded in a browser environment");
  }

  const existingScript = document.querySelector(
    `script[src="${PYODIDE_CDN_URL}"]`,
  );
  if (existingScript) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PYODIDE_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });
}

export async function loadPyodide(): Promise<PyodideInstance> {
  if (pyodideInstance) return pyodideInstance;

  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      notifyListeners("loading");

      await loadPyodideScript();

      const globalWindow = window as unknown as {
        loadPyodide?: (options: {
          indexURL: string;
        }) => Promise<PyodideInstance>;
      };

      if (!globalWindow.loadPyodide) {
        throw new Error("loadPyodide function not found on window");
      }

      const instance = await globalWindow.loadPyodide({
        indexURL: `${PYODIDE_CDN_BASE}/`,
      });

      pyodideInstance = instance;
      notifyListeners("ready");
      return instance;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error loading Pyodide";
      loadPromise = null;
      notifyListeners("error", message);
      throw new Error(`Pyodide initialization failed: ${message}`);
    }
  })();

  return loadPromise;
}

export function resetForTesting(): void {
  pyodideInstance = null;
  loadPromise = null;
  stateListeners.length = 0;
}
