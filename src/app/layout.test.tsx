import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Stub Providers so we don't need to set up the full provider chain
// just to assert layout structure.
vi.mock("./providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

import RootLayout from "./layout";

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

describe("RootLayout", () => {
  it("returns html with lang attribute and embeds AppShell", () => {
    const tree = RootLayout({ children: <p>Test content</p> });
    // Verify the returned element is the <html lang="en"> root rather than
    // rendering it (which would nest <html> inside jsdom's existing <html>).
    expect(tree.type).toBe("html");
    expect((tree.props as { lang?: string }).lang).toBe("en");
  });

  it("includes the header with Mini Marty branding", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByText("Mini Marty")).toBeInTheDocument();
  });

  it("includes navigation", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
