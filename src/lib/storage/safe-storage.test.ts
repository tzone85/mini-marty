import { describe, expect, it, beforeEach } from "vitest";
import { z } from "zod";
import { createSafeStorage } from "./safe-storage";

const schema = z.object({ name: z.string() });

beforeEach(() => localStorage.clear());

describe("createSafeStorage", () => {
  it("round-trips valid values", () => {
    const s = createSafeStorage("k", schema);
    s.set({ name: "Marty" });
    expect(s.get()).toEqual({ name: "Marty" });
  });
  it("returns null on missing", () => {
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
  it("returns null on malformed JSON", () => {
    localStorage.setItem("k", "{not json");
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
  it("returns null on schema mismatch", () => {
    localStorage.setItem("k", JSON.stringify({ wrong: 1 }));
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
  it("clear removes the item", () => {
    const s = createSafeStorage("k", schema);
    s.set({ name: "x" });
    s.clear();
    expect(s.get()).toBeNull();
  });
  it("swallows storage errors on set (e.g. quota exceeded / private mode)", () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    try {
      const s = createSafeStorage("k", schema);
      expect(() => s.set({ name: "x" })).not.toThrow();
    } finally {
      Storage.prototype.setItem = original;
    }
  });
  it("swallows storage errors on clear", () => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = () => {
      throw new DOMException("SecurityError");
    };
    try {
      const s = createSafeStorage("k", schema);
      expect(() => s.clear()).not.toThrow();
    } finally {
      Storage.prototype.removeItem = original;
    }
  });
});
