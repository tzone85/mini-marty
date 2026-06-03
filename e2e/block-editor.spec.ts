import { test, expect } from "@playwright/test";

test("block editor page mounts with heading", async ({ page }) => {
  await page.goto("/block-editor");
  await expect(
    page.getByRole("heading", { name: /block editor/i }),
  ).toBeVisible();
});

test("blockly workspace renders the main background SVG", async ({ page }) => {
  await page.goto("/block-editor");
  await expect(page.locator(".blocklyMainBackground").first()).toBeVisible({
    timeout: 15_000,
  });
});

test("block editor survives a reload with persisted state", async ({
  page,
}) => {
  await page.goto("/block-editor");
  await page.evaluate(() => {
    localStorage.setItem(
      "mini-marty-blocks",
      JSON.stringify({ blocks: { languageVersion: 0, blocks: [] } }),
    );
  });
  await page.reload();
  await expect(page.locator(".blocklyMainBackground").first()).toBeVisible({
    timeout: 15_000,
  });
});
