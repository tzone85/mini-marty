import { test, expect } from "@playwright/test";

test("tutorials list renders with heading and at least one tutorial card", async ({
  page,
}) => {
  await page.goto("/tutorials");
  await expect(
    page.getByRole("heading", { name: /^tutorials$/i, level: 1 }),
  ).toBeVisible();
  // At least one tutorial entry surfaces a difficulty pill.
  await expect(page.getByText(/beginner|intermediate|advanced/i).first()).toBeVisible();
});

test("tutorial card opens a step view", async ({ page }) => {
  await page.goto("/tutorials");
  await page.getByRole("button").filter({ hasText: /hello marty/i }).first().click();
  await expect(page.getByRole("button", { name: /back to tutorials/i })).toBeVisible();
});
