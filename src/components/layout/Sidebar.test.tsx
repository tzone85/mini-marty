import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

function renderSidebar(pathname = "/") {
  mockPathname = pathname;
  return render(<Sidebar />);
}

describe("Sidebar", () => {
  it("renders sidebar sections for home page", () => {
    renderSidebar("/");
    expect(screen.getByText("Quick Start")).toBeInTheDocument();
  });

  it("renders block categories for block editor", () => {
    renderSidebar("/block-editor");
    expect(screen.getByText("Block Categories")).toBeInTheDocument();
    expect(screen.getByText("Motion")).toBeInTheDocument();
    expect(screen.getByText("Control")).toBeInTheDocument();
  });

  it("renders code snippets for python editor", () => {
    renderSidebar("/python-editor");
    expect(screen.getByText("Code Snippets")).toBeInTheDocument();
    expect(screen.getByText("Walk")).toBeInTheDocument();
  });

  it("renders tutorial topics for tutorials page", () => {
    renderSidebar("/tutorials");
    expect(screen.getByText("Tutorial Topics")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("renders difficulty levels for challenges page", () => {
    renderSidebar("/challenges");
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("renders as an aside landmark", () => {
    renderSidebar();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders section items as list items", () => {
    renderSidebar("/block-editor");
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
