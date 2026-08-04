import { test, expect } from "@playwright/test";
import path from "path";

// El certificado de gt.nic.gt no coincide con el nombre común del dominio.
test.use({ ignoreHTTPSErrors: true });

test("TC-01 (RF-1.1) - Mostrar información principal", async ({ page }) => {
  // Precondiciones:
  // - Tener conexión a Internet.
  // - No es necesario iniciar sesión.
  // Pasos realizados:
  // 1. Abrir https://gt.nic.gt
  // 2. Esperar que cargue la página.
  // 3. Verificar que exista el encabezado principal.
  // 4. Verificar que exista el texto descriptivo.
  // 5. Verificar que la página no esté vacía.
  // Resultado esperado:
  // - La información principal del servicio aparece correctamente.
  await page.goto("https://gt.nic.gt");
  await page.waitForLoadState("domcontentloaded");

  // Verifica que exista un título
  await expect(page.locator("h1")).toBeVisible();

  // Verifica que exista información relacionada con dominios
  await expect(page.locator("body")).toContainText("Dominios");

  // Verifica que exista al menos un botón o enlace
  await expect(page.getByRole("link").first()).toBeVisible();

  await page.screenshot({
    path: path.join("evidencias", "TC-01-informacion-principal.png"),
    fullPage: true,
  });
});
