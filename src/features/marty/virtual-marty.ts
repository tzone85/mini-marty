import type {
  Leg,
  Direction,
  Foot,
  AccelerometerData,
  MartyCommand,
  CommandResult,
  ExecutionMode,
  MartyStatus,
  MartyEventMap,
} from "./types";
import { MartyEventEmitter } from "./event-emitter";
import { CommandQueue } from "./command-queue";

let commandCounter = 0;

function createCommand(
  name: string,
  category: MartyCommand["category"],
  params: Record<string, unknown>,
  duration: number,
): MartyCommand {
  commandCounter += 1;
  return {
    id: `cmd-${commandCounter}`,
    name,
    category,
    params,
    duration,
    createdAt: Date.now(),
  };
}

export class VirtualMarty {
  private readonly emitter = new MartyEventEmitter();
  private readonly queue = new CommandQueue();
  private status: MartyStatus = "idle";
  private executionMode: ExecutionMode = "blocking";

  constructor() {
    this.queue.onProcess((cmd) => {
      this.emitter.emit("commandStart", cmd);
      this.setStatus("moving");
    });

    this.queue.onComplete((result) => {
      this.emitter.emit("commandComplete", result);
      if (!this.queue.isProcessing) {
        this.setStatus("idle");
      }
    });
  }

  // --- Event emitter delegation ---

  on<K extends keyof MartyEventMap>(
    event: K,
    listener: (data: MartyEventMap[K]) => void,
  ): void {
    this.emitter.on(event, listener);
  }

  off<K extends keyof MartyEventMap>(
    event: K,
    listener: (data: MartyEventMap[K]) => void,
  ): void {
    this.emitter.off(event, listener);
  }

  // --- Execution mode ---

  setExecutionMode(mode: ExecutionMode): void {
    this.executionMode = mode;
  }

  getExecutionMode(): ExecutionMode {
    return this.executionMode;
  }

  // --- Movement commands ---

  walk(steps: number = 2, speed: number = 50): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("walk", "movement", { steps, speed }, 100),
    );
  }

  dance(): Promise<CommandResult> {
    return this.enqueueCommand(createCommand("dance", "movement", {}, 150));
  }

  kick(leg: Leg): Promise<CommandResult> {
    return this.enqueueCommand(createCommand("kick", "movement", { leg }, 80));
  }

  slide(direction: Direction, steps: number = 1): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("slide", "movement", { direction, steps }, 100),
    );
  }

  lean(direction: Direction, amount: number = 30): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("lean", "movement", { direction, amount }, 60),
    );
  }

  wiggle(): Promise<CommandResult> {
    return this.enqueueCommand(createCommand("wiggle", "movement", {}, 120));
  }

  circle_dance(): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("circle_dance", "movement", {}, 200),
    );
  }

  celebrate(): Promise<CommandResult> {
    return this.enqueueCommand(createCommand("celebrate", "movement", {}, 180));
  }

  get_ready(): Promise<CommandResult> {
    return this.enqueueCommand(createCommand("get_ready", "movement", {}, 50));
  }

  stand_straight(): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("stand_straight", "movement", {}, 50),
    );
  }

  // --- Joint control ---

  eyes(position: string): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("eyes", "joint", { position }, 30),
    );
  }

  arms(left: number, right: number): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("arms", "joint", { left, right }, 50),
    );
  }

  move_joint(id: number, angle: number, time: number): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("move_joint", "joint", { id, angle, time }, time),
    );
  }

  // --- Status ---

  is_moving(): boolean {
    return this.status === "moving";
  }

  is_paused(): boolean {
    return this.status === "paused";
  }

  async stop(): Promise<CommandResult> {
    this.queue.clear();
    this.setStatus("idle");
    return { commandId: "stop", success: true };
  }

  async resume(): Promise<CommandResult> {
    if (this.status === "paused") {
      this.setStatus("idle");
    }
    return { commandId: "resume", success: true };
  }

  hold_position(): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("hold_position", "status", {}, 30),
    );
  }

  // --- Sensors (simulated) ---

  foot_on_ground(foot: Foot): boolean {
    return foot === "left" || foot === "right";
  }

  get_distance_sensor(): number {
    return 100;
  }

  get_accelerometer(): AccelerometerData {
    return { x: 0, y: 0, z: 9.8 };
  }

  // --- Sound ---

  play_sound(name: string): Promise<CommandResult> {
    return this.enqueueCommand(
      createCommand("play_sound", "sound", { name }, 80),
    );
  }

  // --- Internal ---

  private setStatus(newStatus: MartyStatus): void {
    if (this.status !== newStatus) {
      const previous = this.status;
      this.status = newStatus;
      this.emitter.emit("statusChange", { previous, current: newStatus });
    }
  }

  private enqueueCommand(command: MartyCommand): Promise<CommandResult> {
    return this.queue.enqueue(command, { mode: this.executionMode });
  }
}
