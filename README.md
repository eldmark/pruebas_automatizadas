# Pruebas automatizadas con Playwright

Este proyecto contiene una suite de pruebas end-to-end para validar sitios del dominio `.gt` usando `@playwright/test`.

## Qué hace el proyecto

- Verifica la página principal de `https://gt.nic.gt`.
- Verifica la sección de noticias de `https://dev2.registro.gt`.
- Verifica la sección de estadísticas en `https://dev2.registro.gt/estadisticas/`.
- Genera capturas en la carpeta `evidencias/` cuando los tests llegan al final.

## Estructura

- `playwright.config.js`: configuración de Playwright.
- `tests/pruebas.spec.js`: caso RF-1.1.
- `tests/news.spec.js`: caso RF-1.2.
- `tests/search.spec.js`: casos RF-2.1.
- `tests/estadisticas.spec.js`: casos RF-1.3.
- `tests/internacionalizacion.spec.js`: casos RF-5.1.
- `tests/whois.spec.js`: casos RF-2.2 (consulta WHOIS de dominios registrados).
- `tests/carrito.spec.js`: casos TC-16 a TC-18 del RF-3.1 (carrito anónimo y `localStorage`).
- `tests/example.spec.js`: ejemplo base de Playwright.

## Cómo ejecutarlo en Arch Linux

En Arch Linux, la forma recomendada es usar Docker con la imagen oficial de Playwright:

```bash
docker run --rm \
  -v "$PWD:/work" \
  -w /work \
  --shm-size=1g \
  mcr.microsoft.com/playwright:v1.62.0-noble \
  bash -lc 'npm ci >/dev/null 2>&1 && npx playwright test'
```

### Ejecutar solo un test

```bash
docker run --rm \
  -v "$PWD:/work" \
  -w /work \
  --shm-size=1g \
  mcr.microsoft.com/playwright:v1.62.0-noble \
  bash -lc 'npm ci >/dev/null 2>&1 && npx playwright test tests/estadisticas.spec.js -g "TC-07" --project=chromium'
```

## Resultado esperado

- Playwright abre los navegadores configurados.
- Los tests pasan o fallan según el estado real de los sitios.
- Si el flujo llega al final, se guarda evidencia en `evidencias/`.

## Notas

- Este proyecto está pensado para correr contra sitios externos.
- En Arch Linux no se recomienda ejecutar Playwright nativo sin contenedor, porque las dependencias del sistema no están soportadas de forma oficial por la receta automática de Playwright.
