import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DocsPage from "./page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("DocsPage", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("renders the docs page", () => {
    render(<DocsPage />);
    expect(screen.getByTestId("docs-page")).toBeInTheDocument();
  });

  it("renders the heading", () => {
    render(<DocsPage />);
    expect(
      screen.getByRole("heading", { name: /help & documentation/i }),
    ).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<DocsPage />);
    expect(screen.getByTestId("doc-search-input")).toBeInTheDocument();
  });

  it("renders section navigation buttons", () => {
    render(<DocsPage />);
    expect(screen.getByTestId("docs-section-nav")).toBeInTheDocument();
    expect(screen.getByTestId("docs-nav-quick-start")).toBeInTheDocument();
    expect(screen.getByTestId("docs-nav-block-reference")).toBeInTheDocument();
    expect(screen.getByTestId("docs-nav-python-api")).toBeInTheDocument();
    expect(screen.getByTestId("docs-nav-parent-teacher")).toBeInTheDocument();
    expect(
      screen.getByTestId("docs-nav-keyboard-shortcuts"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("docs-nav-faq")).toBeInTheDocument();
  });

  it("defaults to Quick Start section", () => {
    render(<DocsPage />);
    expect(screen.getByTestId("doc-section-quick-start")).toBeInTheDocument();
  });

  it("switches section when navigation button is clicked", async () => {
    render(<DocsPage />);

    await userEvent.click(screen.getByTestId("docs-nav-faq"));

    expect(screen.getByTestId("doc-section-faq")).toBeInTheDocument();
    expect(
      screen.queryByTestId("doc-section-quick-start"),
    ).not.toBeInTheDocument();
  });

  it("shows search results when typing a query", async () => {
    render(<DocsPage />);

    await userEvent.type(screen.getByTestId("doc-search-input"), "walk");

    expect(screen.getByTestId("doc-search-results")).toBeInTheDocument();
  });

  it("navigates to section when search result is clicked", async () => {
    render(<DocsPage />);

    await userEvent.type(
      screen.getByTestId("doc-search-input"),
      "distance sensor",
    );

    const resultItems = screen.getAllByTestId("doc-search-result-item");
    await userEvent.click(resultItems[0]);

    // Search should be cleared after clicking a result
    expect(screen.queryByTestId("doc-search-results")).not.toBeInTheDocument();
  });
});
