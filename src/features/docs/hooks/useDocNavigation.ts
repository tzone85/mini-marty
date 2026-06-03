import { useState, useCallback, useEffect } from "react";
import type { DocSectionId } from "../types";

const DEFAULT_SECTION: DocSectionId = "quick-start";

function isValidSectionId(id: string): id is DocSectionId {
  const validIds: readonly string[] = [
    "quick-start",
    "block-reference",
    "python-api",
    "parent-teacher",
    "keyboard-shortcuts",
    "faq",
  ];
  return validIds.includes(id);
}

function getSectionFromHash(): DocSectionId {
  if (typeof window === "undefined") return DEFAULT_SECTION;
  const hash = window.location.hash.slice(1);
  return isValidSectionId(hash) ? hash : DEFAULT_SECTION;
}

export function useDocNavigation() {
  const [activeSection, setActiveSectionState] =
    useState<DocSectionId>(DEFAULT_SECTION);

  useEffect(() => {
    setActiveSectionState(getSectionFromHash());

    function handleHashChange() {
      setActiveSectionState(getSectionFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const setActiveSection = useCallback((id: DocSectionId) => {
    setActiveSectionState(id);
    if (typeof window !== "undefined") {
      window.location.hash = id;
    }
  }, []);

  const scrollToSubsection = useCallback((subsectionId: string) => {
    const element = document.getElementById(subsectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return {
    activeSection,
    setActiveSection,
    scrollToSubsection,
  } as const;
}

export { isValidSectionId, getSectionFromHash, DEFAULT_SECTION };
