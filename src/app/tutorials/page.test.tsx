import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TutorialsPage from "./page";

describe("TutorialsPage", () => {
  it("renders the heading and API reference section", () => {
    render(<TutorialsPage />);
    expect(
      screen.getByRole("heading", { name: /^tutorials$/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /api quick reference/i }),
    ).toBeInTheDocument();
  });

  it("opens a tutorial when its card is clicked, then closes it via Back", () => {
    render(<TutorialsPage />);
    const card = screen.getByRole("button", { name: /hello marty/i });
    fireEvent.click(card);
    expect(
      screen.getByRole("button", { name: /back to tutorials/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /back to tutorials/i }));
    expect(
      screen.getByRole("heading", { name: /^tutorials$/i, level: 1 }),
    ).toBeInTheDocument();
  });

  it("navigates between tutorial steps with Next and Previous", () => {
    render(<TutorialsPage />);
    fireEvent.click(screen.getByRole("button", { name: /hello marty/i }));
    expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByText(/step 2 of/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^previous$/i }));
    expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
  });
});
