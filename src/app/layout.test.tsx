import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders children within the app shell", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
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
