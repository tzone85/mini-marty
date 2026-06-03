import { describe, expect, it } from "vitest";
import { migrateRawString, migrateInPlaceIfRaw } from "./migrate";

class MemStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe("migrateRawString", () => {
  it("wraps and renames raw value", () => {
    const s = new MemStorage();
    s.setItem("old", "<xml/>");
    migrateRawString(s, "old", "new", (raw) => ({ version: 1, xml: raw }));
    expect(s.getItem("old")).toBeNull();
    expect(JSON.parse(s.getItem("new") as string)).toEqual({
      version: 1,
      xml: "<xml/>",
    });
  });

  it("is a no-op when old key absent", () => {
    const s = new MemStorage();
    migrateRawString(s, "old", "new", (raw) => raw);
    expect(s.getItem("new")).toBeNull();
  });

  it("does not overwrite an existing new value", () => {
    const s = new MemStorage();
    s.setItem("old", "raw");
    s.setItem("new", '{"version":1,"xml":"already"}');
    migrateRawString(s, "old", "new", (raw) => ({ version: 1, xml: raw }));
    expect(s.getItem("old")).toBeNull();
    expect(s.getItem("new")).toBe('{"version":1,"xml":"already"}');
  });
});

describe("migrateInPlaceIfRaw", () => {
  it("leaves valid JSON alone", () => {
    const s = new MemStorage();
    s.setItem("k", '"dark"');
    migrateInPlaceIfRaw(
      s,
      "k",
      (p) => p === "dark" || p === "light",
      (raw) => raw,
    );
    expect(s.getItem("k")).toBe('"dark"');
  });

  it("upgrades a raw legacy value", () => {
    const s = new MemStorage();
    s.setItem("k", "dark");
    migrateInPlaceIfRaw(
      s,
      "k",
      (p) => p === "dark" || p === "light",
      (raw) => raw,
    );
    expect(s.getItem("k")).toBe('"dark"');
  });

  it("no-op when key absent", () => {
    const s = new MemStorage();
    migrateInPlaceIfRaw(
      s,
      "k",
      () => true,
      (raw) => raw,
    );
    expect(s.getItem("k")).toBeNull();
  });
});
