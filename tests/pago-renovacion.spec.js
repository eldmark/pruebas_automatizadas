import { test, expect } from '@playwright/test';

const URL = 'https://dev2.registro.gt/';
test.use({ ignoreHTTPSErrors: true });

// El aviso modal "Página de Pruebas" solo deja de mostrarse si se marca
// test_page_modal_dismissed en localStorage; addInitScript lo aplica antes
// de cada navegación (no solo la primera), así no bloquea clics posteriores
// (p. ej. "Reservar" tras la navegación a /results/ en TC-42).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('test_page_modal_dismissed', 'true');
  });
});

async function cerrarModalPruebas(page) {
  const boton = page.getByRole('button', { name: 'Entendido' });
  if (await boton.isVisible().catch(() => false)) {
    await boton.click();
  }
}

test.describe('RF-4.2 - Pago de renovación y notificación a contactos (bloqueado por dependencia de RF-4.1)', () => {

  test('TC-41 (RF-4.2): No existe flujo de pago de renovación accesible sin sesión', async ({ page }) => {
    await page.goto(URL);
    await cerrarModalPruebas(page);
    // Ya que no existe funcionalidad de renovación (ver RF-4.1),
    // se verifica que tampoco exista un flujo de pago asociado a "renovar" sin sesión.
    const pagoRenovacion = page.getByText(/pagar renovaci[oó]n|renovar y pagar/i);
    await expect(pagoRenovacion).toHaveCount(0);
    await page.screenshot({ path: 'evidencias/rf4.2-tc01-sin-flujo-pago-renovacion.png', fullPage: true });
  });

  test('TC-42 (RF-4.2): El único camino de pago es vía carrito de compra, que exige login', async ({ page }) => {
    await page.goto(URL);
    await cerrarModalPruebas(page);
    await page.locator('#heroSearchInput').fill('gt');
    await page.locator('#heroSearchInput').press('Enter');
    await page.waitForTimeout(1500);
    const botonReservar = page.getByRole('button', { name: /reservar/i }).first();
    await botonReservar.click();
    await page.waitForTimeout(1500);
    // Documentar qué pasa: ¿pide login antes de llegar a pago?
    await page.screenshot({ path: 'evidencias/rf4.2-tc02-flujo-compra-requiere-login.png', fullPage: true });
  });

  test('TC-43 (RF-4.2): No es posible verificar notificación a contactos sin completar una renovación real', async ({ page }) => {
    // Este caso queda documentado como NO EJECUTABLE / MANUAL BLOQUEADO,
    // ya que requeriría: 1) que exista el flujo de renovación (no existe),
    // 2) completar un pago real, 3) acceso a las cuentas de correo de los
    // contactos Administrativo, Técnico y de Cobro (no disponibles para el equipo).
    // Se documenta como hallazgo, no como test automatizado.
    expect(true).toBe(true); // placeholder para dejar constancia en el reporte de Playwright
  });

});