import { describe, it, expect } from "vitest";
import { getSidebarSections } from "./sidebar-config";

describe("getSidebarSections", () => {
  it("returns sections for the home page", () => {
    const sections = getSidebarSections("/");
    expect(sections.length).toBeGreaterThan(0);
    expect(sections[0].title).toBeTruthy();
  });

  it("returns sections for block editor", () => {
    const sections = getSidebarSections("/block-editor");
    expect(sections.length).toBeGreaterThan(0);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain("Block Categories");
  });

  it("returns sections for python editor", () => {
    const sections = getSidebarSections("/python-editor");
    expect(sections.length).toBeGreaterThan(0);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain("Code Snippets");
  });

  it("returns sections for tutorials", () => {
    const sections = getSidebarSections("/tutorials");
    expect(sections.length).toBeGreaterThan(0);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain("Tutorial Topics");
  });

  it("returns sections for challenges", () => {
    const sections = getSidebarSections("/challenges");
    expect(sections.length).toBeGreaterThan(0);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain("Difficulty");
  });

  it("returns sections for docs", () => {
    const sections = getSidebarSections("/docs");
    expect(sections.length).toBeGreaterThan(0);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain("Documentation");
  });

  it("returns default sections for unknown paths", () => {
    const sections = getSidebarSections("/unknown");
    expect(sections.length).toBeGreaterThan(0);
  });

  it("each section has a title and items array", () => {
    const sections = getSidebarSections("/");
    for (const section of sections) {
      expect(section.title).toBeTruthy();
      expect(Array.isArray(section.items)).toBe(true);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });
});
