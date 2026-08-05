import { test, expect } from '@playwright/test';

test.use({ ignoreHTTPSErrors: true });

test('TC-04 (RF-1.2) - Resumen de las últimas tres noticias de news.registro.gt', async ({ page }) => {
  await page.goto('https://dev2.registro.gt');
  await page.waitForSelector('article h3');

  const noticias = page.locator('article');
  expect(await noticias.count()).toBeGreaterThanOrEqual(3);

  for (let i = 0; i < 3; i++) {
    const noticia = noticias.nth(i);

    const titulo = noticia.locator('div.ml-4 > h3');
    await expect(titulo).toBeVisible();
    const tituloTexto = (await titulo.textContent())?.trim();
    expect(tituloTexto?.length).toBeGreaterThan(0);

    const fecha = noticia.locator('div.ml-4 > p');
    await expect(fecha).toBeVisible();
    const fechaTexto = (await fecha.textContent())?.trim();
    expect(fechaTexto?.length).toBeGreaterThan(0);

    const extracto = noticia.locator('p.text-gray-600');
    await expect(extracto).toBeVisible();
    const extractoTexto = (await extracto.textContent())?.trim();
    expect(extractoTexto?.length).toBeGreaterThan(0);
  }
});