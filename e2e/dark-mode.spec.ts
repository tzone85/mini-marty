import { test, expect } from "@playwright/test";

test("dark mode toggle persists across navigation", async ({ page }) => {
  await page.goto("/");
  // Force light mode as the starting point regardless of system preference.
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("mini-marty-theme", "light");
  });
  await page.reload();

  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.goto("/tutorials");
  await expect(page.locator("html")).toHaveClass(/dark/);
});
