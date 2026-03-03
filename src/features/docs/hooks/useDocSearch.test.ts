import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDocSearch, searchSections } from "./useDocSearch";
import type { DocSection } from "../types";

const TEST_SECTIONS: readonly DocSection[] = [
  {
    id: "test-section",
    title: "Test Section",
    description: "A test section",
    subsections: [
      {
        id: "sub-one",
        title: "Sub One",
        entries: [
          {
            title: "Entry Alpha",
            description: "Alpha description",
            content: ["Alpha content about walking forward."],
            parameters: [
              { name: "steps", type: "number", description: "Steps to walk" },
            ],
            examples: [
              {
                title: "Walk example",
                language: "python" as const,
                code: "my_marty.walk(2)",
              },
            ],
          },
          {
            title: "Entry Beta",
            description: "Beta description",
            content: ["Beta content about dancing."],
          },
        ],
      },
      {
        id: "sub-two",
        title: "Sub Two",
        entries: [
          {
            title: "Entry Gamma",
            description: "Gamma description",
            content: ["Gamma content about sensors."],
          },
        ],
      },
    ],
  },
];

describe("searchSections", () => {
  it("returns empty results for queries shorter than 2 characters", () => {
    expect(searchSections(TEST_SECTIONS, "")).toHaveLength(0);
    expect(searchSections(TEST_SECTIONS, "a")).toHaveLength(0);
  });

  it("finds entries matching the query in content", () => {
    const results = searchSections(TEST_SECTIONS, "walking");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Alpha");
  });

  it("finds entries matching the query in title", () => {
    const results = searchSections(TEST_SECTIONS, "Alpha");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Alpha");
  });

  it("finds entries matching the query in description", () => {
    const results = searchSections(TEST_SECTIONS, "Beta description");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Beta");
  });

  it("finds entries matching in parameters", () => {
    const results = searchSections(TEST_SECTIONS, "Steps to walk");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Alpha");
  });

  it("finds entries matching in examples", () => {
    const results = searchSections(TEST_SECTIONS, "my_marty.walk");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Alpha");
  });

  it("is case-insensitive", () => {
    const results = searchSections(TEST_SECTIONS, "DANCING");
    expect(results).toHaveLength(1);
    expect(results[0].entryTitle).toBe("Entry Beta");
  });

  it("includes section and subsection info in results", () => {
    const results = searchSections(TEST_SECTIONS, "sensors");
    expect(results).toHaveLength(1);
    expect(results[0].sectionId).toBe("test-section");
    expect(results[0].sectionTitle).toBe("Test Section");
    expect(results[0].subsectionId).toBe("sub-two");
    expect(results[0].subsectionTitle).toBe("Sub Two");
  });

  it("includes match context", () => {
    const results = searchSections(TEST_SECTIONS, "walking");
    expect(results[0].matchContext).toContain("walking");
  });

  it("returns empty for no match", () => {
    const results = searchSections(TEST_SECTIONS, "nonexistent");
    expect(results).toHaveLength(0);
  });
});

describe("useDocSearch", () => {
  it("initializes with empty query and no results", () => {
    const { result } = renderHook(() => useDocSearch(TEST_SECTIONS));
    expect(result.current.query).toBe("");
    expect(result.current.results).toHaveLength(0);
  });

  it("updates query and computes results", () => {
    const { result } = renderHook(() => useDocSearch(TEST_SECTIONS));

    act(() => {
      result.current.setQuery("walking");
    });

    expect(result.current.query).toBe("walking");
    expect(result.current.results).toHaveLength(1);
  });

  it("clears search", () => {
    const { result } = renderHook(() => useDocSearch(TEST_SECTIONS));

    act(() => {
      result.current.setQuery("walking");
    });
    expect(result.current.results).toHaveLength(1);

    act(() => {
      result.current.clearSearch();
    });
    expect(result.current.query).toBe("");
    expect(result.current.results).toHaveLength(0);
  });
});
