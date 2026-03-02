import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandQueue } from "./command-queue";
import type { MartyCommand } from "./types";

const walkCommand: MartyCommand = {
  type: "movement",
  action: "walk",
  params: { steps: 2 },
  duration: 100,
};

const danceCommand: MartyCommand = {
  type: "movement",
  action: "dance",
  params: {},
  duration: 200,
};

describe("CommandQueue", () => {
  let queue: CommandQueue;

  beforeEach(() => {
    vi.useFakeTimers();
    queue = new CommandQueue();
  });

  it("creates an empty queue", () => {
    expect(queue.size()).toBe(0);
    expect(queue.isProcessing()).toBe(false);
  });

  it("enqueues a command in blocking mode", () => {
    const promise = queue.enqueue(walkCommand, "blocking");
    expect(promise).toBeInstanceOf(Promise);
    expect(queue.size()).toBe(1);
  });

  it("enqueues a command in non-blocking mode", () => {
    const promise = queue.enqueue(walkCommand, "non-blocking");
    expect(promise).toBeInstanceOf(Promise);
  });

  it("processes commands in FIFO order", async () => {
    const order: string[] = [];
    queue.onCommandStart((cmd) => order.push(cmd.command.action));

    queue.enqueue(walkCommand, "blocking");
    queue.enqueue(danceCommand, "blocking");

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    expect(order[0]).toBe("walk");

    await vi.advanceTimersByTimeAsync(danceCommand.duration);
    expect(order[1]).toBe("dance");
  });

  it("resolves blocking command after duration", async () => {
    const promise = queue.enqueue(walkCommand, "blocking");

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves non-blocking command immediately", async () => {
    const promise = queue.enqueue(walkCommand, "non-blocking");
    await expect(promise).resolves.toBeUndefined();
  });

  it("emits commandStart when processing begins", async () => {
    const listener = vi.fn();
    queue.onCommandStart(listener);

    queue.enqueue(walkCommand, "blocking");

    await vi.advanceTimersByTimeAsync(0);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        command: walkCommand,
      }),
    );
  });

  it("emits commandComplete after command finishes", async () => {
    const listener = vi.fn();
    queue.onCommandComplete(listener);

    queue.enqueue(walkCommand, "blocking");

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        command: walkCommand,
      }),
    );
  });

  it("returns isProcessing true while executing", async () => {
    queue.enqueue(walkCommand, "blocking");

    await vi.advanceTimersByTimeAsync(0);
    expect(queue.isProcessing()).toBe(true);

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    expect(queue.isProcessing()).toBe(false);
  });

  it("clears all pending commands", () => {
    queue.enqueue(walkCommand, "blocking");
    queue.enqueue(danceCommand, "blocking");

    queue.clear();
    expect(queue.size()).toBe(0);
  });

  it("assigns unique IDs to each command", () => {
    const ids: string[] = [];
    queue.onCommandStart((event) => ids.push(event.commandId));

    queue.enqueue(walkCommand, "non-blocking");
    queue.enqueue(danceCommand, "non-blocking");

    expect(ids[0]).toBeDefined();
    expect(ids[1]).toBeDefined();
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("processes next command after current completes", async () => {
    const starts: string[] = [];
    queue.onCommandStart((e) => starts.push(e.command.action));

    queue.enqueue(walkCommand, "blocking");
    queue.enqueue(danceCommand, "blocking");

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    await vi.advanceTimersByTimeAsync(danceCommand.duration);

    expect(starts).toEqual(["walk", "dance"]);
  });

  it("emits commandComplete for non-blocking commands after duration", async () => {
    const listener = vi.fn();
    queue.onCommandComplete(listener);

    queue.enqueue(walkCommand, "non-blocking");
    await vi.advanceTimersByTimeAsync(walkCommand.duration);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ command: walkCommand }),
    );
  });

  it("size decreases as commands complete", async () => {
    queue.enqueue(walkCommand, "blocking");
    queue.enqueue(danceCommand, "blocking");
    expect(queue.size()).toBe(2);

    await vi.advanceTimersByTimeAsync(walkCommand.duration);
    expect(queue.size()).toBe(1);

    await vi.advanceTimersByTimeAsync(danceCommand.duration);
    expect(queue.size()).toBe(0);
  });
});
