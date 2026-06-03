import type { VirtualMarty } from "@/features/marty/virtual-marty";
import type { Direction, Leg, FootSide } from "@/features/marty/types";
import type { BlockLike } from "./types";

export interface InterpreterCallbacks {
  readonly onBlockStart: (blockId: string, description: string) => void;
  readonly onBlockComplete: (blockId: string) => void;
  readonly onOutput: (message: string) => void;
  readonly onError: (message: string) => void;
  readonly shouldPause: () => boolean;
  readonly waitForResume: () => Promise<void>;
  readonly isStopped: () => boolean;
  readonly getSpeedMultiplier: () => number;
}

export class BlockInterpreter {
  private readonly marty: VirtualMarty;
  private readonly callbacks: InterpreterCallbacks;

  constructor(marty: VirtualMarty, callbacks: InterpreterCallbacks) {
    this.marty = marty;
    this.callbacks = callbacks;
  }

  async executeChain(block: BlockLike | null): Promise<void> {
    let current = block;
    while (current !== null) {
      if (this.callbacks.isStopped()) {
        return;
      }

      if (this.callbacks.shouldPause()) {
        await this.callbacks.waitForResume();
      }

      if (this.callbacks.isStopped()) {
        return;
      }

      await this.executeBlock(current);
      current = current.getNextBlock();
    }
  }

  private async executeBlock(block: BlockLike): Promise<void> {
    const description = this.describeBlock(block);
    this.callbacks.onBlockStart(block.id, description);

    try {
      await this.interpretBlock(block);
      this.callbacks.onBlockComplete(block.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      this.callbacks.onError(`Error in "${block.type}": ${message}`);
      throw err;
    }
  }

  private async interpretBlock(block: BlockLike): Promise<void> {
    switch (block.type) {
      // Motion blocks
      case "marty_walk":
        return this.marty.walk(Number(block.getFieldValue("STEPS")));
      case "marty_turn":
        // Turn is simulated as a wiggle (no direct turn API)
        this.callbacks.onOutput(
          `Turning ${block.getFieldValue("DEGREES")} degrees`,
        );
        return this.marty.wiggle();
      case "marty_slide":
        return this.marty.slide(block.getFieldValue("DIRECTION") as Direction);
      case "marty_kick":
        return this.marty.kick(block.getFieldValue("LEG") as Leg);
      case "marty_dance":
        return this.marty.dance();
      case "marty_circle_dance":
        return this.marty.circle_dance();
      case "marty_wiggle":
        return this.marty.wiggle();
      case "marty_lean":
        return this.marty.lean(block.getFieldValue("DIRECTION") as Direction);
      case "marty_celebrate":
        return this.marty.celebrate();
      case "marty_get_ready":
        return this.marty.get_ready();
      case "marty_stand_straight":
        return this.marty.stand_straight();
      case "marty_eyes": {
        const pos = Number(block.getFieldValue("POSITION"));
        const eyePosition = mapEyePosition(pos);
        return this.marty.eyes(eyePosition);
      }
      case "marty_arms":
        return this.marty.arms(
          Number(block.getFieldValue("LEFT")),
          Number(block.getFieldValue("RIGHT")),
        );

      // Sound blocks
      case "marty_play_sound":
        return this.marty.play_sound(String(block.getFieldValue("SOUND")));

      // Control blocks
      case "marty_wait":
        return this.executeWait(block);
      case "marty_repeat":
        return this.executeRepeat(block);
      case "marty_if_else":
        return this.executeIfElse(block);
      case "marty_forever":
        return this.executeForever(block);

      // Event blocks (no-op, just entry points)
      case "marty_when_start":
      case "marty_when_key_pressed":
        return;

      default:
        this.callbacks.onOutput(`Unknown block type: ${block.type}`);
    }
  }

  private async executeWait(block: BlockLike): Promise<void> {
    const seconds = Number(block.getFieldValue("SECONDS"));
    const speedMultiplier = this.callbacks.getSpeedMultiplier();
    const delayMs = (seconds * 1000) / speedMultiplier;
    this.callbacks.onOutput(`Waiting ${seconds} seconds...`);
    await sleep(delayMs);
  }

  private async executeRepeat(block: BlockLike): Promise<void> {
    const times = Number(block.getFieldValue("TIMES"));
    const body = block.getInputTargetBlock("DO");

    for (let i = 0; i < times; i++) {
      if (this.callbacks.isStopped()) {
        return;
      }
      this.callbacks.onOutput(`Repeat ${i + 1}/${times}`);
      await this.executeChain(body);
    }
  }

  private async executeIfElse(block: BlockLike): Promise<void> {
    const conditionBlock = block.getInputTargetBlock("CONDITION");
    const condition = conditionBlock
      ? this.evaluateCondition(conditionBlock)
      : false;

    this.callbacks.onOutput(`Condition: ${condition}`);

    if (condition) {
      const body = block.getInputTargetBlock("DO");
      await this.executeChain(body);
    }
  }

  private async executeForever(block: BlockLike): Promise<void> {
    const body = block.getInputTargetBlock("DO");
    let iteration = 0;
    const MAX_ITERATIONS = 1000;

    while (!this.callbacks.isStopped()) {
      iteration++;
      if (iteration > MAX_ITERATIONS) {
        this.callbacks.onError(
          `Forever loop safety limit reached (${MAX_ITERATIONS} iterations). Stopping.`,
        );
        return;
      }

      if (this.callbacks.shouldPause()) {
        await this.callbacks.waitForResume();
      }

      await this.executeChain(body);
    }
  }

  evaluateCondition(block: BlockLike): boolean {
    switch (block.type) {
      case "marty_foot_on_ground":
        return this.marty.foot_on_ground(
          block.getFieldValue("FOOT") as FootSide,
        );
      case "marty_is_moving":
        return this.marty.is_moving();
      default:
        return false;
    }
  }

  evaluateNumber(block: BlockLike): number {
    switch (block.type) {
      case "marty_get_distance":
        return this.marty.get_distance_sensor();
      default:
        return 0;
    }
  }

  private describeBlock(block: BlockLike): string {
    switch (block.type) {
      case "marty_walk":
        return `Walk ${block.getFieldValue("STEPS")} steps`;
      case "marty_turn":
        return `Turn ${block.getFieldValue("DEGREES")} degrees`;
      case "marty_slide":
        return `Slide ${block.getFieldValue("DIRECTION")}`;
      case "marty_kick":
        return `Kick ${block.getFieldValue("LEG")}`;
      case "marty_dance":
        return "Dance";
      case "marty_circle_dance":
        return "Circle dance";
      case "marty_wiggle":
        return "Wiggle";
      case "marty_lean":
        return `Lean ${block.getFieldValue("DIRECTION")}`;
      case "marty_celebrate":
        return "Celebrate";
      case "marty_get_ready":
        return "Get ready";
      case "marty_stand_straight":
        return "Stand straight";
      case "marty_eyes":
        return `Eyes position ${block.getFieldValue("POSITION")}`;
      case "marty_arms":
        return `Arms L:${block.getFieldValue("LEFT")} R:${block.getFieldValue("RIGHT")}`;
      case "marty_play_sound":
        return `Play sound: ${block.getFieldValue("SOUND")}`;
      case "marty_wait":
        return `Wait ${block.getFieldValue("SECONDS")}s`;
      case "marty_repeat":
        return `Repeat ${block.getFieldValue("TIMES")} times`;
      case "marty_if_else":
        return "If condition";
      case "marty_forever":
        return "Forever loop";
      default:
        return block.type;
    }
  }
}

function mapEyePosition(
  position: number,
): "normal" | "wide" | "angry" | "excited" | "squint" {
  if (position > 50) return "wide";
  if (position > 20) return "excited";
  if (position < -50) return "angry";
  if (position < -20) return "squint";
  return "normal";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
