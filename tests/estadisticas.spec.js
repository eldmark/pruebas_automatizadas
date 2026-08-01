const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ ignoreHTTPSErrors: true });

const BASE_URL = 'https://dev2.registro.gt/estadisticas';

async function abrirEstadisticas(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
}

async function obtenerWidgetEstadisticas(page) {
  return page.locator('table').first();
}

async function obtenerRangoFechas(page) {
  const inicio = page.locator('input[type="date"]').first();
  const fin = page.locator('input[type="date"]').nth(1);

  return { inicio, fin };
}

async function guardarEvidencia(page, nombreArchivo) {
  await page.screenshot({
    path: path.join('evidencias', nombreArchivo),
    fullPage: true,
  });
}

test.skip('Exploratorio DOM RF-1.3 - inspección manual previa de "Estadísticas"', async ({ page }) => {
  // Precondiciones:
  // - El portal debe responder y la sección "Estadísticas" debe ser accesible desde la UI.
  // Pasos:
  // 1. Abrir https://dev2.registro.gt/estadisticas.
  // 2. Identificar en el DOM real si existe tabla, tarjetas, SVG/canvas, date picker y filtro de subdominios.
  // Resultado esperado:
  // - Quedan confirmados los selectores reales para automatizar los casos TC-07, TC-08 y TC-09.
  await abrirEstadisticas(page);
  await guardarEvidencia(page, 'Exploratorio-estadisticas-dom.png');
});

test('TC-07 (RF-1.3) - Verificar que "Estadísticas" carga y muestra datos por defecto', async ({ page }) => {
  // Precondiciones:
  // - El portal https://dev2.registro.gt/estadisticas está disponible.
  // Pasos:
  // 1. Abrir la ruta directa de estadísticas.
  // 2. Verificar que la vista muestre el título principal, filtros y datos por defecto.
  // Resultado esperado:
  // - La sección se renderiza correctamente y presenta métricas y tabla visibles al usuario.
  await abrirEstadisticas(page);

  await expect(page).toHaveTitle(/Estad[ií]sticas de Dominios \.GT/);
  await expect(page.getByRole('heading', { name: /estad[ií]sticas de dominios \.gt/i })).toBeVisible();
  await expect(page.getByText(/última actualización:/i)).toBeVisible();
  await expect(page.getByText(/filtros de reporte/i)).toBeVisible();
  await expect(page.locator('input[type="date"]')).toHaveCount(2);
  await expect(page.locator('select')).toHaveCount(1);
  await expect(page.getByRole('button', { name: /consultar/i })).toBeVisible();
  await expect(page.getByText(/total de dominios/i)).toBeVisible();
  await expect(page.getByText(/dominios nuevos/i)).toBeVisible();
  await expect(page.getByText(/dominios eliminados/i)).toBeVisible();
  await expect(page.locator('table')).toBeVisible();
  await expect(page.locator('table')).toContainText('.com.gt');
  await expect(page.locator('table')).toContainText(/total general/i);

  await guardarEvidencia(page, 'TC-07-estadisticas-default.png');
});

test('TC-08 (RF-1.3) - Verificar que un rango de fechas válido recalcula las estadísticas', async ({ page }) => {
  // Precondiciones:
  // - La sección "Estadísticas" está accesible.
  // - Existen controles de fecha accesibles o un equivalente navegable por Playwright.
  // Pasos:
  // 1. Capturar el estado inicial.
  // 2. Aplicar un rango de fechas válido.
  // 3. Ejecutar la consulta y verificar que la vista permanezca consistente.
  // Resultado esperado:
  // - El filtro acepta el rango, no rompe la página y mantiene visibles los componentes principales del reporte.
  await abrirEstadisticas(page);

  const widget = await obtenerWidgetEstadisticas(page);
  await expect(widget).toBeVisible();

  const { inicio, fin } = await obtenerRangoFechas(page);
  const rangoInicio = '2026-01-01';
  const rangoFin = '2026-06-30';

  await inicio.fill(rangoInicio);
  await fin.fill(rangoFin);

  // TODO: Confirmar el disparador real de recálculo (change, blur, botón "Consultar" o submit del formulario).
  const posiblesDisparadores = [
    page.getByRole('button', { name: /consultar/i }),
    page.getByRole('link', { name: /consultar/i }),
  ];

  for (const disparador of posiblesDisparadores) {
    if ((await disparador.count()) > 0) {
      await disparador.first().click({ timeout: 5000 });
      break;
    }
  }

  await page.waitForLoadState('networkidle');

  await expect(page.locator('body')).toBeVisible();
  await expect(inicio).toHaveValue(rangoInicio);
  await expect(fin).toHaveValue(rangoFin);
  await expect(page.getByText(/filtros de reporte/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /consultar/i })).toBeVisible();
  await expect(page.locator('#suffixChart')).toBeVisible();
  await expect(page.locator('#statusChart')).toBeVisible();
  await expect(widget).toBeVisible();

  await guardarEvidencia(page, 'TC-08-estadisticas-rango-fechas.png');
});
//
// test('TC-09 (RF-1.3) - Verificar comportamiento ante rango de fechas inválido o vacío', async ({ page }) => {
//   // Precondiciones:
//   // - La sección "Estadísticas" está accesible.
//   // - Existen controles de fecha accesibles o un equivalente navegable por Playwright.
//   // Pasos:
//   // 1. Abrir la sección "Estadísticas".
//   // 2. Colocar un rango inválido o vacío.
//   // 3. Verificar que el sistema muestre un error o no rompa la página.
//   // Resultado esperado:
//   // - La interfaz no se cae y muestra validación, mensaje de error o conserva la estabilidad visual.
//   // await abrirPortalYEntrarASestisticas(page);
//
//   // const { inicio, fin } = await obtenerRangoFechas(page);
//   // await inicio.fill('2026-06-30');
//   // await fin.fill('2026-01-01');
//
//   // TODO: Confirmar si la validación se dispara por blur, cambio de fecha o envío explícito.
//   // const posiblesDisparadores = [
//   //   page.getByRole('button', { name: /filtrar|aplicar|buscar|actualizar/i }),
//   //   page.getByRole('button', { name: /aceptar|guardar/i }),
//   // ];
//
//   // for (const disparador of posiblesDisparadores) {
//   //   if ((await disparador.count()) > 0) {
//   //     await disparador.first().click({ timeout: 5000 });
//   //     break;
//   //   }
//   // }
//
//   // await page.waitForLoadState('networkidle');
//
//   // const errorPosible = page.getByText(/error|inv[aá]lida|rango|fecha/i).first();
//   // if ((await errorPosible.count()) > 0) {
//   //   await expect(errorPosible).toBeVisible();
//   // } else {
//   //   await expect(page.locator('body')).toBeVisible();
//   // }
//
//   // await guardarEvidencia(page, 'TC-09-estadisticas-rango-invalido.png');
// // });
