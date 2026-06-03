import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DocSearch } from "./DocSearch";
import type { SearchResult } from "../types";

describe("DocSearch", () => {
  const mockResults: readonly SearchResult[] = [
    {
      sectionId: "quick-start",
      sectionTitle: "Quick Start",
      subsectionId: "intro",
      subsectionTitle: "Introduction",
      entryTitle: "Getting Started",
      matchContext: "...getting started with marty...",
    },
    {
      sectionId: "faq",
      sectionTitle: "FAQ",
      subsectionId: "general",
      subsectionTitle: "General",
      entryTitle: "Browser Support",
      matchContext: "...browser support information...",
    },
  ];

  const defaultProps = {
    query: "",
    onQueryChange: vi.fn(),
    results: [] as readonly SearchResult[],
    onResultClick: vi.fn(),
    onClear: vi.fn(),
  };

  it("renders search input", () => {
    render(<DocSearch {...defaultProps} />);
    expect(screen.getByTestId("doc-search-input")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search documentation..."),
    ).toBeInTheDocument();
  });

  it("does not show clear button when query is empty", () => {
    render(<DocSearch {...defaultProps} />);
    expect(screen.queryByTestId("doc-search-clear")).not.toBeInTheDocument();
  });

  it("shows clear button when query is non-empty", () => {
    render(<DocSearch {...defaultProps} query="test" />);
    expect(screen.getByTestId("doc-search-clear")).toBeInTheDocument();
  });

  it("calls onClear when clear button clicked", async () => {
    const onClear = vi.fn();
    render(<DocSearch {...defaultProps} query="test" onClear={onClear} />);

    await userEvent.click(screen.getByTestId("doc-search-clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("calls onQueryChange when typing", async () => {
    const onQueryChange = vi.fn();
    render(<DocSearch {...defaultProps} onQueryChange={onQueryChange} />);

    await userEvent.type(screen.getByTestId("doc-search-input"), "walk");
    expect(onQueryChange).toHaveBeenCalled();
  });

  it("does not show results dropdown when query is less than 2 chars", () => {
    render(<DocSearch {...defaultProps} query="a" />);
    expect(screen.queryByTestId("doc-search-results")).not.toBeInTheDocument();
  });

  it("shows no results message when query >= 2 chars but no results", () => {
    render(<DocSearch {...defaultProps} query="zz" results={[]} />);
    expect(screen.getByTestId("doc-search-results")).toBeInTheDocument();
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("renders search results", () => {
    render(<DocSearch {...defaultProps} query="test" results={mockResults} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Browser Support")).toBeInTheDocument();
  });

  it("shows section breadcrumb in results", () => {
    render(<DocSearch {...defaultProps} query="test" results={mockResults} />);
    expect(screen.getByText(/Quick Start/)).toBeInTheDocument();
    expect(screen.getByText(/FAQ/)).toBeInTheDocument();
  });

  it("calls onResultClick when a result is clicked", async () => {
    const onResultClick = vi.fn();
    render(
      <DocSearch
        {...defaultProps}
        query="test"
        results={mockResults}
        onResultClick={onResultClick}
      />,
    );

    const resultItems = screen.getAllByTestId("doc-search-result-item");
    await userEvent.click(resultItems[0]);
    expect(onResultClick).toHaveBeenCalledWith("quick-start");
  });

  it("has correct data-testid on container", () => {
    render(<DocSearch {...defaultProps} />);
    expect(screen.getByTestId("doc-search")).toBeInTheDocument();
  });
});
