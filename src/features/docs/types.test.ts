import { describe, it, expect } from "vitest";
import type {
  DocSection,
  DocSectionId,
  SearchResult,
  CodeExample,
  DocEntry,
  DocSubSection,
  ParameterDoc,
} from "./types";

describe("Documentation types", () => {
  it("defines CodeExample structure", () => {
    const example: CodeExample = {
      title: "Test",
      language: "python",
      code: "print('hello')",
      description: "A test example",
    };
    expect(example.title).toBe("Test");
    expect(example.language).toBe("python");
    expect(example.code).toBe("print('hello')");
    expect(example.description).toBe("A test example");
  });

  it("allows CodeExample without optional description", () => {
    const example: CodeExample = {
      title: "Test",
      language: "blocks",
      code: "walk 2 steps",
    };
    expect(example.description).toBeUndefined();
  });

  it("defines ParameterDoc structure", () => {
    const param: ParameterDoc = {
      name: "steps",
      type: "number",
      description: "Number of steps",
      defaultValue: "2",
    };
    expect(param.name).toBe("steps");
    expect(param.defaultValue).toBe("2");
  });

  it("defines DocEntry structure", () => {
    const entry: DocEntry = {
      title: "Walk",
      description: "Walk forward",
      content: ["Makes Marty walk."],
      parameters: [
        { name: "steps", type: "number", description: "Steps to walk" },
      ],
      returns: "void",
      examples: [
        { title: "Walk", language: "python", code: "my_marty.walk(2)" },
      ],
    };
    expect(entry.title).toBe("Walk");
    expect(entry.content).toHaveLength(1);
    expect(entry.parameters).toHaveLength(1);
    expect(entry.returns).toBe("void");
  });

  it("defines DocSubSection structure", () => {
    const subsection: DocSubSection = {
      id: "motion",
      title: "Motion",
      entries: [
        { title: "Walk", description: "Walk forward", content: ["Walks."] },
      ],
    };
    expect(subsection.id).toBe("motion");
    expect(subsection.entries).toHaveLength(1);
  });

  it("defines DocSection structure", () => {
    const section: DocSection = {
      id: "quick-start",
      title: "Quick Start",
      description: "Get started quickly.",
      subsections: [
        {
          id: "intro",
          title: "Introduction",
          entries: [
            { title: "Hello", description: "Greeting", content: ["Hi!"] },
          ],
        },
      ],
    };
    expect(section.id).toBe("quick-start");
    expect(section.subsections).toHaveLength(1);
  });

  it("defines DocSectionId as a union type", () => {
    const ids: DocSectionId[] = [
      "quick-start",
      "block-reference",
      "python-api",
      "parent-teacher",
      "keyboard-shortcuts",
      "faq",
    ];
    expect(ids).toHaveLength(6);
  });

  it("defines SearchResult structure", () => {
    const result: SearchResult = {
      sectionId: "quick-start",
      sectionTitle: "Quick Start",
      subsectionId: "intro",
      subsectionTitle: "Introduction",
      entryTitle: "Hello",
      matchContext: "...hello world...",
    };
    expect(result.sectionId).toBe("quick-start");
    expect(result.matchContext).toContain("hello");
  });
});
