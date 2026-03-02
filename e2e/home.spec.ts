import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("displays the Mini Marty heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /mini marty/i })).toBeVisible();
  });

  test("displays the description text", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/visual programming environment/i)).toBeVisible();
  });
});
