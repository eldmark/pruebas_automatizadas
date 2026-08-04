import { test, expect } from "@playwright/test";
import path from "path";

// La landing usa un certificado cuyo nombre no coincide con el dominio.
test.use({ ignoreHTTPSErrors: true });

const BASE_URL = "https://gt.nic.gt";

async function prepararSesionAnonima(page) {
  // Se limpia una única vez. addInitScript no se usa aquí porque también se
  // ejecutaría después de cada redirección y borraría el carrito recién creado.
  await page.goto(BASE_URL);
  await page.evaluate(() => {
    localStorage.removeItem("domain-cart");
    localStorage.removeItem("current_user");
    localStorage.setItem("test_page_modal_dismissed", "true");
  });
}

async function agregarPrimerDominioDisponible(page, consulta, cantidadEsperada = 1) {
  await page.goto(`${BASE_URL}/results/?q=${consulta}`);
  await expect(page.locator("#availableDomainsContainer .reserve-btn").first()).toBeVisible();
  await page.locator("#availableDomainsContainer .reserve-btn").first().click();
  await page.waitForURL(/\/cart\/?$/);
  await expect(page.locator(".cart-item")).toHaveCount(cantidadEsperada);
}

test("TC-16 (RF-3.1) - Agregar un dominio al carrito sin iniciar sesión", async ({ page }) => {
  // Precondiciones: conexión a Internet y sesión cerrada.
  // Resultado esperado: un dominio disponible se agrega al carrito y queda en
  // localStorage bajo la clave domain-cart, sin requerir autenticación.
  await prepararSesionAnonima(page);
  const consulta = `rf31agregar${Date.now()}`;

  await agregarPrimerDominioDisponible(page, consulta);

  const carrito = await page.evaluate(() => JSON.parse(localStorage.getItem("domain-cart") || "[]"));
  expect(carrito).toHaveLength(1);
  expect(carrito[0].domain).toBe(`${consulta}.com.gt`);
  await expect(page.getByText("Inicia sesión para continuar")).toBeVisible();

  await page.screenshot({
    path: path.join("evidencias", "TC-16-agregar-carrito-sin-sesion.png"),
    fullPage: true,
  });
});

test("TC-17 (RF-3.1) - Conservar el carrito tras recargar la página", async ({ page }) => {
  // Precondiciones: conexión a Internet y sesión cerrada.
  // Resultado esperado: el dominio agregado permanece visible y almacenado
  // después de recargar la página del carrito.
  await prepararSesionAnonima(page);
  const consulta = `rf31persistir${Date.now()}`;

  await agregarPrimerDominioDisponible(page, consulta);
  await page.reload();

  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.locator(".item-domain")).toHaveText(`${consulta}.com.gt`);
  const carrito = await page.evaluate(() => JSON.parse(localStorage.getItem("domain-cart") || "[]"));
  expect(carrito).toHaveLength(1);

  await page.screenshot({
    path: path.join("evidencias", "TC-17-carrito-persiste-recarga.png"),
    fullPage: true,
  });
});

test("TC-18 (RF-3.1) - Conservar varios dominios en el carrito anónimo", async ({ page }) => {
  // Precondiciones: conexión a Internet y sesión cerrada.
  // Resultado esperado: dos dominios distintos pueden coexistir en el carrito
  // anónimo y ambos quedan serializados en domain-cart.
  await prepararSesionAnonima(page);
  const prefijo = Date.now();
  const primeraConsulta = `rf31uno${prefijo}`;
  const segundaConsulta = `rf31dos${prefijo}`;

  await agregarPrimerDominioDisponible(page, primeraConsulta);
  await agregarPrimerDominioDisponible(page, segundaConsulta, 2);

  await expect(page.locator(".cart-item")).toHaveCount(2);
  await expect(page.locator(".item-domain")).toHaveText([
    `${primeraConsulta}.com.gt`,
    `${segundaConsulta}.com.gt`,
  ]);
  const carrito = await page.evaluate(() => JSON.parse(localStorage.getItem("domain-cart") || "[]"));
  expect(carrito.map((item) => item.domain)).toEqual([
    `${primeraConsulta}.com.gt`,
    `${segundaConsulta}.com.gt`,
  ]);

  await page.screenshot({
    path: path.join("evidencias", "TC-18-varios-dominios-carrito.png"),
    fullPage: true,
  });
});
