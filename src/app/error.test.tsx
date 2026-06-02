import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "./error";

describe("ErrorPage", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the error message and a retry button", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("kaboom")} reset={reset} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("kaboom")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
