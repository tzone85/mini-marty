import { describe, it, expect } from "vitest";
import { getSidebarItems } from "./sidebar-config";

describe("getSidebarItems", () => {
  it("returns empty array for home page", () => {
    expect(getSidebarItems("/")).toEqual([]);
  });

  it("returns block categories for block editor", () => {
    const items = getSidebarItems("/block-editor");
    const labels = items.map((i) => i.label);
    expect(labels).toContain("Motion");
    expect(labels).toContain("Sound");
    expect(labels).toContain("Sensing");
    expect(labels).toContain("Events");
    expect(labels).toContain("Control");
  });

  it("returns code tools for python editor", () => {
    const items = getSidebarItems("/python-editor");
    const labels = items.map((i) => i.label);
    expect(labels).toContain("Snippets");
    expect(labels).toContain("API Reference");
    expect(labels).toContain("Examples");
  });

  it("returns tutorial categories for tutorials page", () => {
    const items = getSidebarItems("/tutorials");
    const labels = items.map((i) => i.label);
    expect(labels).toContain("Getting Started");
    expect(labels).toContain("Movement");
    expect(labels).toContain("Advanced");
  });

  it("returns challenge levels for challenges page", () => {
    const items = getSidebarItems("/challenges");
    const labels = items.map((i) => i.label);
    expect(labels).toContain("Beginner");
    expect(labels).toContain("Intermediate");
    expect(labels).toContain("Advanced");
  });

  it("returns empty array for unknown paths", () => {
    expect(getSidebarItems("/unknown")).toEqual([]);
  });

  it("each item has a label and id", () => {
    const items = getSidebarItems("/block-editor");
    for (const item of items) {
      expect(item.label).toBeTruthy();
      expect(item.id).toBeTruthy();
    }
  });
});
