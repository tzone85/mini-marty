export type PyodideLoadingState = "idle" | "loading" | "ready" | "error";

export interface PyodideStatus {
  readonly state: PyodideLoadingState;
  readonly error: string | null;
}

export interface ConsoleEntry {
  readonly id: string;
  readonly type: "stdout" | "stderr" | "info";
  readonly text: string;
  readonly timestamp: number;
}

export interface PythonExecutionResult {
  readonly success: boolean;
  readonly error: string | null;
}

export interface ExecutionState {
  readonly isRunning: boolean;
  readonly consoleEntries: readonly ConsoleEntry[];
  readonly lastError: string | null;
}
