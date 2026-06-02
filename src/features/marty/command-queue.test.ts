import { describe, expect, it } from "vitest";
import { CommandQueue } from "./command-queue";
import { FakeClock } from "./clock";
import type { MartyCommand } from "./types";

const cmd = (duration: number): MartyCommand => ({
  type: "movement",
  action: "walk",
  params: {},
  duration,
});

// Drain enough microtask turns for promise chains to schedule clock callbacks.
async function flushMicrotasks(times = 4): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

describe("CommandQueue (blocking)", () => {
  it("resolves after duration when single command", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    let resolved = false;
    const p = q.enqueue(cmd(100), "blocking").then(() => (resolved = true));
    await flushMicrotasks();
    clock.advance(99);
    await flushMicrotasks();
    expect(resolved).toBe(false);
    clock.advance(1);
    await p;
    expect(resolved).toBe(true);
  });
  it("serialises blocking commands", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    const order: string[] = [];
    const p1 = q.enqueue(cmd(100), "blocking").then(() => order.push("a"));
    const p2 = q.enqueue(cmd(50), "blocking").then(() => order.push("b"));
    await flushMicrotasks();
    clock.advance(100);
    await flushMicrotasks();
    clock.advance(50);
    await Promise.all([p1, p2]);
    expect(order).toEqual(["a", "b"]);
  });
});

describe("CommandQueue (non-blocking)", () => {
  it("resolves immediately", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    await q.enqueue(cmd(100), "non-blocking");
  });
});

describe("CommandQueue events", () => {
  it("emits start + complete around each command", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    const seen: string[] = [];
    q.onCommandStart(() => seen.push("start"));
    q.onCommandComplete(() => seen.push("complete"));
    const p = q.enqueue(cmd(10), "blocking");
    await flushMicrotasks();
    clock.advance(10);
    await p;
    expect(seen).toEqual(["start", "complete"]);
  });
});

describe("CommandQueue.clear", () => {
  it("drops pending commands", () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    q.enqueue(cmd(100), "blocking");
    q.enqueue(cmd(100), "blocking");
    q.clear();
    expect(q.size()).toBe(0);
  });
});
