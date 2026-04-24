import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeToggle } from "./ThemeToggle";

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders a toggle button", () => {
    renderWithTheme();
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("shows sun icon in light mode", () => {
    renderWithTheme();
    expect(screen.getByLabelText(/toggle theme/i)).toHaveTextContent("☀️");
  });

  it("shows moon icon in dark mode", async () => {
    localStorage.setItem("mini-marty-theme", "dark");
    renderWithTheme();
    expect(screen.getByLabelText(/toggle theme/i)).toHaveTextContent("🌙");
  });

  it("toggles from light to dark on click", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(screen.getByLabelText(/toggle theme/i)).toHaveTextContent("🌙");
  });
});
