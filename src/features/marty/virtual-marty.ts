import type {
  Direction,
  Leg,
  EyePosition,
  FootSide,
  ExecutionMode,
  MartyCommand,
  MartyEventType,
  MartyEventMap,
  SensorData,
} from "./types";
import { MartyEventEmitter } from "./event-emitter";
import { CommandQueue } from "./command-queue";

const DEFAULT_SENSOR_DATA: SensorData = {
  footOnGround: { left: true, right: true },
  distance: 100,
  accelerometer: { x: 0, y: -9.8, z: 0 },
};

export class VirtualMarty {
  private readonly emitter = new MartyEventEmitter();
  private readonly queue = new CommandQueue();
  private executionMode: ExecutionMode = "blocking";
  private moving = false;
  private paused = false;
  private sensorData: SensorData = { ...DEFAULT_SENSOR_DATA };

  constructor() {
    this.queue.onCommandStart((event) => {
      this.moving = true;
      this.emitter.emit("commandStart", {
        type: "commandStart",
        commandId: event.commandId,
        command: event.command,
      });
      this.emitter.emit("statusChange", {
        type: "statusChange",
        isMoving: true,
        isPaused: this.paused,
      });
    });

    this.queue.onCommandComplete((event) => {
      this.moving = false;
      this.emitter.emit("commandComplete", {
        type: "commandComplete",
        commandId: event.commandId,
        command: event.command,
      });
      this.emitter.emit("statusChange", {
        type: "statusChange",
        isMoving: false,
        isPaused: this.paused,
      });
    });
  }

  // --- Event API ---

  on<T extends MartyEventType>(
    type: T,
    listener: (event: MartyEventMap[T]) => void,
  ): void {
    this.emitter.on(type, listener);
  }

  off<T extends MartyEventType>(
    type: T,
    listener: (event: MartyEventMap[T]) => void,
  ): void {
    this.emitter.off(type, listener);
  }

  // --- Execution Mode ---

  getExecutionMode(): ExecutionMode {
    return this.executionMode;
  }

  setExecutionMode(mode: ExecutionMode): void {
    this.executionMode = mode;
  }

  // --- Movement Commands ---

  walk(steps = 2, speed = 50): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "walk",
      params: { steps, speed },
      duration: 1000,
    });
  }

  dance(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "dance",
      params: {},
      duration: 2000,
    });
  }

  kick(leg: Leg = "right"): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "kick",
      params: { leg },
      duration: 1000,
    });
  }

  slide(direction: Direction = "left", steps = 1): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "slide",
      params: { direction, steps },
      duration: 1000,
    });
  }

  lean(direction: Direction = "left", amount = 30): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "lean",
      params: { direction, amount },
      duration: 500,
    });
  }

  wiggle(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "wiggle",
      params: {},
      duration: 1500,
    });
  }

  circle_dance(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "circle_dance",
      params: {},
      duration: 3000,
    });
  }

  celebrate(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "celebrate",
      params: {},
      duration: 2000,
    });
  }

  get_ready(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "get_ready",
      params: {},
      duration: 500,
    });
  }

  stand_straight(): Promise<void> {
    return this.enqueueCommand({
      type: "movement",
      action: "stand_straight",
      params: {},
      duration: 500,
    });
  }

  // --- Joint Control ---

  eyes(position: EyePosition = "normal"): Promise<void> {
    return this.enqueueCommand({
      type: "joint",
      action: "eyes",
      params: { position },
      duration: 300,
    });
  }

  arms(left = 0, right = 0): Promise<void> {
    return this.enqueueCommand({
      type: "joint",
      action: "arms",
      params: { left, right },
      duration: 500,
    });
  }

  move_joint(id: number, angle: number, time: number): Promise<void> {
    return this.enqueueCommand({
      type: "joint",
      action: "move_joint",
      params: { id, angle, time },
      duration: time,
    });
  }

  // --- Status ---

  is_moving(): boolean {
    return this.moving;
  }

  is_paused(): boolean {
    return this.paused;
  }

  stop(): Promise<void> {
    this.moving = false;
    this.queue.clear();
    return Promise.resolve();
  }

  resume(): Promise<void> {
    this.paused = false;
    return Promise.resolve();
  }

  hold_position(): Promise<void> {
    return this.enqueueCommand({
      type: "status",
      action: "hold_position",
      params: {},
      duration: 100,
    });
  }

  // --- Sensors (simulated) ---

  foot_on_ground(foot: FootSide): boolean {
    return this.sensorData.footOnGround[foot];
  }

  get_distance_sensor(): number {
    return this.sensorData.distance;
  }

  get_accelerometer(): Readonly<{ x: number; y: number; z: number }> {
    return { ...this.sensorData.accelerometer };
  }

  // --- Sound ---

  play_sound(name: string): Promise<void> {
    return this.enqueueCommand({
      type: "sound",
      action: "play_sound",
      params: { name },
      duration: 2000,
    });
  }

  // --- Internal ---

  private enqueueCommand(command: MartyCommand): Promise<void> {
    return this.queue.enqueue(command, this.executionMode);
  }
}
