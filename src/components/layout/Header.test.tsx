import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";
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

function renderHeader(pathname = "/") {
  mockPathname.mockReturnValue(pathname);
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe("Header", () => {
  it("renders the logo text", () => {
    renderHeader();
    expect(screen.getByText("Mini Marty")).toBeInTheDocument();
  });

  it("renders navigation links for all routes", () => {
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

  it("highlights the active nav link", () => {
    renderHeader("/tutorials");
    const tutorialsLink = screen.getByRole("link", { name: /tutorials/i });
    expect(tutorialsLink).toHaveAttribute("aria-current", "page");
  });

  it("does not highlight inactive nav links", () => {
    renderHeader("/tutorials");
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("includes the theme toggle", () => {
    renderHeader();
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("renders as a banner landmark", () => {
    renderHeader();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders navigation landmark", () => {
    renderHeader();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
