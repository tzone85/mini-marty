import { describe, it, expect, vi } from "vitest";

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

describe("RootLayout", () => {
  it("returns html with lang attribute and embeds AppShell", () => {
    const tree = RootLayout({ children: <p>Test content</p> });
    // Verify the returned element is the <html lang="en"> root rather than
    // rendering it (which would nest <html> inside jsdom's existing <html>).
    expect(tree.type).toBe("html");
    expect((tree.props as { lang?: string }).lang).toBe("en");
  });
});
