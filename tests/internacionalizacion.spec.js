const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ ignoreHTTPSErrors: true });

// El aviso modal "Página de Pruebas" solo deja de mostrarse si se marca
// test_page_modal_dismissed en localStorage; addInitScript lo aplica antes
// de cada navegación (no solo la primera), así no bloquea clics posteriores.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('test_page_modal_dismissed', 'true');
  });
});

async function guardarEvidencia(page, nombreArchivo) {
  await page.screenshot({
    path: path.join('evidencias', nombreArchivo),
    fullPage: true,
  });
}

async function navegarConReintento(page, url) {
  for (let intento = 0; intento < 2; intento += 1) {
    try {
      await page.goto(url, { waitUntil: 'commit' });
      await page.waitForLoadState('domcontentloaded');
      return;
    } catch (error) {
      if (intento === 1) {
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }
}

// El sitio siempre renderiza dos copias de la navegación (menú de escritorio
// y el panel #mobile-main-panel), ambas con el mismo texto de enlace; por eso
// getByRole('link', { name }) es ambiguo. El panel móvil se oculta con un
// transform/overflow (no display:none), así que :visible no lo distingue;
// se excluye explícitamente por ser descendiente de #mobile-main-panel.
function enlaceNav(page, texto) {
  return page.locator(
    `xpath=//a[normalize-space(text())="${texto}" and not(ancestor::*[@id="mobile-main-panel"])]`
  );
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
  await navegarConReintento(page, 'https://dev2.registro.gt/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(enlaceNav(page, 'EN')).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/en\/?$/),
    enlaceNav(page, 'EN').click(),
  ]);

  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/\.gt Domain Registration/);
  await expect(page.getByText(/Register your \.gt domain today\./i)).toBeVisible();
  await expect(enlaceNav(page, 'ES')).toBeVisible();
  await expect(enlaceNav(page, 'Home')).toBeVisible();

  await guardarEvidencia(page, 'TC-31-cambio-idioma-espanol-a-ingles.png');
});

test('TC-32 (RF-5.1) - Verificar alternancia de idioma de inglés a español', async ({ page }) => {
  // Precondiciones:
  // - El portal debe estar disponible en la versión inglesa.
  // - La interfaz debe cargar inicialmente en inglés.
  // Pasos realizados:
  // 1. Abrir la página principal en inglés.
  // 2. Ubicar el enlace de idioma "ES".
  // 3. Hacer clic para regresar al español.
  // 4. Verificar URL, idioma del documento y textos visibles en español.
  // Resultado esperado:
  // - La interfaz cambia correctamente a español sin romper la navegación ni el contenido principal.
  await navegarConReintento(page, 'https://dev2.registro.gt/en');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(enlaceNav(page, 'ES')).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/?$/),
    enlaceNav(page, 'ES').click(),
  ]);

  await expect(page).toHaveURL(/\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle(/Registro de dominios \.gt/);
  await expect(page.getByText(/Registra tu dominio \.gt hoy mismo\./i)).toBeVisible();
  await expect(enlaceNav(page, 'EN')).toBeVisible();
  await expect(enlaceNav(page, 'Inicio')).toBeVisible();

  await guardarEvidencia(page, 'TC-32-cambio-idioma-ingles-a-espanol.png');
});

test('TC-33 (RF-5.1) - Verificar alternancia consecutiva de idioma en la misma sesión', async ({ page }) => {
  // Precondiciones:
  // - El portal debe estar disponible en ambas versiones del idioma.
  // - La interfaz debe cargar inicialmente en español.
  // Pasos realizados:
  // 1. Abrir la página principal en español.
  // 2. Cambiar a inglés.
  // 3. Volver a español en la misma sesión.
  // 4. Verificar que ambos cambios se reflejen correctamente sin romper la interfaz.
  // Resultado esperado:
  // - El usuario puede alternar idioma más de una vez y la página conserva su funcionamiento normal.
  await navegarConReintento(page, 'https://dev2.registro.gt/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(enlaceNav(page, 'EN')).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/en\/?$/),
    enlaceNav(page, 'EN').click(),
  ]);

  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByText(/Register your \.gt domain today\./i)).toBeVisible();
  await expect(enlaceNav(page, 'ES')).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/?$/),
    enlaceNav(page, 'ES').click(),
  ]);

  await expect(page).toHaveURL(/\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByText(/Registra tu dominio \.gt hoy mismo\./i)).toBeVisible();
  await expect(enlaceNav(page, 'EN')).toBeVisible();

  await guardarEvidencia(page, 'TC-33-alternancia-consecutiva-idioma.png');
});
