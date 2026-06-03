import type { VirtualMarty } from "@/features/marty/virtual-marty";
import type {
  ExecutionState,
  ExecutionSpeed,
  ConsoleEntry,
  BlockLike,
} from "./types";
import { INITIAL_EXECUTION_STATE, SPEED_MULTIPLIER } from "./types";
import { BlockInterpreter } from "./block-interpreter";

let nextEntryId = 0;
function createEntry(
  type: ConsoleEntry["type"],
  message: string,
): ConsoleEntry {
  nextEntryId++;
  return {
    id: `entry-${nextEntryId}`,
    timestamp: Date.now(),
    type,
    message,
  };
}

export type StateChangeListener = (state: ExecutionState) => void;

export class ExecutionEngine {
  private state: ExecutionState = { ...INITIAL_EXECUTION_STATE };
  private readonly listeners: Set<StateChangeListener> = new Set();
  private marty: VirtualMarty | null = null;
  private stopped = false;
  private pauseResolve: (() => void) | null = null;
  private stepResolve: (() => void) | null = null;

  getState(): ExecutionState {
    return this.state;
  }

  setMarty(marty: VirtualMarty | null): void {
    this.marty = marty;
  }

  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setSpeed(speed: ExecutionSpeed): void {
    this.updateState({ speed });
  }

  async run(topBlocks: readonly BlockLike[]): Promise<void> {
    if (!this.marty) {
      this.addEntry("error", "No Marty instance connected.");
      return;
    }

    if (this.state.status === "running" || this.state.status === "stepping") {
      return;
    }

    this.stopped = false;
    this.updateState({
      status: "running",
      currentBlockId: null,
      consoleEntries: [],
    });
    this.addEntry("info", "Program started.");

    const interpreter = this.createInterpreter(this.marty);

    try {
      const startBlocks = topBlocks.filter(
        (b) => b.type === "marty_when_start",
      );

      if (startBlocks.length === 0) {
        // If no event blocks, execute all top-level block chains
        for (const block of topBlocks) {
          if (this.stopped) break;
          await interpreter.executeChain(block);
        }
      } else {
        for (const startBlock of startBlocks) {
          if (this.stopped) break;
          const firstBlock = startBlock.getNextBlock();
          await interpreter.executeChain(firstBlock);
        }
      }

      if (!this.stopped) {
        this.addEntry("info", "Program completed.");
        this.updateState({ status: "completed", currentBlockId: null });
      }
    } catch (err) {
      if (!this.stopped) {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.addEntry("error", `Program error: ${message}`);
        this.updateState({ status: "error", currentBlockId: null });
      }
    }
  }

  async step(topBlocks: readonly BlockLike[]): Promise<void> {
    if (!this.marty) {
      this.addEntry("error", "No Marty instance connected.");
      return;
    }

    if (this.state.status === "stepping") {
      // Already stepping — advance to next step
      this.stepResolve?.();
      return;
    }

    if (this.state.status !== "idle" && this.state.status !== "completed") {
      return;
    }

    this.stopped = false;
    this.updateState({
      status: "stepping",
      currentBlockId: null,
      consoleEntries: [],
    });
    this.addEntry("info", "Step-by-step mode. Press Step to advance.");

    const interpreter = this.createInterpreter(this.marty);

    try {
      const startBlocks = topBlocks.filter(
        (b) => b.type === "marty_when_start",
      );
      const chains =
        startBlocks.length > 0
          ? startBlocks.map((b) => b.getNextBlock())
          : topBlocks;

      for (const block of chains) {
        if (this.stopped) break;
        await interpreter.executeChain(block);
      }

      if (!this.stopped) {
        this.addEntry("info", "Program completed.");
        this.updateState({ status: "completed", currentBlockId: null });
      }
    } catch (err) {
      if (!this.stopped) {
        const message = err instanceof Error ? err.message : "Unknown error";
        this.addEntry("error", `Program error: ${message}`);
        this.updateState({ status: "error", currentBlockId: null });
      }
    }
  }

  pause(): void {
    if (this.state.status === "running") {
      this.updateState({ status: "paused" });
      this.addEntry("info", "Paused.");
    }
  }

  resume(): void {
    if (this.state.status === "paused") {
      this.updateState({ status: "running" });
      this.addEntry("info", "Resumed.");
      this.pauseResolve?.();
      this.pauseResolve = null;
    }
  }

  stop(): void {
    this.stopped = true;
    this.pauseResolve?.();
    this.pauseResolve = null;
    this.stepResolve?.();
    this.stepResolve = null;
    this.marty?.stop();
    this.addEntry("info", "Stopped.");
    this.updateState({ status: "idle", currentBlockId: null });
  }

  private createInterpreter(marty: VirtualMarty): BlockInterpreter {
    return new BlockInterpreter(marty, {
      onBlockStart: (blockId, description) => {
        this.updateState({ currentBlockId: blockId });
        this.addEntry("command", description);
      },
      onBlockComplete: (blockId) => {
        // Block highlighting stays until next block starts
        void blockId;
      },
      onOutput: (message) => {
        this.addEntry("output", message);
      },
      onError: (message) => {
        this.addEntry("error", message);
      },
      shouldPause: () => {
        return (
          this.state.status === "paused" || this.state.status === "stepping"
        );
      },
      waitForResume: () => {
        if (this.state.status === "paused") {
          return new Promise<void>((resolve) => {
            this.pauseResolve = resolve;
          });
        }
        if (this.state.status === "stepping") {
          return new Promise<void>((resolve) => {
            this.stepResolve = resolve;
          });
        }
        return Promise.resolve();
      },
      isStopped: () => this.stopped,
      getSpeedMultiplier: () => SPEED_MULTIPLIER[this.state.speed],
    });
  }

  private addEntry(type: ConsoleEntry["type"], message: string): void {
    const entry = createEntry(type, message);
    this.updateState({
      consoleEntries: [...this.state.consoleEntries, entry],
    });
  }

  private updateState(partial: Partial<ExecutionState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
