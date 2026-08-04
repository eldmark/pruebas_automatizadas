import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ ignoreHTTPSErrors: true });

const BASE_URL = 'https://dev2.registro.gt/idn/';

async function abrirHerramientaIDN(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
}

async function guardarEvidencia(page, nombreArchivo) {
  await page.screenshot({
    path: path.join('evidencias', nombreArchivo),
    fullPage: true,
  });
}

test('TC-16 (RF-2.3) - Traducir un nombre con caracteres especiales a Punycode', async ({ page }) => {
  // Precondiciones:
  // - La herramienta IDN (https://dev2.registro.gt/idn/) está accesible sin necesidad de sesión.
  // Pasos:
  // 1. Abrir la herramienta IDN.
  // 2. Borrar el ejemplo precargado y escribir "café.gt" en el campo "Nombre de dominio (español)".
  // 3. Hacer clic en el botón "Convertir".
  // Resultado esperado:
  // - El campo Punycode muestra "xn--caf-dma.gt".
  //
  // Nota: el widget NO convierte en tiempo real (al escribir o perder el foco);
  // el resultado solo se actualiza al presionar "Convertir" (confirmado por TC-18,
  // que usa ese mismo botón). La versión anterior de este test asumía conversión
  // en vivo y por eso #idnOutput se quedaba con el valor de ejemplo precargado
  // ("xn--piacolada-m6a.com.gt") sin importar qué se escribiera.
  await abrirHerramientaIDN(page);

  const inputDominio = page.locator('#idnInput');
  const campoPunycode = page.locator('#idnOutput');

  await inputDominio.fill('café.gt');
  await page.getByRole('button', { name: /convertir/i }).click();

  await expect(campoPunycode).toHaveValue('xn--caf-dma.gt', { timeout: 5000 });

  await guardarEvidencia(page, 'TC-16-idn-conversion.png');
});

test('TC-17 (RF-2.3) - El botón "Limpiar campos" borra ambos campos', async ({ page }) => {
  // Precondiciones:
  // - La herramienta IDN está accesible sin necesidad de sesión.
  // - Existe al menos una conversión previa cargada en los campos.
  // Pasos:
  // 1. Abrir la herramienta IDN.
  // 2. Escribir "niño.gt" en el campo de nombre de dominio y hacer clic en "Convertir".
  // 3. Hacer clic en "Limpiar campos".
  // Resultado esperado:
  // - Ambos campos (nombre de dominio y Punycode) quedan vacíos.
  await abrirHerramientaIDN(page);

  const inputDominio = page.locator('#idnInput');
  const campoPunycode = page.locator('#idnOutput');

  await inputDominio.fill('niño.gt');
  await page.getByRole('button', { name: /convertir/i }).click();
  await expect(campoPunycode).toHaveValue('xn--nio-8ma.gt', { timeout: 5000 });

  await page.getByRole('button', { name: /limpiar campos/i }).click();

  await expect(inputDominio).toHaveValue('');
  await expect(campoPunycode).toHaveValue('');

  await guardarEvidencia(page, 'TC-17-idn-limpiar-campos.png');
});

test('TC-18 (RF-2.3) - Convertir con el campo de dominio vacío muestra un mensaje de validación', async ({ page }) => {
  // Precondiciones:
  // - La herramienta IDN está accesible sin necesidad de sesión.
  // Pasos:
  // 1. Abrir la herramienta IDN.
  // 2. Borrar el ejemplo precargado, dejando el campo de nombre de dominio realmente vacío.
  // 3. Hacer clic en "Convertir".
  // Resultado esperado:
  // - El sistema muestra el mensaje "El dominio no puede estar vacío." sin romper la
  //   página ni navegar a una pantalla de error.
  await abrirHerramientaIDN(page);

  const inputDominio = page.locator('#idnInput');
  await inputDominio.fill('');

  await page.getByRole('button', { name: /convertir/i }).click();

  const mensajeError = page.locator('#idnError');
  await expect(mensajeError).toBeVisible();
  await expect(mensajeError).toContainText('El dominio no puede estar vacío.');
  await expect(page).not.toHaveURL(/error|404|500/);

  await guardarEvidencia(page, 'TC-18-idn-campo-vacio.png');
});