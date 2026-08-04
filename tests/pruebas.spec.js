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

test("TC-02 (RF-1.1) - Verificar el menú de navegación y los datos de contacto del sitio principal", async ({ page }) => {
  // Precondiciones:
  // - Tener conexión a Internet.
  // - No es necesario iniciar sesión.
  // Pasos realizados:
  // 1. Abrir https://gt.nic.gt
  // 2. Esperar que cargue la página.
  // 3. Verificar que exista el menú de navegación principal (#mainNav).
  // 4. Verificar que el menú incluya las secciones informativas del servicio.
  // 5. Verificar que se muestren las líneas telefónicas de contacto.
  // 6. Verificar que exista el carrusel informativo de la portada.
  // Resultado esperado:
  // - La portada expone la navegación y los datos de contacto del servicio.
  await page.goto("https://gt.nic.gt");
  await page.waitForLoadState("domcontentloaded");

  const menu = page.locator("#mainNav");
  await expect(menu).toBeVisible();

  // Secciones informativas que debe ofrecer el sitio principal.
  for (const seccion of ["Inicio", "Procedimientos", "Tarifas", "FAQ", "Contacto"]) {
    await expect(menu.getByRole("link", { name: seccion, exact: true })).toBeVisible();
  }

  // Enlaces a las políticas del registro.
  await expect(menu.locator('a[href="registration_policy.php"]')).toHaveCount(1);
  await expect(menu.locator('a[href="dispute_policy.php"]')).toHaveCount(1);

  // Datos de contacto visibles en la portada.
  await expect(page.locator("body")).toContainText("+502.23688302");
  await expect(page.locator("body")).toContainText("+502.23688564");

  // Carrusel informativo de la portada.
  await expect(page.locator("#carousel-example-generic")).toBeVisible();

  await page.screenshot({
    path: path.join("evidencias", "TC-02-navegacion-y-contacto.png"),
    fullPage: true,
  });
});

test("TC-03 (RF-1.1) - Verificar el buscador de dominios de la página principal", async ({ page }) => {
  // Precondiciones:
  // - Tener conexión a Internet.
  // - No es necesario iniciar sesión.
  // Pasos realizados:
  // 1. Abrir https://gt.nic.gt
  // 2. Verificar que el buscador de dominios esté visible en la portada.
  // 3. Escribir "uvg" en el campo de búsqueda (#texto-search).
  // 4. Enviar el formulario de búsqueda.
  // 5. Verificar que se cargue la página de resultados.
  // 6. Verificar que los resultados incluyan dominios .gt disponibles y registrados.
  // Resultado esperado:
  // - El servicio principal de consulta de dominios está accesible desde la portada y devuelve resultados.
  await page.goto("https://gt.nic.gt");
  await page.waitForLoadState("domcontentloaded");

  const campoBusqueda = page.locator("#texto-search");
  await expect(campoBusqueda).toBeVisible();
  await expect(campoBusqueda).toHaveAttribute("placeholder", /Nombre de Dominio/i);

  await campoBusqueda.fill("uvg");
  await page.locator('form.form-search button[type="submit"]').click();

  await page.waitForURL(/results\.php/);
  await page.waitForLoadState("domcontentloaded");

  // La página de resultados clasifica los dominios consultados.
  await expect(page.locator("body")).toContainText("Registrados");
  await expect(page.locator("body")).toContainText("uvg.edu.gt");
  await expect(page.locator("body")).toContainText("uvg.com.gt");

  // El menú de navegación se conserva en la página de resultados.
  await expect(page.locator("#mainNav")).toBeVisible();

  await page.screenshot({
    path: path.join("evidencias", "TC-03-buscador-dominios.png"),
    fullPage: true,
  });
});
