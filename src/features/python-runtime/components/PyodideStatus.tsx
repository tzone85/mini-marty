import type { PyodideLoadingState } from "../types";

interface PyodideStatusProps {
  readonly state: PyodideLoadingState;
  readonly error: string | null;
  readonly onRetry: () => void;
}

function getStatusMessage(state: PyodideLoadingState): string {
  switch (state) {
    case "idle":
      return "Python runtime not started";
    case "loading":
      return "Loading Python runtime...";
    case "ready":
      return "Python ready";
    case "error":
      return "Failed to load Python runtime";
  }
}

function getStatusColor(state: PyodideLoadingState): string {
  switch (state) {
    case "idle":
      return "bg-gray-500";
    case "loading":
      return "bg-yellow-500 animate-pulse";
    case "ready":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
  }
}

export function PyodideStatus({ state, error, onRetry }: PyodideStatusProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5"
      data-testid="pyodide-status"
    >
      <div
        className={`h-2 w-2 rounded-full ${getStatusColor(state)}`}
        data-testid="pyodide-status-indicator"
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {getStatusMessage(state)}
      </span>
      {state === "loading" && (
        <span
          className="text-xs text-gray-400"
          data-testid="pyodide-loading-hint"
        >
          (this may take a few seconds)
        </span>
      )}
      {state === "error" && (
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-red-500" data-testid="pyodide-error">
              {error}
            </span>
          )}
          <button
            onClick={onRetry}
            className="text-xs text-blue-500 hover:text-blue-400 underline"
            data-testid="pyodide-retry"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
