const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ ignoreHTTPSErrors: true });

async function guardarEvidencia(page, nombreArchivo) {
  await page.screenshot({
    path: path.join('evidencias', nombreArchivo),
    fullPage: true,
  });
}

test('TC-31 (RF-5.1) - Verificar alternancia de idioma de español a inglés', async ({ page }) => {
  // Precondiciones:
  // - El portal debe estar disponible en la ruta principal.
  // - La interfaz debe cargar inicialmente en español.
  // Pasos realizados:
  // 1. Abrir la página principal en español.
  // 2. Ubicar el enlace de idioma "EN".
  // 3. Hacer clic para cambiar a inglés.
  // 4. Verificar URL, idioma del documento y textos visibles en inglés.
  // Resultado esperado:
  // - La interfaz cambia correctamente a inglés sin romper la navegación ni el contenido principal.
  await page.goto('https://dev2.registro.gt/', { waitUntil: 'networkidle' });

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('link', { name: 'EN', exact: true })).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/en\/?$/),
    page.getByRole('link', { name: 'EN', exact: true }).click(),
  ]);

  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/\.gt Domain Registration/);
  await expect(page.getByText(/Register your \.gt domain today\./i)).toBeVisible();
  await expect(page.getByRole('link', { name: 'ES', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();

  await guardarEvidencia(page, 'TC-31-cambio-idioma-espanol-a-ingles.png');
});
