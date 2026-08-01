import { test, expect } from '@playwright/test';

const URL = 'https://dev2.registro.gt';

test.use({ ignoreHTTPSErrors: true });

test.describe('RF-1.2 - Resumen de las últimas tres noticias de news.registro.gt', () => {

  test('CU-1: Se muestran al menos 3 publicaciones en la sección de noticias', async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('article h3');

    const noticias = page.locator('article');
    expect(await noticias.count()).toBeGreaterThanOrEqual(3);
  });

  test('CU-2: Cada una de las 3 últimas publicaciones muestra título, fecha y extracto', async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('article h3');

    const noticias = page.locator('article');

    for (let i = 0; i < 3; i++) {
      const noticia = noticias.nth(i);

      // Título
      const titulo = noticia.locator('div.ml-4 > h3');
      await expect(titulo).toBeVisible();
      const tituloTexto = (await titulo.textContent())?.trim();
      expect(tituloTexto?.length).toBeGreaterThan(0);

      // Fecha
      const fecha = noticia.locator('div.ml-4 > p');
      await expect(fecha).toBeVisible();
      const fechaTexto = (await fecha.textContent())?.trim();
      expect(fechaTexto?.length).toBeGreaterThan(0);
      expect(fechaTexto).toMatch(/\d{1,2} de \w+ de \d{4}/);

      // Extracto
      const extracto = noticia.locator('p.text-gray-600');
      await expect(extracto).toBeVisible();
      const extractoTexto = (await extracto.textContent())?.trim();
      expect(extractoTexto?.length).toBeGreaterThan(0);
    }
  });

  test('CU-3: Las publicaciones se muestran en orden cronológico descendente (más recientes primero)', async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('article h3');

    const noticias = page.locator('article');
    const fechas = [];

    for (let i = 0; i < 3; i++) {
      const fechaTexto = (await noticias.nth(i).locator('div.ml-4 > p').textContent())?.trim();
      fechas.push(new Date(parseFechaEsp(fechaTexto)));
    }

    for (let i = 0; i < fechas.length - 1; i++) {
      expect(fechas[i].getTime()).toBeGreaterThanOrEqual(fechas[i + 1].getTime());
    }
  });

});

function parseFechaEsp(texto) {
  const meses = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
  };

  const match = texto.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (!match) {
    throw new Error(`No se pudo parsear la fecha: "${texto}"`);
  }

  const [, dia, mes, anio] = match;
  return `${anio}-${meses[mes.toLowerCase()]}-${dia.padStart(2, '0')}`;
}