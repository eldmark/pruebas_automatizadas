import { test, expect } from "@playwright/test";

test("RF-1.1 - Mostrar información principal", async ({ page }) => {
  await page.goto("https://gt.nic.gt");

  // Verifica que exista un título
  await expect(page.locator("h1")).toBeVisible();

  // Verifica que exista información relacionada con dominios
  await expect(page.locator("body")).toContainText("Dominios");

  // Verifica que exista al menos un botón o enlace
  await expect(page.getByRole("link").first()).toBeVisible();
});
