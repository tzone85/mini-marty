export type Direction = "left" | "right";
export type Leg = "left" | "right";
export type EyePosition = "normal" | "wide" | "angry" | "excited" | "squint";
export type FootSide = "left" | "right";

export type CommandStatus = "pending" | "running" | "completed" | "error";

export interface MovementCommand {
  readonly type: "movement";
  readonly action:
    | "walk"
    | "dance"
    | "kick"
    | "slide"
    | "lean"
    | "wiggle"
    | "circle_dance"
    | "celebrate"
    | "get_ready"
    | "stand_straight";
  readonly params: Readonly<Record<string, unknown>>;
  readonly duration: number;
}

export interface JointCommand {
  readonly type: "joint";
  readonly action: "eyes" | "arms" | "move_joint";
  readonly params: Readonly<Record<string, unknown>>;
  readonly duration: number;
}

export interface SoundCommand {
  readonly type: "sound";
  readonly action: "play_sound";
  readonly params: Readonly<Record<string, unknown>>;
  readonly duration: number;
}

export interface StatusCommand {
  readonly type: "status";
  readonly action: "stop" | "resume" | "hold_position";
  readonly params: Readonly<Record<string, unknown>>;
  readonly duration: number;
}

export type MartyCommand =
  | MovementCommand
  | JointCommand
  | SoundCommand
  | StatusCommand;

export interface QueuedCommand {
  readonly id: string;
  readonly command: MartyCommand;
  readonly status: CommandStatus;
  readonly blocking: boolean;
  readonly createdAt: number;
}

export type MartyEventType =
  | "commandStart"
  | "commandComplete"
  | "commandError"
  | "statusChange";

export interface CommandStartEvent {
  readonly type: "commandStart";
  readonly commandId: string;
  readonly command: MartyCommand;
}

export interface CommandCompleteEvent {
  readonly type: "commandComplete";
  readonly commandId: string;
  readonly command: MartyCommand;
}

export interface CommandErrorEvent {
  readonly type: "commandError";
  readonly commandId: string;
  readonly command: MartyCommand;
  readonly error: string;
}

export interface StatusChangeEvent {
  readonly type: "statusChange";
  readonly isMoving: boolean;
  readonly isPaused: boolean;
}

export type MartyEvent =
  | CommandStartEvent
  | CommandCompleteEvent
  | CommandErrorEvent
  | StatusChangeEvent;

export type MartyEventMap = {
  readonly commandStart: CommandStartEvent;
  readonly commandComplete: CommandCompleteEvent;
  readonly commandError: CommandErrorEvent;
  readonly statusChange: StatusChangeEvent;
};

export interface SensorData {
  readonly footOnGround: Readonly<Record<FootSide, boolean>>;
  readonly distance: number;
  readonly accelerometer: Readonly<{ x: number; y: number; z: number }>;
}

export type ExecutionMode = "blocking" | "non-blocking";
