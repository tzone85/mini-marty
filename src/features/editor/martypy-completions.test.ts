import { describe, expect, it } from "vitest";
import { MARTYPY_COMPLETIONS, STARTER_TEMPLATE } from "./martypy-completions";

describe("MARTYPY_COMPLETIONS", () => {
  it("includes core movement actions", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("walk");
    expect(labels).toContain("dance");
    expect(labels).toContain("kick");
    expect(labels).toContain("get_ready");
  });

  it("every entry has label, detail, and insertText", () => {
    for (const c of MARTYPY_COMPLETIONS) {
      expect(c.label).toBeTruthy();
      expect(c.detail).toBeTruthy();
      expect(c.insertText).toBeTruthy();
    }
  });

  it("labels are unique", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("insertText references the my_marty instance for callable methods", () => {
    for (const c of MARTYPY_COMPLETIONS) {
      expect(c.insertText.startsWith("my_marty.")).toBe(true);
    }
  });
});

describe("STARTER_TEMPLATE", () => {
  it("includes the martypy import and an example call", () => {
    expect(STARTER_TEMPLATE).toContain("from martypy import Marty");
    expect(STARTER_TEMPLATE).toContain("my_marty");
  });
});
