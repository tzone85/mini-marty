import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/block-editor",
  "/python-editor",
  "/tutorials",
  "/challenges",
];

for (const route of ROUTES) {
  test(`a11y: ${route} has no axe violations`, async ({ page }) => {
    await page.goto(route);
    // Wait for layout to settle but tolerate long-loading Pyodide/Blockly canvases.
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
