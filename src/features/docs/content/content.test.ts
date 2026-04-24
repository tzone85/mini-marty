import { describe, it, expect } from "vitest";
import { ALL_DOC_SECTIONS } from "./index";
import { QUICK_START_SECTION } from "./quick-start";
import { BLOCK_REFERENCE_SECTION } from "./block-reference";
import { PYTHON_API_SECTION } from "./python-api-reference";
import { PARENT_TEACHER_SECTION } from "./parent-teacher-guide";
import { KEYBOARD_SHORTCUTS_SECTION } from "./keyboard-shortcuts";
import { FAQ_SECTION } from "./faq";

describe("Documentation content", () => {
  it("exports all 6 documentation sections", () => {
    expect(ALL_DOC_SECTIONS).toHaveLength(6);
  });

  it("includes all required sections", () => {
    const ids = ALL_DOC_SECTIONS.map((s) => s.id);
    expect(ids).toContain("quick-start");
    expect(ids).toContain("block-reference");
    expect(ids).toContain("python-api");
    expect(ids).toContain("parent-teacher");
    expect(ids).toContain("keyboard-shortcuts");
    expect(ids).toContain("faq");
  });

  describe("Quick Start section", () => {
    it("has an id and title", () => {
      expect(QUICK_START_SECTION.id).toBe("quick-start");
      expect(QUICK_START_SECTION.title).toBe("Quick Start Guide");
    });

    it("has subsections for welcome, blocks, and python", () => {
      const subIds = QUICK_START_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("welcome");
      expect(subIds).toContain("block-coding");
      expect(subIds).toContain("python-coding");
    });

    it("has at least one entry per subsection", () => {
      for (const sub of QUICK_START_SECTION.subsections) {
        expect(sub.entries.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("Block Reference section", () => {
    it("has an id and title", () => {
      expect(BLOCK_REFERENCE_SECTION.id).toBe("block-reference");
      expect(BLOCK_REFERENCE_SECTION.title).toBe("Block Reference");
    });

    it("has subsections for all block categories", () => {
      const subIds = BLOCK_REFERENCE_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("motion-blocks");
      expect(subIds).toContain("sound-blocks");
      expect(subIds).toContain("sensing-blocks");
      expect(subIds).toContain("event-blocks");
      expect(subIds).toContain("control-blocks");
    });

    it("documents all motion blocks", () => {
      const motionSub = BLOCK_REFERENCE_SECTION.subsections.find(
        (s) => s.id === "motion-blocks",
      );
      expect(motionSub).toBeDefined();
      expect(motionSub!.entries.length).toBeGreaterThanOrEqual(10);
    });

    it("includes sensing blocks with return types", () => {
      const sensingSub = BLOCK_REFERENCE_SECTION.subsections.find(
        (s) => s.id === "sensing-blocks",
      );
      expect(sensingSub).toBeDefined();
      const hasReturns = sensingSub!.entries.some((e) => e.returns);
      expect(hasReturns).toBe(true);
    });
  });

  describe("Python API section", () => {
    it("has an id and title", () => {
      expect(PYTHON_API_SECTION.id).toBe("python-api");
      expect(PYTHON_API_SECTION.title).toBe("Python API Reference");
    });

    it("has subsections for different API categories", () => {
      const subIds = PYTHON_API_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("getting-started-python");
      expect(subIds).toContain("movement-api");
      expect(subIds).toContain("pose-api");
      expect(subIds).toContain("sensor-api");
      expect(subIds).toContain("control-api");
    });

    it("includes code examples for movement functions", () => {
      const movementSub = PYTHON_API_SECTION.subsections.find(
        (s) => s.id === "movement-api",
      );
      expect(movementSub).toBeDefined();
      const hasExamples = movementSub!.entries.some(
        (e) => e.examples && e.examples.length > 0,
      );
      expect(hasExamples).toBe(true);
    });
  });

  describe("Parent & Teacher section", () => {
    it("has an id and title", () => {
      expect(PARENT_TEACHER_SECTION.id).toBe("parent-teacher");
      expect(PARENT_TEACHER_SECTION.title).toBe("Parent & Teacher Guide");
    });

    it("has subsections for overview, ages, classroom, and safety", () => {
      const subIds = PARENT_TEACHER_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("overview-guide");
      expect(subIds).toContain("age-recommendations");
      expect(subIds).toContain("classroom-tips");
      expect(subIds).toContain("safety-supervision");
    });
  });

  describe("Keyboard Shortcuts section", () => {
    it("has an id and title", () => {
      expect(KEYBOARD_SHORTCUTS_SECTION.id).toBe("keyboard-shortcuts");
      expect(KEYBOARD_SHORTCUTS_SECTION.title).toBe("Keyboard Shortcuts");
    });

    it("has subsections for block editor, python editor, and general", () => {
      const subIds = KEYBOARD_SHORTCUTS_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("block-editor-shortcuts");
      expect(subIds).toContain("python-editor-shortcuts");
      expect(subIds).toContain("general-shortcuts");
    });
  });

  describe("FAQ section", () => {
    it("has an id and title", () => {
      expect(FAQ_SECTION.id).toBe("faq");
      expect(FAQ_SECTION.title).toBe("FAQ & Troubleshooting");
    });

    it("has subsections for general, block, python, and 3D issues", () => {
      const subIds = FAQ_SECTION.subsections.map((s) => s.id);
      expect(subIds).toContain("general-faq");
      expect(subIds).toContain("block-editor-faq");
      expect(subIds).toContain("python-editor-faq");
      expect(subIds).toContain("3d-viewer-faq");
    });
  });

  describe("content integrity", () => {
    it("every section has a non-empty description", () => {
      for (const section of ALL_DOC_SECTIONS) {
        expect(section.description.length).toBeGreaterThan(0);
      }
    });

    it("every entry has non-empty content", () => {
      for (const section of ALL_DOC_SECTIONS) {
        for (const sub of section.subsections) {
          for (const entry of sub.entries) {
            expect(entry.content.length).toBeGreaterThan(0);
            for (const paragraph of entry.content) {
              expect(paragraph.length).toBeGreaterThan(0);
            }
          }
        }
      }
    });

    it("every example has valid language", () => {
      for (const section of ALL_DOC_SECTIONS) {
        for (const sub of section.subsections) {
          for (const entry of sub.entries) {
            for (const example of entry.examples ?? []) {
              expect(["python", "blocks"]).toContain(example.language);
            }
          }
        }
      }
    });
  });
});
