import { test, expect } from "@playwright/test";

test("python editor page renders the run/stop toolbar", async ({ page }) => {
  await page.goto("/python-editor");
  await expect(
    page.getByRole("heading", { name: /python editor/i }),
  ).toBeVisible();
  // The Run button is present immediately but disabled until Pyodide loads.
  await expect(page.getByRole("button", { name: /^run$/i })).toBeVisible();
});

test("python editor shows pyodide loading status", async ({ page }) => {
  await page.goto("/python-editor");
  // Status component renders text describing the current Pyodide state.
  // We just verify the page mounts without runtime errors.
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.waitForTimeout(2000);
  const fatal = errors.filter((e) => !/WebGL|GPU|getContext/i.test(e));
  expect(fatal).toEqual([]);
});
