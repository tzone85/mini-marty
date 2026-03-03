import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useDocNavigation,
  isValidSectionId,
  getSectionFromHash,
  DEFAULT_SECTION,
} from "./useDocNavigation";

describe("isValidSectionId", () => {
  it("returns true for valid section ids", () => {
    expect(isValidSectionId("quick-start")).toBe(true);
    expect(isValidSectionId("block-reference")).toBe(true);
    expect(isValidSectionId("python-api")).toBe(true);
    expect(isValidSectionId("parent-teacher")).toBe(true);
    expect(isValidSectionId("keyboard-shortcuts")).toBe(true);
    expect(isValidSectionId("faq")).toBe(true);
  });

  it("returns false for invalid section ids", () => {
    expect(isValidSectionId("invalid")).toBe(false);
    expect(isValidSectionId("")).toBe(false);
    expect(isValidSectionId("quickstart")).toBe(false);
  });
});

describe("getSectionFromHash", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("returns default section when no hash", () => {
    expect(getSectionFromHash()).toBe(DEFAULT_SECTION);
  });

  it("returns section from valid hash", () => {
    window.location.hash = "#faq";
    expect(getSectionFromHash()).toBe("faq");
  });

  it("returns default for invalid hash", () => {
    window.location.hash = "#invalid";
    expect(getSectionFromHash()).toBe(DEFAULT_SECTION);
  });
});

describe("useDocNavigation", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("initializes with default section", () => {
    const { result } = renderHook(() => useDocNavigation());
    expect(result.current.activeSection).toBe(DEFAULT_SECTION);
  });

  it("initializes from URL hash", () => {
    window.location.hash = "#faq";
    const { result } = renderHook(() => useDocNavigation());
    expect(result.current.activeSection).toBe("faq");
  });

  it("changes active section", () => {
    const { result } = renderHook(() => useDocNavigation());

    act(() => {
      result.current.setActiveSection("block-reference");
    });

    expect(result.current.activeSection).toBe("block-reference");
    expect(window.location.hash).toBe("#block-reference");
  });

  it("responds to hashchange events", () => {
    const { result } = renderHook(() => useDocNavigation());

    act(() => {
      window.location.hash = "#python-api";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(result.current.activeSection).toBe("python-api");
  });

  it("scrolls to subsection", () => {
    const el = document.createElement("div");
    el.id = "test-subsection";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    const { result } = renderHook(() => useDocNavigation());

    act(() => {
      result.current.scrollToSubsection("test-subsection");
    });

    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    document.body.removeChild(el);
  });

  it("handles missing subsection gracefully", () => {
    const { result } = renderHook(() => useDocNavigation());

    expect(() => {
      act(() => {
        result.current.scrollToSubsection("nonexistent");
      });
    }).not.toThrow();
  });
});
