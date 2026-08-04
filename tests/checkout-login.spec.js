const { test, expect } = require('@playwright/test');
const path = require('path');

test.use({ ignoreHTTPSErrors: true });

// TODO: confirmar la URL real donde se busca/agrega un dominio al carrito
const BASE_URL = 'https://dev2.registro.gt/';

async function abrirInicio(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
}

async function guardarEvidencia(page, nombreArchivo) {
  await page.screenshot({
    path: path.join('evidencias', nombreArchivo),
    fullPage: true,
  });
}

test.skip('Exploratorio DOM RF-3.2 - inspección manual previa de "Carrito / Finalizar compra"', async ({ page }) => {
  // Precondiciones:
  // - El portal responde y el buscador de dominios está accesible.
  // Pasos:
  // 1. Buscar un dominio disponible (ej. uno aleatorio con timestamp para evitar
  //    colisiones con dominios ya registrados).
  // 2. Agregarlo al carrito.
  // 3. Ir al carrito y localizar el botón "Finalizar compra" / "Pagar" / "Checkout".
  // 4. Hacer clic y observar a dónde redirige cuando NO hay sesión iniciada:
  //    - ¿Redirige a /cpanel/login?
  //    - ¿Muestra un modal pidiendo iniciar sesión?
  //    - ¿Google login se abre en la misma pestaña o en un popup?
  // Resultado esperado:
  // - Quedan confirmados los selectores reales y el mecanismo de bloqueo para
  //   automatizar TC-22.
  await abrirInicio(page);
  await guardarEvidencia(page, 'Exploratorio-carrito-checkout-dom.png');
});

test('TC-22 (RF-3.2) - Ver el carrito sin sesión iniciada exige inicio de sesión', async ({ page }) => {
  // Precondiciones:
  // - No hay sesión iniciada (contexto de navegador limpio, sin cookies previas).
  // Pasos:
  // 1. Abrir el sitio y buscar un dominio disponible (nombre único con timestamp
  //    para evitar colisiones con dominios ya registrados).
  // 2. Reservarlo (agregarlo al carrito) sin haber iniciado sesión (según RF-3.1).
  // 3. Ir al carrito.
  // Resultado esperado:
  // - El carrito muestra el dominio agregado, pero en vez de un total/botón de pago,
  //   presenta el panel "Inicia sesión para continuar" con el botón "Iniciar Sesión"
  //   (y la alternativa "Crear una cuenta"). El sistema no deja avanzar al pago
  //   sin autenticarse.
  await abrirInicio(page);

  const dominioPrueba = `prueba-rf32-${Date.now()}`;
  await page.getByPlaceholder(/escribe un nombre de dominio/i).fill(dominioPrueba);
  await page.getByRole('button', { name: /buscar/i }).click();

  await expect(page.getByText(/disponibles para registro/i)).toBeVisible();
  // El primer resultado (.com.gt) es el que se reserva; ajustar si el orden cambia.
  await page.getByRole('button', { name: /reservar/i }).first().click();

  await page.goto(`${BASE_URL}cart/`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByText(dominioPrueba, { exact: false })).toBeVisible();
  await expect(page.getByText(/inicia sesión para continuar/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();

  await guardarEvidencia(page, 'TC-22-checkout-requiere-login.png');
});