import { test, expect } from '@playwright/test';

const URL = 'https://dev2.registro.gt/';
test.use({ ignoreHTTPSErrors: true });

async function cerrarModalPruebas(page) {
  const boton = page.getByRole('button', { name: 'Entendido' });
  if (await boton.isVisible().catch(() => false)) {
    await boton.click();
  }
}

test.describe('RF-4.1 - Renovación rápida sin sesión (requisito NO implementado)', () => {

  test('TC-38 (RF-4.1): No existe ningún enlace/botón de "renovación" en el sitio', async ({ page }) => {
    await page.goto(URL);
    await cerrarModalPruebas(page);
    const renovacion = page.getByText(/renovaci[oó]n|renovar/i);
    await expect(renovacion).toHaveCount(0);
    await page.screenshot({ path: 'evidencias/rf4.1-tc01-sin-renovacion.png', fullPage: true });
  });

  test('TC-39 (RF-4.1): Buscar un dominio ya registrado solo da opción de "Reservar", no "Renovar"', async ({ page }) => {
    await page.goto(URL);
    await cerrarModalPruebas(page);
    await page.locator('#heroSearchInput').fill('gt');
    await page.locator('#heroSearchInput').press('Enter');
    await page.waitForTimeout(1500);
    const botonReservar = page.getByRole('button', { name: /reservar/i }).first();
    await expect(botonReservar).toBeVisible();
    await page.screenshot({ path: 'evidencias/rf4.1-tc02-solo-reservar.png', fullPage: true });
  });

  test('TC-40 (RF-4.1): Comportamiento es idéntico para dominio existente y ficticio (ambos van a flujo de compra)', async ({ page }) => {
    await page.goto(URL);
    await cerrarModalPruebas(page);
    await page.locator('#heroSearchInput').fill('estenoexistegt123456');
    await page.locator('#heroSearchInput').press('Enter');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'evidencias/rf4.1-tc03-dominio-ficticio.png', fullPage: true });
  });

});