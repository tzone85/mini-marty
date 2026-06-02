import { test, expect } from "@playwright/test";

test("skip link is the first tab stop and moves focus to main", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText(/skip to main content/i);
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("nav links are reachable via keyboard", async ({ page }) => {
  await page.goto("/");
  // Tab forward several times — each Tab must always land on a visible element.
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();
  }
});
