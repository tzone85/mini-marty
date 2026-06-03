"use client";

import { DocSection } from "@/features/docs/components/DocSection";
import { DocSearch } from "@/features/docs/components/DocSearch";
import { useDocSearch } from "@/features/docs/hooks/useDocSearch";
import { useDocNavigation } from "@/features/docs/hooks/useDocNavigation";
import { ALL_DOC_SECTIONS } from "@/features/docs/content";
import type { DocSectionId } from "@/features/docs/types";

const SECTION_NAV: readonly {
  readonly id: DocSectionId;
  readonly label: string;
}[] = [
  { id: "quick-start", label: "Quick Start" },
  { id: "block-reference", label: "Block Reference" },
  { id: "python-api", label: "Python API" },
  { id: "parent-teacher", label: "Parent & Teacher" },
  { id: "keyboard-shortcuts", label: "Shortcuts" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  const { activeSection, setActiveSection } = useDocNavigation();
  const { query, setQuery, results, clearSearch } =
    useDocSearch(ALL_DOC_SECTIONS);

  const currentSection = ALL_DOC_SECTIONS.find((s) => s.id === activeSection);

  function handleSearchResultClick(sectionId: DocSectionId) {
    setActiveSection(sectionId);
    clearSearch();
  }

  return (
    <div className="flex h-full flex-col" data-testid="docs-page">
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Help & Documentation
          </h1>
        </div>
        <DocSearch
          query={query}
          onQueryChange={setQuery}
          results={results}
          onResultClick={handleSearchResultClick}
          onClear={clearSearch}
        />
        <nav
          className="mt-3 flex flex-wrap gap-1"
          data-testid="docs-section-nav"
        >
          {SECTION_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
              data-testid={`docs-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {currentSection && <DocSection section={currentSection} />}
      </div>
    </div>
  );
}
