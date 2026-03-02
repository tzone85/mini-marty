export type ExecutionStatus =
  | "idle"
  | "running"
  | "paused"
  | "stepping"
  | "error"
  | "completed";

export type ExecutionSpeed = "slow" | "normal" | "fast";

export const SPEED_MULTIPLIER: Readonly<Record<ExecutionSpeed, number>> = {
  slow: 0.5,
  normal: 1,
  fast: 2,
};

export interface ConsoleEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly type: "command" | "output" | "error" | "info";
  readonly message: string;
}

export interface ExecutionState {
  readonly status: ExecutionStatus;
  readonly speed: ExecutionSpeed;
  readonly currentBlockId: string | null;
  readonly consoleEntries: readonly ConsoleEntry[];
}

export const INITIAL_EXECUTION_STATE: ExecutionState = {
  status: "idle",
  speed: "normal",
  currentBlockId: null,
  consoleEntries: [],
};

export interface BlockLike {
  readonly id: string;
  readonly type: string;
  getFieldValue(name: string): string | number;
  getInputTargetBlock(name: string): BlockLike | null;
  getNextBlock(): BlockLike | null;
}
