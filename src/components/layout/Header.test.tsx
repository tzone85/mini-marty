import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@/lib/theme-context";
import { Header } from "./Header";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

function renderHeader(pathname = "/") {
  mockPathname = pathname;
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders the Mini Marty logo text", () => {
    renderHeader();
    expect(screen.getByText("Mini Marty")).toBeInTheDocument();
  });

  it("renders navigation links for all pages", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /block editor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /python editor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /tutorials/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /challenges/i }),
    ).toBeInTheDocument();
  });

  it("renders the theme toggle", () => {
    renderHeader();
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("highlights the active navigation item", () => {
    renderHeader("/block-editor");
    const blockEditorLink = screen.getByRole("link", {
      name: /block editor/i,
    });
    expect(blockEditorLink.className).toContain("font-semibold");
  });

  it("has correct href for each link", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /block editor/i })).toHaveAttribute(
      "href",
      "/block-editor",
    );
    expect(
      screen.getByRole("link", { name: /python editor/i }),
    ).toHaveAttribute("href", "/python-editor");
    expect(screen.getByRole("link", { name: /tutorials/i })).toHaveAttribute(
      "href",
      "/tutorials",
    );
    expect(screen.getByRole("link", { name: /challenges/i })).toHaveAttribute(
      "href",
      "/challenges",
    );
  });

  it("renders a navigation landmark", () => {
    renderHeader();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
