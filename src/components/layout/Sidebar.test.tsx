import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";

const { mockPathname } = vi.hoisted(() => ({
  mockPathname: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

function renderSidebar(pathname = "/") {
  mockPathname.mockReturnValue(pathname);
  return render(<Sidebar />);
}

describe("Sidebar", () => {
  it("renders as aside landmark", () => {
    renderSidebar("/block-editor");
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders nothing for home page", () => {
    const { container } = renderSidebar("/");
    const aside = container.querySelector("aside");
    expect(aside).toBeNull();
  });

  it("renders block editor sidebar items", () => {
    renderSidebar("/block-editor");
    expect(screen.getByText("Motion")).toBeInTheDocument();
    expect(screen.getByText("Sound")).toBeInTheDocument();
    expect(screen.getByText("Control")).toBeInTheDocument();
  });

  it("renders python editor sidebar items", () => {
    renderSidebar("/python-editor");
    expect(screen.getByText("Snippets")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
  });

  it("renders tutorials sidebar items", () => {
    renderSidebar("/tutorials");
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Movement")).toBeInTheDocument();
  });

  it("renders challenges sidebar items", () => {
    renderSidebar("/challenges");
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("renders items as buttons", () => {
    renderSidebar("/block-editor");
    expect(screen.getByRole("button", { name: "Motion" })).toBeInTheDocument();
  });
});
