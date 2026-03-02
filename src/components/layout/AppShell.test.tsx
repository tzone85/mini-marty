import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppShell } from "./AppShell";
import { ThemeProvider } from "@/lib/theme-context";

const { mockPathname } = vi.hoisted(() => ({
  mockPathname: vi.fn(() => "/"),
}));

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

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

function renderAppShell(pathname = "/") {
  mockPathname.mockReturnValue(pathname);
  return render(
    <ThemeProvider>
      <AppShell>
        <p>Page content</p>
      </AppShell>
    </ThemeProvider>,
  );
}

describe("AppShell", () => {
  it("renders children in the main area", () => {
    renderAppShell();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders the header", () => {
    renderAppShell();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders main landmark", () => {
    renderAppShell();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders sidebar when on a page with sidebar items", () => {
    renderAppShell("/block-editor");
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("does not render sidebar on home page", () => {
    renderAppShell("/");
    expect(screen.queryByRole("complementary")).toBeNull();
  });
});
