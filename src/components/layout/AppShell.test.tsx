import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@/lib/theme-context";
import { AppShell } from "./AppShell";

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

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderAppShell() {
  return render(
    <ThemeProvider>
      <AppShell>
        <p>Page content</p>
      </AppShell>
    </ThemeProvider>,
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders the header", () => {
    renderAppShell();
    expect(screen.getByText("Mini Marty")).toBeInTheDocument();
  });

  it("renders the sidebar", () => {
    renderAppShell();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders children in the main content area", () => {
    renderAppShell();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders a main landmark for the content area", () => {
    renderAppShell();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders navigation", () => {
    renderAppShell();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
