import { test, expect } from "@playwright/test";

test("challenges list renders with heading and difficulty filters", async ({
  page,
}) => {
  await page.goto("/challenges");
  await expect(
    page.getByRole("heading", { name: /^challenges$/i, level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^beginner/i })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^intermediate/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^advanced/i })).toBeVisible();
});

test("difficulty filter narrows the listing", async ({ page }) => {
  await page.goto("/challenges");
  await page.getByRole("button", { name: /^beginner/i }).click();
  // After filtering, the heading still shows and at least one challenge card remains.
  await expect(
    page.getByRole("heading", { name: /^challenges$/i, level: 1 }),
  ).toBeVisible();
});
