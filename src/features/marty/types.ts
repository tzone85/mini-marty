export type Leg = "left" | "right";
export type Direction = "left" | "right" | "forward" | "backward";
export type Foot = "left" | "right";

export interface AccelerometerData {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export type CommandCategory =
  | "movement"
  | "joint"
  | "status"
  | "sensor"
  | "sound";

export interface MartyCommand {
  readonly id: string;
  readonly name: string;
  readonly category: CommandCategory;
  readonly params: Record<string, unknown>;
  readonly duration: number;
  readonly createdAt: number;
}

export interface CommandResult {
  readonly commandId: string;
  readonly success: boolean;
  readonly data?: unknown;
  readonly error?: string;
}

export type ExecutionMode = "blocking" | "non-blocking";

export interface CommandOptions {
  readonly mode: ExecutionMode;
}

export type MartyStatus = "idle" | "moving" | "paused" | "error";

export interface MartyEventMap {
  commandStart: MartyCommand;
  commandComplete: CommandResult;
  commandError: CommandResult;
  statusChange: { previous: MartyStatus; current: MartyStatus };
}
