import { useMemo, useState, useCallback } from "react";
import type { DocSection, SearchResult } from "../types";

function searchSections(
  sections: readonly DocSection[],
  query: string,
): readonly SearchResult[] {
  if (query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const section of sections) {
    for (const subsection of section.subsections) {
      for (const entry of subsection.entries) {
        const searchableText = [
          entry.title,
          entry.description,
          ...entry.content,
          ...(entry.parameters?.map((p) => `${p.name} ${p.description}`) ?? []),
          ...(entry.examples?.map((e) => `${e.title} ${e.code}`) ?? []),
        ]
          .join(" ")
          .toLowerCase();

        if (searchableText.includes(lowerQuery)) {
          const matchIndex = searchableText.indexOf(lowerQuery);
          const contextStart = Math.max(0, matchIndex - 30);
          const contextEnd = Math.min(
            searchableText.length,
            matchIndex + query.length + 30,
          );
          const matchContext =
            (contextStart > 0 ? "..." : "") +
            searchableText.slice(contextStart, contextEnd) +
            (contextEnd < searchableText.length ? "..." : "");

          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            subsectionId: subsection.id,
            subsectionTitle: subsection.title,
            entryTitle: entry.title,
            matchContext,
          });
        }
      }
    }
  }

  return results;
}

export function useDocSearch(sections: readonly DocSection[]) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchSections(sections, query),
    [sections, query],
  );

  const clearSearch = useCallback(() => setQuery(""), []);

  return { query, setQuery, results, clearSearch } as const;
}

export { searchSections };
