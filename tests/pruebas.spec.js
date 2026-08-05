import { test, expect } from "@playwright/test";
import path from "path";

// El portal de pruebas usa certificados que no siempre validan correctamente.
test.use({ ignoreHTTPSErrors: true });

const SITIO = "https://dev2.registro.gt/";

// El portal muestra un aviso modal ("Página de Pruebas") que bloquea los clics.
async function cerrarAvisoDePruebas(page) {
  const aviso = page.locator("#testPageNoticeModal");
  if (await aviso.isVisible().catch(() => false)) {
    await aviso.getByRole("button", { name: "Entendido" }).click();
    await expect(aviso).toBeHidden();
  }
}

test("TC-01 (RF-1.1) - Mostrar información principal", async ({ page }) => {
  // Precondiciones:
  // - Tener conexión a Internet.
  // - No es necesario iniciar sesión.
  // Pasos realizados:
  // 1. Abrir https://dev2.registro.gt/
  // 2. Esperar que cargue la página.
  // 3. Verificar que exista el encabezado principal.
  // 4. Verificar que exista el texto descriptivo.
  // 5. Verificar que la página no esté vacía.
  // Resultado esperado:
  // - La información principal del servicio aparece correctamente.
  await page.goto(SITIO);
  await page.waitForLoadState("domcontentloaded");
  await cerrarAvisoDePruebas(page);

  // Verifica que exista un título
  await expect(page).toHaveTitle(/Registro de dominios \.gt/i);
  await expect(page.locator("h1").first()).toBeVisible();

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
  // 1. Abrir https://dev2.registro.gt/
  // 2. Esperar que cargue la página.
  // 3. Verificar que exista el menú de navegación principal.
  // 4. Verificar que el menú incluya las secciones informativas del servicio.
  // 5. Verificar que se muestren las líneas telefónicas y el correo de contacto.
  // 6. Verificar que exista el carrusel informativo de la portada.
  // Resultado esperado:
  // - La portada expone la navegación y los datos de contacto del servicio.
  await page.goto(SITIO);
  await page.waitForLoadState("domcontentloaded");
  await cerrarAvisoDePruebas(page);

  // Secciones informativas que debe ofrecer el sitio principal.
  const secciones = ["/", "/procedures", "/fees", "/faq", "/estadisticas"];
  for (const ruta of secciones) {
    await expect(page.locator(`nav a[href="${ruta}"]`).first()).toHaveCount(1);
  }

  // Enlaces a las políticas del registro.
  await expect(page.locator('nav a[href="/registration_policy"]').first()).toHaveCount(1);
  await expect(page.locator('nav a[href="/dispute_policy"]').first()).toHaveCount(1);

  // Datos de contacto visibles en el pie de página.
  const pie = page.locator("#footer");
  await expect(pie).toContainText("+502.23688302");
  await expect(pie).toContainText("+502.23688564");
  await expect(pie).toContainText("admin@cctld.gt");

  // Carrusel informativo de la portada.
  await expect(page.locator(".carousel-dot").first()).toBeVisible();

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
  // 1. Abrir https://dev2.registro.gt/
  // 2. Verificar que el buscador de dominios esté visible en la portada.
  // 3. Escribir "uvg" en el campo de búsqueda (#heroSearchInput).
  // 4. Enviar el formulario de búsqueda.
  // 5. Verificar que se cargue la página de resultados.
  // 6. Verificar que los resultados incluyan dominios .gt consultados.
  // Resultado esperado:
  // - El servicio principal de consulta de dominios está accesible desde la portada y devuelve resultados.
  await page.goto(SITIO);
  await page.waitForLoadState("domcontentloaded");
  await cerrarAvisoDePruebas(page);

  const campoBusqueda = page.locator("#heroSearchInput");
  await expect(campoBusqueda).toBeVisible();
  await expect(campoBusqueda).toHaveAttribute("placeholder", /nombre de dominio/i);

  await campoBusqueda.fill("uvg");
  await page.locator('#heroSearchForm button[type="submit"]').click();

  await page.waitForURL(/\/results\/?\?q=uvg/);
  await page.waitForLoadState("domcontentloaded");

  // La página de resultados clasifica los dominios consultados.
  await expect(page.locator("body")).toContainText("Disponibles para registro");
  await expect(page.locator("body")).toContainText("uvg.com.gt");
  await expect(page.locator("body")).toContainText("uvg.edu.gt");

  // El buscador se conserva en la página de resultados.
  await expect(page.locator("#domainInput")).toBeVisible();

  await page.screenshot({
    path: path.join("evidencias", "TC-03-buscador-dominios.png"),
    fullPage: true,
  });
});
