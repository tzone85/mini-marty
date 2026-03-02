import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./theme-context";

function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("reads initial theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles theme from light to dark", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggles theme from dark to light", async () => {
    localStorage.setItem("theme", "dark");
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("persists theme to localStorage on toggle", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("adds dark class to documentElement when dark", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class from documentElement when light", async () => {
    localStorage.setItem("theme", "dark");
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: /toggle/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
    consoleError.mockRestore();
  });
});
