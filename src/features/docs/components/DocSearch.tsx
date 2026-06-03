"use client";

import type { SearchResult, DocSectionId } from "../types";

interface DocSearchProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly results: readonly SearchResult[];
  readonly onResultClick: (sectionId: DocSectionId) => void;
  readonly onClear: () => void;
}

export function DocSearch({
  query,
  onQueryChange,
  results,
  onResultClick,
  onClear,
}: DocSearchProps) {
  return (
    <div className="relative" data-testid="doc-search">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search documentation..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          data-testid="doc-search-input"
        />
        {query && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            data-testid="doc-search-clear"
            aria-label="Clear search"
          >
            x
          </button>
        )}
      </div>

      {query.length >= 2 && (
        <div
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          data-testid="doc-search-results"
        >
          {results.length === 0 ? (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li key={`${result.sectionId}-${result.entryTitle}-${index}`}>
                  <button
                    onClick={() =>
                      onResultClick(result.sectionId as DocSectionId)
                    }
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    data-testid="doc-search-result-item"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.entryTitle}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.sectionTitle} &rsaquo; {result.subsectionTitle}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
