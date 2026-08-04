import { test, expect } from '@playwright/test';

const URL = 'https://www.gt/sitio/';

test.describe('RF-2.1 - Buscador de disponibilidad de dominios', () => {

  test('CU-1: El buscador de dominios está presente y es funcional', async ({ page }) => {
    await page.goto(URL);

    const input = page.locator('input#texto-search');
    const boton = page.locator('button.boton-search');

    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Escriba un Nombre de Dominio');

    await expect(boton).toBeVisible();
    await expect(boton).toContainText('Buscar');
    await expect(boton).toHaveAttribute('type', 'submit');
  });

  test('CU-2: Búsqueda de un dominio disponible', async ({ page }) => {
    await page.goto(URL);

    const nombreAleatorio = `testqa${Date.now()}`;

    await page.fill('input#texto-search', nombreAleatorio);
    await page.click('button.boton-search');

    await page.waitForURL('**/results.php**');
    await page.waitForSelector('div.row.content-rate');

    const disponibles = page.locator('div.span6.data-rate').first();
    await expect(disponibles.locator('h4')).toHaveText('Disponibles');

    // Un resultado en lac columna disponibles
    const resultados = disponibles.locator('div.caja.caja-resultados');
    expect(await resultados.count()).toBeGreaterThan(0);

    // Buscado en resultados disponibles
    await expect(disponibles).toContainText(nombreAleatorio);

    // Mostrar la opción de reservar
    await expect(disponibles.getByText('Reservar').first()).toBeVisible();
  });

  test('CU-3: Búsqueda de un dominio ya registrado', async ({ page }) => {
    await page.goto(URL);

    await page.fill('input#texto-search', 'uvg');
    await page.click('button.boton-search');

    await page.waitForURL('**/results.php**');
    await page.waitForSelector('div.row.content-rate');

    const registrados = page.locator('div.span6.data-rate').nth(1);
    await expect(registrados.locator('h4')).toHaveText('Registrados');

    // uvg.edu.gt debe aparecer como registrado
    await expect(registrados).toContainText('uvg.edu.gt');

    // Mostrar opcion opción de consulta/pago para dominios registrados
    await expect(registrados.getByText('Consulta / Pago').first()).toBeVisible();
  });

});