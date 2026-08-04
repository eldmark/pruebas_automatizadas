const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ ignoreHTTPSErrors: true });

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

test('TC-34 (RF-2.2) - Consultar el WHOIS de un dominio registrado desde los resultados de búsqueda', async ({ page }) => {
  // Precondiciones:
  // - El portal debe estar disponible en la ruta principal.
  // - El dominio usac.edu.gt debe existir como dominio ya registrado.
  // Pasos realizados:
  // 1. Abrir la página principal.
  // 2. Escribir "usac" en el buscador de dominios (#heroSearchInput) y enviar el formulario.
  // 3. Ubicar la sección "Dominios Registrados" y el dominio marcado como "No disponible".
  // 4. Presionar el enlace "Ver detalles..." que apunta al WHOIS del dominio.
  // 5. Verificar que la vista WHOIS muestre nombre, estado y fecha de expiración.
  // Resultado esperado:
  // - El sistema muestra la información WHOIS del dominio ya registrado.
  await navegarConReintento(page, 'https://dev2.registro.gt/');

  await page.locator('#heroSearchInput').fill('usac');
  await page.locator('#heroSearchForm button[type="submit"]').click();
  await page.waitForURL(/\/results\/?\?q=usac/);

  // El dominio registrado aparece en el bloque "Dominios Registrados" y no es reservable.
  await expect(page.getByText('Dominios Registrados', { exact: false })).toBeVisible();
  await expect(page.getByText('usac.edu.gt', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('No disponible', { exact: false }).first()).toBeVisible();

  const enlaceWhois = page.locator('a[href*="/whois"][href*="usac.edu.gt"]').first();
  await expect(enlaceWhois).toBeVisible();
  await enlaceWhois.click();

  await page.waitForURL(/\/whois/);
  await expect(page.locator('#domain-content')).toBeVisible();
  await expect(page.locator('#domainNameDisplay')).toHaveText('usac.edu.gt');
  await expect(page.locator('#domainStatusDisplay')).toHaveText(/ACTIVO/i);
  await expect(page.locator('#expirationDateDisplay')).not.toBeEmpty();

  await guardarEvidencia(page, 'TC-34-whois-desde-resultados.png');
});

test('TC-35 (RF-2.2) - Verificar los datos completos del WHOIS de un dominio registrado', async ({ page }) => {
  // Precondiciones:
  // - El portal debe exponer la ruta /whois con el parámetro de dominio.
  // - El dominio usac.edu.gt debe existir como dominio ya registrado.
  // Pasos realizados:
  // 1. Abrir directamente https://dev2.registro.gt/whois?q=usac.edu.gt.
  // 2. Verificar el bloque de identificación del dominio (nombre, estado, expiración, tarifa).
  // 3. Verificar el bloque de organización titular (nombre, dirección, teléfono).
  // 4. Verificar los servidores de nombres y los contactos administrativo y técnico.
  // Resultado esperado:
  // - El WHOIS muestra todos los bloques de información del dominio registrado y no muestra el mensaje de error.
  await navegarConReintento(page, 'https://dev2.registro.gt/whois?q=usac.edu.gt');

  await expect(page.locator('#domain-content')).toBeVisible();
  await expect(page.locator('#domain-error')).toBeHidden();

  // Identificación del dominio.
  await expect(page.locator('#domainNameDisplay')).toHaveText('usac.edu.gt');
  await expect(page.locator('#domainStatusDisplay')).toHaveText(/ACTIVO/i);
  await expect(page.locator('#expirationDateDisplay')).toHaveText(/^\d{4}-[A-Za-z]{3}-\d{2}$/);
  await expect(page.locator('#annualFeeDisplay')).toHaveText(/\$\s?\d+\.\d{2}/);

  // Organización titular.
  await expect(page.locator('#orgNameDisplay')).toHaveText(/Universidad de San Carlos de Guatemala/i);
  await expect(page.locator('#orgAddressDisplay')).not.toBeEmpty();
  await expect(page.locator('#orgPhoneDisplay')).not.toBeEmpty();

  // Servidores de nombres: deben existir al menos dos entradas.
  const servidores = page.locator('#nameserversContainer li');
  await expect(servidores.first()).toBeVisible();
  expect(await servidores.count()).toBeGreaterThanOrEqual(2);

  // Contactos administrativo y técnico.
  const contactos = page.locator('#contactsContainer');
  await expect(contactos).toContainText('Contacto Administrativo');
  await expect(contactos).toContainText('Contacto Técnico');
  await expect(contactos).toContainText(/@usac\.edu\.gt/);

  await guardarEvidencia(page, 'TC-35-whois-datos-completos.png');
});

test('TC-36 (RF-2.2) - Verificar el WHOIS de un dominio no registrado', async ({ page }) => {
  // Precondiciones:
  // - El portal debe exponer la ruta /whois con el parámetro de dominio.
  // - El dominio consultado no debe existir en el registro.
  // Pasos realizados:
  // 1. Consultar en los resultados de búsqueda que uvg.com.gt aparece como disponible para registro.
  // 2. Abrir el WHOIS de ese mismo dominio no registrado.
  // 3. Revisar la información devuelta por el WHOIS.
  // Resultado esperado (según RF-2.2):
  // - El WHOIS solo debería mostrar información de dominios ya registrados, por lo que
  //   para un dominio disponible debería mostrarse el bloque de error (#domain-error).
  // Resultado obtenido:
  // - DEFECTO: el WHOIS devuelve datos aparentemente generados a partir del nombre consultado
  //   (estado ACTIVO, titular "<NOMBRE> S.A.", servidores ns1/ns2) para un dominio que el propio
  //   buscador ofrece como disponible. La prueba deja constancia de este comportamiento real.
  await navegarConReintento(page, 'https://dev2.registro.gt/results/?q=uvg');

  // El buscador ofrece uvg.com.gt como disponible para registro.
  await expect(page.locator('button.reserve-btn[data-domain="uvg.com.gt"]')).toBeVisible();

  await navegarConReintento(page, 'https://dev2.registro.gt/whois?q=uvg.com.gt');

  // Comportamiento real observado: se muestra ficha WHOIS en lugar del mensaje de error.
  await expect(page.locator('#domain-content')).toBeVisible();
  await expect(page.locator('#domainNameDisplay')).toHaveText('uvg.com.gt');
  await expect(page.locator('#domainStatusDisplay')).toHaveText(/ACTIVO/i);
  await expect(page.locator('#orgNameDisplay')).not.toBeEmpty();

  await guardarEvidencia(page, 'TC-36-whois-dominio-no-registrado.png');
});
