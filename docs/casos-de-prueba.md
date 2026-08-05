# Casos de prueba

## Índice

| Requisito | Casos | Archivo de pruebas |
| --- | --- | --- |
| RF-1.1 — Mostrar información principal | TC-01, TC-02, TC-03 | `tests/pruebas.spec.js` |
| RF-1.2 — Resumen de noticias | TC-04 | `tests/news.spec.js` |
| RF-1.3 — Estadísticas de dominios | TC-07, TC-08, TC-09 | `tests/estadisticas.spec.js` |
| RF-2.1 — Buscador de disponibilidad | CU-1, CU-2, CU-3 | `tests/search.spec.js` |
| RF-2.2 — WHOIS de dominios registrados | TC-34, TC-35, TC-36, TC-37 | `tests/whois.spec.js` |
| RF-3.1 — Carrito de dominios sin sesión | TC-16, TC-17, TC-18 | `tests/carrito.spec.js` |
| RF-4.1 — Renovación rápida sin sesión | TC-38, TC-39, TC-40 | `tests/tests/renovacion-rapida.spec.js` |
| RF-4.2 — Pago de renovación y notificación | TC-41, TC-42, TC-43 | `tests/pago-renovacion.spec.js` |
| RF-5.1 — Internacionalización (ES/EN) | TC-31, TC-32, TC-33 | `tests/internacionalizacion.spec.js` |

Ejecutar toda la suite:

```bash
npx playwright test --project=chromium
```

---

# RF-1.1 — Mostrar información principal

**Requisito funcional:** El sistema debe mostrar la información principal del servicio.

**Archivo de pruebas:** `tests/pruebas.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/pruebas.spec.js --project=chromium
```

---

## TC-01

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-01 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-1.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/<br>2. Esperar que cargue la página y cerrar el aviso modal "Página de Pruebas".<br>3. Verificar que exista el encabezado principal.<br>4. Verificar que exista el texto descriptivo.<br>5. Verificar que la página no esté vacía. |
| **Resultado esperado** | La información principal del servicio aparece correctamente. |
| **Resultado obtenido** | Se pudo encontrar toda la página principal: el título es "Registro de dominios .gt", el encabezado principal es visible, el cuerpo contiene el texto "Dominios" y existe al menos un enlace visible. |
| **Evidencia** | `evidencias/TC-01-informacion-principal.png` |

![TC-01](../evidencias/TC-01-informacion-principal.png)

**Observaciones:**

- Las pruebas se ejecutan contra el portal de pruebas https://dev2.registro.gt/. Antes se usaba https://gt.nic.gt, pero ese dominio redirige a la plataforma actual (`https://www.gt/sitio/`) y desde algunas redes no permite llegar al ambiente de pruebas.
- El portal muestra un aviso modal "Página de Pruebas" (`#testPageNoticeModal`) que intercepta los clics, por lo que las pruebas lo cierran con el botón "Entendido" antes de interactuar con la página.
- Las pruebas se ejecutan con `ignoreHTTPSErrors: true` por la validación de certificados del ambiente de pruebas.
- El archivo originalmente se llamaba `tests/pruebas.js` y Playwright no lo detectaba, porque el patrón por defecto de descubrimiento es `**/*.@(spec|test).[jt]s`; se renombró a `tests/pruebas.spec.js`.

---

## TC-02

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-02 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-1.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/<br>2. Esperar que cargue la página y cerrar el aviso modal "Página de Pruebas".<br>3. Verificar que exista el menú de navegación principal.<br>4. Verificar que el menú incluya las secciones informativas del servicio (Inicio, Procedimientos, Tarifas, FAQ, Estadísticas) y los enlaces a las políticas de registro y de controversias.<br>5. Verificar que se muestren las líneas telefónicas y el correo de contacto en el pie de página.<br>6. Verificar que exista el carrusel informativo de la portada. |
| **Resultado esperado** | La portada expone la navegación y los datos de contacto del servicio. |
| **Resultado obtenido** | El menú principal se mostró completo con las cinco secciones informativas y los enlaces a ambas políticas; el pie de página muestra las líneas +502.23688302 y +502.23688564 junto al correo admin@cctld.gt, y el carrusel informativo es visible. |
| **Evidencia** | `evidencias/TC-02-navegacion-y-contacto.png` |

![TC-02](../evidencias/TC-02-navegacion-y-contacto.png)

---

## TC-03

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-03 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-1.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y cerrar el aviso modal "Página de Pruebas".<br>2. Verificar que el buscador de dominios esté visible en la portada.<br>3. Escribir "uvg" en el campo de búsqueda.<br>4. Enviar el formulario de búsqueda.<br>5. Verificar que se cargue la página de resultados.<br>6. Verificar que los resultados incluyan los dominios .gt consultados.<br>7. Verificar que el buscador se conserve en la página de resultados. |
| **Resultado esperado** | El servicio principal de consulta de dominios está accesible desde la portada y devuelve resultados. |
| **Resultado obtenido** | El buscador se mostró con el marcador "escribe un nombre de dominio"; al enviar "uvg" el sitio cargó `/results/?q=uvg` con la sección "Disponibles para registro", incluyendo uvg.com.gt y uvg.edu.gt, y conservó el buscador en la página de resultados. |
| **Evidencia** | `evidencias/TC-03-buscador-dominios.png` |

![TC-03](../evidencias/TC-03-buscador-dominios.png)

---

# RF-1.2 — Resumen de las últimas noticias

**Requisito funcional:** La portada debe mostrar un resumen de las últimas tres noticias publicadas en `news.registro.gt`.

**Archivo de pruebas:** `tests/news.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/news.spec.js --project=chromium
```

---

## TC-04

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-04 |
| **Nombre de la prueba** | `TC-04 (RF-1.2) - Resumen de las últimas tres noticias de news.registro.gt` |
| **Requisito relacionado** | RF-1.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión.<br>Deben existir al menos tres noticias publicadas. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt<br>2. Esperar a que se rendericen los bloques `article h3`.<br>3. Verificar que existan al menos tres elementos `article`.<br>4. Para cada una de las tres primeras noticias, verificar que el título, la fecha y el extracto sean visibles y no estén vacíos. |
| **Resultado esperado** | La portada muestra las tres noticias más recientes, cada una con título, fecha y extracto. |
| **Resultado obtenido** | Se encontraron tres o más bloques de noticia; las tres primeras mostraron título, fecha y extracto con contenido no vacío. |
| **Evidencia** | El caso no genera captura automática; la evidencia es el reporte HTML de Playwright (`playwright-report/index.html`). |

---

# RF-1.3 — Estadísticas de dominios

**Requisito funcional:** El sistema debe mostrar estadísticas de dominios `.gt` y permitir filtrarlas por rango de fechas y por subdominio.

**Archivo de pruebas:** `tests/estadisticas.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/estadisticas.spec.js --project=chromium
```

**Observaciones:**

- El archivo incluye un caso exploratorio (`Exploratorio DOM RF-1.3`) marcado con `test.skip`, usado únicamente para confirmar los selectores reales antes de automatizar TC-07 a TC-09.
- La navegación se hace con reintento (`waitUntil: 'commit'` y un segundo intento) porque el ambiente de pruebas responde de forma intermitente.

---

## TC-07

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-07 |
| **Nombre de la prueba** | `TC-07 (RF-1.3) - Verificar que "Estadísticas" carga y muestra datos por defecto` |
| **Requisito relacionado** | RF-1.3 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>La ruta https://dev2.registro.gt/estadisticas/ debe estar disponible. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/estadisticas/<br>2. Verificar el título de la página y el encabezado principal.<br>3. Verificar que se muestre la fecha de última actualización y el bloque "Filtros de reporte".<br>4. Verificar que existan dos campos de fecha, un `select` y el botón "Consultar".<br>5. Verificar las métricas "Total de dominios", "Dominios nuevos" y "Dominios eliminados".<br>6. Verificar que la tabla sea visible y contenga `.com.gt` y la fila "Total general". |
| **Resultado esperado** | La sección se renderiza con los filtros, las métricas y la tabla de datos por defecto. |
| **Resultado obtenido** | La vista cargó con el título "Estadísticas de Dominios .GT", los filtros completos (dos fechas, un selector y el botón "Consultar"), las tres métricas y la tabla con `.com.gt` y la fila de total general. |
| **Evidencia** | `evidencias/TC-07-estadisticas-default.png` |

![TC-07](../evidencias/TC-07-estadisticas-default.png)

---

## TC-08

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-08 |
| **Nombre de la prueba** | `TC-08 (RF-1.3) - Verificar que un rango de fechas válido recalcula las estadísticas` |
| **Requisito relacionado** | RF-1.3 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>La sección "Estadísticas" debe estar accesible con sus controles de fecha. |
| **Pasos realizados** | 1. Abrir la sección de estadísticas y capturar el estado inicial de la tabla.<br>2. Colocar 2026-01-01 como fecha inicial y 2026-06-30 como fecha final.<br>3. Presionar el botón "Consultar".<br>4. Esperar a que la red quede inactiva.<br>5. Verificar que los valores del rango se conserven y que sigan visibles los filtros, las gráficas `#suffixChart` y `#statusChart` y la tabla. |
| **Resultado esperado** | El filtro acepta el rango válido, no rompe la página y mantiene visibles los componentes del reporte. |
| **Resultado obtenido** | El rango se aplicó y se conservó en ambos campos; los filtros, las dos gráficas y la tabla permanecieron visibles tras la consulta. |
| **Evidencia** | `evidencias/TC-08-estadisticas-rango-fechas.png` |

![TC-08](../evidencias/TC-08-estadisticas-rango-fechas.png)

---

## TC-09

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-09 |
| **Nombre de la prueba** | `TC-09 (RF-1.3) - Verificar comportamiento ante rango de fechas inválido o vacío` |
| **Requisito relacionado** | RF-1.3 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>La sección "Estadísticas" debe estar accesible con sus controles de fecha. |
| **Pasos realizados** | 1. Abrir la sección de estadísticas.<br>2. Colocar un rango invertido: fecha inicial 2026-06-30 y fecha final 2026-01-01.<br>3. Presionar el botón "Consultar".<br>4. Verificar que la URL siga siendo `/estadisticas/`, que los valores se conserven y que filtros, gráficas y tabla sigan visibles. |
| **Resultado esperado** | La interfaz sigue operativa, conserva el contexto de filtros y no navega a una pantalla de error. |
| **Resultado obtenido** | La página permaneció en `/estadisticas/` con el rango invertido en los campos y siguió mostrando filtros, gráficas y tabla; **no se mostró ningún mensaje de validación que advierta al usuario que el rango es inválido**. |
| **Evidencia** | `evidencias/TC-09-estadisticas-rango-invalido.png` |

![TC-09](../evidencias/TC-09-estadisticas-rango-invalido.png)

---

# RF-2.1 — Buscador de disponibilidad de dominios

**Requisito funcional:** El sistema debe permitir consultar la disponibilidad de un dominio y clasificar los resultados en disponibles y registrados.

**Archivo de pruebas:** `tests/search.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/search.spec.js --project=chromium
```

**Observaciones:**

- Estos casos se ejecutan contra la plataforma pública `https://www.gt/sitio/`, no contra el ambiente de pruebas `dev2.registro.gt`, porque el flujo `results.php` con las columnas "Disponibles" y "Registrados" solo existe en la plataforma pública.
- Los casos no generan captura automática; la evidencia es el reporte HTML de Playwright.

---

## CU-1

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | CU-1 |
| **Nombre de la prueba** | `CU-1: El buscador de dominios está presente y es funcional` |
| **Requisito relacionado** | RF-2.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://www.gt/sitio/<br>2. Verificar que el campo `input#texto-search` sea visible y tenga el marcador "Escriba un Nombre de Dominio".<br>3. Verificar que el botón `button.boton-search` sea visible, contenga el texto "Buscar" y tenga `type="submit"`. |
| **Resultado esperado** | El buscador está presente en la portada y listo para enviar la consulta. |
| **Resultado obtenido** | El campo y el botón se mostraron con el marcador, el texto y el tipo de envío esperados. |
| **Evidencia** | Reporte HTML de Playwright (`playwright-report/index.html`). |

---

## CU-2

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | CU-2 |
| **Nombre de la prueba** | `CU-2: Búsqueda de un dominio disponible` |
| **Requisito relacionado** | RF-2.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>El nombre consultado no debe existir en el registro (se genera con marca de tiempo: `testqa<timestamp>`). |
| **Pasos realizados** | 1. Abrir https://www.gt/sitio/<br>2. Escribir un nombre aleatorio `testqa<timestamp>` en el buscador.<br>3. Presionar "Buscar".<br>4. Esperar la navegación a `results.php` y el bloque de resultados.<br>5. Verificar que la primera columna sea "Disponibles" y contenga al menos un resultado con el nombre consultado.<br>6. Verificar que se ofrezca la opción "Reservar". |
| **Resultado esperado** | El dominio inexistente aparece en la columna "Disponibles" con la opción de reservarlo. |
| **Resultado obtenido** | La búsqueda navegó a `results.php`, la columna "Disponibles" listó el nombre consultado y mostró la acción "Reservar". |
| **Evidencia** | Reporte HTML de Playwright (`playwright-report/index.html`). |

---

## CU-3

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | CU-3 |
| **Nombre de la prueba** | `CU-3: Búsqueda de un dominio ya registrado` |
| **Requisito relacionado** | RF-2.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>El dominio uvg.edu.gt debe existir como dominio registrado. |
| **Pasos realizados** | 1. Abrir https://www.gt/sitio/<br>2. Escribir "uvg" en el buscador y presionar "Buscar".<br>3. Esperar la navegación a `results.php` y el bloque de resultados.<br>4. Verificar que la segunda columna sea "Registrados" y contenga uvg.edu.gt.<br>5. Verificar que se ofrezca la acción "Consulta / Pago". |
| **Resultado esperado** | El dominio ya registrado aparece en la columna "Registrados" con la opción de consulta o pago. |
| **Resultado obtenido** | La columna "Registrados" incluyó uvg.edu.gt junto a la acción "Consulta / Pago". |
| **Evidencia** | Reporte HTML de Playwright (`playwright-report/index.html`). |

**Observación:** en la plataforma pública uvg.edu.gt se clasifica correctamente como registrado, mientras que en el ambiente de pruebas `dev2.registro.gt` el mismo dominio se clasifica como "Requiere Validación" (ver el defecto documentado en TC-37).

---

# RF-2.2 — WHOIS de dominios registrados

**Requisito funcional:** El sistema debe mostrar la información del WHOIS para dominios que ya se encuentran registrados.

**Archivo de pruebas:** `tests/whois.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/whois.spec.js --project=chromium
```

---

## TC-34

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-34 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-2.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión.<br>El dominio usac.edu.gt debe existir como dominio ya registrado. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/<br>2. Escribir "usac" en el buscador de dominios y enviar el formulario.<br>3. Esperar que cargue la página de resultados.<br>4. Verificar que exista la sección "Dominios Registrados".<br>5. Verificar que usac.edu.gt aparezca marcado como "No disponible".<br>6. Presionar el enlace "Ver detalles..." que apunta al WHOIS del dominio.<br>7. Verificar que la vista WHOIS muestre nombre, estado y fecha de expiración. |
| **Resultado esperado** | El sistema muestra la información WHOIS del dominio ya registrado. |
| **Resultado obtenido** | El sistema mostró usac.edu.gt como no disponible y, al presionar "Ver detalles...", desplegó su ficha WHOIS con estado ACTIVO y fecha de expiración. |
| **Evidencia** | `evidencias/TC-34-whois-desde-resultados.png` |

![TC-34](../evidencias/TC-34-whois-desde-resultados.png)

---

## TC-35

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-35 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-2.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión.<br>El dominio usac.edu.gt debe existir como dominio ya registrado. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/whois?q=usac.edu.gt<br>2. Esperar que cargue la página.<br>3. Verificar el bloque de identificación del dominio: nombre, estado, fecha de expiración y tarifa anual.<br>4. Verificar el bloque de organización titular: nombre, dirección y teléfono.<br>5. Verificar que existan al menos dos servidores de nombres.<br>6. Verificar que existan el contacto administrativo y el contacto técnico.<br>7. Verificar que no se muestre el mensaje de error. |
| **Resultado esperado** | El WHOIS muestra todos los bloques de información del dominio registrado y no muestra el mensaje de error. |
| **Resultado obtenido** | El WHOIS mostró usac.edu.gt como ACTIVO, con expiración 2028-Dec-01, tarifa $20.00 USD, titular Universidad de San Carlos de Guatemala, los servidores dns1 y dns2.usac.edu.gt, y los contactos administrativo y técnico completos. |
| **Evidencia** | `evidencias/TC-35-whois-datos-completos.png` |

![TC-35](../evidencias/TC-35-whois-datos-completos.png)

---

## TC-36

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-36 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-2.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión.<br>El dominio consultado no debe existir en el registro. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/results/?q=uvg<br>2. Verificar que uvg.com.gt aparezca en la sección "Disponibles para registro".<br>3. Abrir el WHOIS de ese mismo dominio: https://dev2.registro.gt/whois?q=uvg.com.gt<br>4. Revisar la información devuelta por el WHOIS. |
| **Resultado esperado** | El WHOIS solo debe mostrar información de dominios ya registrados, por lo que para un dominio disponible debería mostrarse un mensaje de error indicando que el dominio no está registrado. |
| **Resultado obtenido** | **DEFECTO:** el WHOIS devolvió una ficha completa para un dominio disponible, con estado ACTIVO, titular "UVG S.A." y servidores ns1/ns2.uvg.com.gt. Los datos parecen generarse a partir del nombre consultado; al probar con dominioinexistente12345.gt se obtuvo el titular "DOMINIOINEXISTENTE12345 S.A.". |
| **Evidencia** | `evidencias/TC-36-whois-dominio-no-registrado.png` |

![TC-36](../evidencias/TC-36-whois-dominio-no-registrado.png)

---

## TC-37

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-37 |
| **Nombre** | Marco Alejandro Díaz Castañeda |
| **Requisito relacionado** | RF-2.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No es necesario iniciar sesión.<br>El dominio uvg.edu.gt debe existir en el WHOIS como dominio registrado. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/<br>2. Buscar "uvg" desde el buscador de dominios.<br>3. Localizar uvg.edu.gt en los resultados y revisar cómo lo clasifica el buscador.<br>4. Verificar que no se muestre la sección "Dominios Registrados" ni enlaces al WHOIS.<br>5. Consultar el WHOIS del mismo dominio: https://dev2.registro.gt/whois?q=uvg.edu.gt<br>6. Comparar el estado que reporta el buscador contra el que reporta el WHOIS. |
| **Resultado esperado** | Si el WHOIS muestra uvg.edu.gt como dominio registrado, el buscador debería listarlo dentro de "Dominios Registrados" / "No disponible" y no ofrecer el flujo de solicitud. |
| **Resultado obtenido** | **DEFECTO:** el buscador clasificó uvg.edu.gt como "Requiere Validación" y habilitó el botón "Solicitar", sin mostrar la sección "Dominios Registrados". El WHOIS del mismo dominio lo reportó ACTIVO, con titular "UVG S.A." y expiración 2027-Jan-03. Ambos módulos dan estados contradictorios. |
| **Evidencia** | `evidencias/TC-37-buscador-uvg-requiere-validacion.png`<br>`evidencias/TC-37-whois-uvg-edu-gt-activo.png` |

![TC-37 buscador](../evidencias/TC-37-buscador-uvg-requiere-validacion.png)

![TC-37 WHOIS](../evidencias/TC-37-whois-uvg-edu-gt-activo.png)

---

# RF-3.1 — Carrito de dominios sin iniciar sesión

**Requisito funcional:** El usuario debe poder agregar dominios disponibles a un carrito sin autenticarse, y el carrito debe conservarse durante la sesión.

**Archivo de pruebas:** `tests/carrito.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/carrito.spec.js --project=chromium
```

**Observaciones:**

- Los casos se ejecutan contra `https://gt.nic.gt`.
- Antes de cada caso se limpia `localStorage` (`domain-cart`, `current_user`) y se marca `test_page_modal_dismissed = "true"` para evitar el aviso modal. La limpieza se hace una sola vez y no con `addInitScript`, porque este último volvería a ejecutarse tras cada redirección y borraría el carrito recién creado.
- Los nombres de dominio se generan con marca de tiempo para garantizar que estén disponibles.

---

## TC-16

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-16 |
| **Nombre de la prueba** | `TC-16 (RF-3.1) - Agregar un dominio al carrito sin iniciar sesión` |
| **Requisito relacionado** | RF-3.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>Sesión cerrada y `localStorage` limpio. |
| **Pasos realizados** | 1. Abrir el sitio y limpiar `domain-cart` y `current_user` en `localStorage`.<br>2. Abrir `/results/?q=rf31agregar<timestamp>`.<br>3. Presionar el primer botón "Reservar" de los dominios disponibles.<br>4. Esperar la navegación a `/cart`.<br>5. Verificar que exista un elemento en el carrito y que `domain-cart` contenga el dominio `<consulta>.com.gt`.<br>6. Verificar el mensaje "Inicia sesión para continuar". |
| **Resultado esperado** | El dominio disponible se agrega al carrito sin requerir autenticación y queda almacenado en `localStorage`. |
| **Resultado obtenido** | El dominio se agregó al carrito sin sesión, `domain-cart` almacenó un único elemento con el nombre esperado y el sitio mostró "Inicia sesión para continuar" para avanzar. |
| **Evidencia** | `evidencias/TC-16-agregar-carrito-sin-sesion.png` |

![TC-16](../evidencias/TC-16-agregar-carrito-sin-sesion.png)

---

## TC-17

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-17 |
| **Nombre de la prueba** | `TC-17 (RF-3.1) - Conservar el carrito tras recargar la página` |
| **Requisito relacionado** | RF-3.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>Sesión cerrada y `localStorage` limpio. |
| **Pasos realizados** | 1. Preparar la sesión anónima.<br>2. Agregar el dominio `rf31persistir<timestamp>.com.gt` al carrito.<br>3. Recargar la página del carrito.<br>4. Verificar que siga existiendo un elemento con el mismo dominio.<br>5. Verificar que `domain-cart` conserve un elemento. |
| **Resultado esperado** | El dominio agregado permanece visible y almacenado después de recargar. |
| **Resultado obtenido** | Tras la recarga el carrito conservó el dominio agregado, tanto en la interfaz como en `localStorage`. |
| **Evidencia** | `evidencias/TC-17-carrito-persiste-recarga.png` |

![TC-17](../evidencias/TC-17-carrito-persiste-recarga.png)

---

## TC-18

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-18 |
| **Nombre de la prueba** | `TC-18 (RF-3.1) - Conservar varios dominios en el carrito anónimo` |
| **Requisito relacionado** | RF-3.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>Sesión cerrada y `localStorage` limpio. |
| **Pasos realizados** | 1. Preparar la sesión anónima.<br>2. Agregar el dominio `rf31uno<timestamp>.com.gt` al carrito.<br>3. Agregar el dominio `rf31dos<timestamp>.com.gt` al carrito.<br>4. Verificar que el carrito muestre dos elementos con ambos nombres en orden.<br>5. Verificar que `domain-cart` contenga los dos dominios. |
| **Resultado esperado** | Dos dominios distintos coexisten en el carrito anónimo y ambos quedan serializados en `domain-cart`. |
| **Resultado obtenido** | El carrito mostró los dos dominios en el orden en que se agregaron y `domain-cart` los serializó completos. |
| **Evidencia** | `evidencias/TC-18-varios-dominios-carrito.png` |

![TC-18](../evidencias/TC-18-varios-dominios-carrito.png)

---

# RF-4.1 — Renovación rápida sin sesión

**Requisito funcional:** El sistema debería permitir renovar un dominio de forma rápida sin iniciar sesión.

**Archivo de pruebas:** `tests/tests/renovacion-rapida.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/tests/renovacion-rapida.spec.js --project=chromium
```

**Resultado global del requisito:** **NO IMPLEMENTADO.** El portal de pruebas no expone ningún flujo de renovación; los casos siguientes documentan esa ausencia.

---

## TC-38

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-38 |
| **Nombre de la prueba** | `TC-38 (RF-4.1): No existe ningún enlace/botón de "renovación" en el sitio` |
| **Requisito relacionado** | RF-4.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/<br>2. Cerrar el aviso modal "Página de Pruebas" con el botón "Entendido".<br>3. Buscar en la página cualquier texto que coincida con `renovación` o `renovar`. |
| **Resultado esperado** | Si el requisito estuviera implementado, debería existir al menos un enlace o botón de renovación. |
| **Resultado obtenido** | **DEFECTO / NO IMPLEMENTADO:** no se encontró ninguna coincidencia de "renovación" ni "renovar" en la portada. |
| **Evidencia** | `evidencias/rf4.1-tc01-sin-renovacion.png` |

![TC-38](../evidencias/rf4.1-tc01-sin-renovacion.png)

---

## TC-39

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-39 |
| **Nombre de la prueba** | `TC-39 (RF-4.1): Buscar un dominio ya registrado solo da opción de "Reservar", no "Renovar"` |
| **Requisito relacionado** | RF-4.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y cerrar el aviso modal.<br>2. Escribir "gt" en `#heroSearchInput` y presionar Enter.<br>3. Esperar los resultados.<br>4. Verificar qué acción se ofrece sobre el primer resultado. |
| **Resultado esperado** | Para un dominio ya registrado debería ofrecerse la acción de renovar. |
| **Resultado obtenido** | **DEFECTO / NO IMPLEMENTADO:** la única acción visible fue "Reservar", que lleva al flujo de compra; nunca se ofreció "Renovar". |
| **Evidencia** | `evidencias/rf4.1-tc02-solo-reservar.png` |

![TC-39](../evidencias/rf4.1-tc02-solo-reservar.png)

---

## TC-40

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-40 |
| **Nombre de la prueba** | `TC-40 (RF-4.1): Comportamiento es idéntico para dominio existente y ficticio (ambos van a flujo de compra)` |
| **Requisito relacionado** | RF-4.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y cerrar el aviso modal.<br>2. Buscar el nombre ficticio "estenoexistegt123456".<br>3. Comparar los resultados contra los obtenidos en TC-39 con un dominio existente. |
| **Resultado esperado** | El sitio debería diferenciar un dominio ya registrado (renovación) de uno disponible (registro). |
| **Resultado obtenido** | **DEFECTO / NO IMPLEMENTADO:** el comportamiento fue idéntico en ambos casos; los dos llevan al flujo de compra, sin distinguir la renovación. |
| **Evidencia** | `evidencias/rf4.1-tc03-dominio-ficticio.png` |

![TC-40](../evidencias/rf4.1-tc03-dominio-ficticio.png)

---

# RF-4.2 — Pago de renovación y notificación a contactos

**Requisito funcional:** El sistema debería permitir pagar la renovación de un dominio y notificar del pago a los contactos administrativo, técnico y de cobro.

**Archivo de pruebas:** `tests/pago-renovacion.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/pago-renovacion.spec.js --project=chromium
```

**Resultado global del requisito:** **BLOQUEADO por la dependencia de RF-4.1.** Sin flujo de renovación no existe un pago de renovación que probar.

---

## TC-41

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-41 |
| **Nombre de la prueba** | `TC-41 (RF-4.2): No existe flujo de pago de renovación accesible sin sesión` |
| **Requisito relacionado** | RF-4.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y cerrar el aviso modal.<br>2. Buscar cualquier texto que coincida con `pagar renovación` o `renovar y pagar`. |
| **Resultado esperado** | Debería existir un punto de entrada al pago de renovación. |
| **Resultado obtenido** | **DEFECTO / NO IMPLEMENTADO:** no se encontró ningún elemento asociado al pago de renovación. |
| **Evidencia** | `evidencias/rf4.2-tc01-sin-flujo-pago-renovacion.png` |

![TC-41](../evidencias/rf4.2-tc01-sin-flujo-pago-renovacion.png)

---

## TC-42

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-42 |
| **Nombre de la prueba** | `TC-42 (RF-4.2): El único camino de pago es vía carrito de compra, que exige login` |
| **Requisito relacionado** | RF-4.2 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>No iniciar sesión. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y cerrar el aviso modal.<br>2. Buscar "gt" desde `#heroSearchInput`.<br>3. Presionar el primer botón "Reservar".<br>4. Documentar a dónde lleva el flujo. |
| **Resultado esperado** | Documentar el único camino de pago disponible en el portal. |
| **Resultado obtenido** | El único camino de pago existente es el carrito de compra de registro, que exige iniciar sesión antes de continuar; no corresponde a un pago de renovación. |
| **Evidencia** | `evidencias/rf4.2-tc02-flujo-compra-requiere-login.png` |

![TC-42](../evidencias/rf4.2-tc02-flujo-compra-requiere-login.png)

---

## TC-43

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-43 |
| **Nombre de la prueba** | `TC-43 (RF-4.2): No es posible verificar notificación a contactos sin completar una renovación real` |
| **Requisito relacionado** | RF-4.2 |
| **Herramienta / método** | Análisis documentado; el test queda como marcador en el reporte de Playwright |
| **Precondiciones** | Requeriría que exista el flujo de renovación (RF-4.1), completar un pago real y tener acceso a los buzones de los contactos administrativo, técnico y de cobro. |
| **Pasos realizados** | No ejecutables: ninguna de las tres precondiciones se cumple. |
| **Resultado esperado** | Al completar el pago de renovación, los contactos administrativo, técnico y de cobro reciben la notificación. |
| **Resultado obtenido** | **NO EJECUTABLE / MANUAL BLOQUEADO.** El caso se documenta como hallazgo: no existe el flujo de renovación y el equipo no tiene acceso a las cuentas de correo de los contactos. El test contiene solo un `expect(true).toBe(true)` para dejar constancia en el reporte. |
| **Evidencia** | Reporte HTML de Playwright (`playwright-report/index.html`). |

---

# RF-5.1 — Internacionalización (español / inglés)

**Requisito funcional:** El portal debe permitir alternar la interfaz entre español e inglés sin romper la navegación ni el contenido.

**Archivo de pruebas:** `tests/internacionalizacion.spec.js`

**Comando de ejecución:**

```bash
npx playwright test tests/internacionalizacion.spec.js --project=chromium
```

---

## TC-31

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-31 |
| **Nombre de la prueba** | `TC-31 (RF-5.1) - Verificar alternancia de idioma de español a inglés` |
| **Requisito relacionado** | RF-5.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>El portal debe cargar inicialmente en español. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ y verificar `html[lang="es"]`.<br>2. Ubicar el enlace de idioma "EN".<br>3. Hacer clic y esperar la navegación a `/en`.<br>4. Verificar `html[lang="en"]`, el título `.gt Domain Registration`, el texto "Register your .gt domain today.", el enlace "ES" y el enlace "Home". |
| **Resultado esperado** | La interfaz cambia a inglés sin romper la navegación ni el contenido principal. |
| **Resultado obtenido** | El sitio navegó a `/en`, cambió el atributo `lang` a `en` y mostró título, contenido y menú en inglés, con el enlace de retorno "ES" disponible. |
| **Evidencia** | `evidencias/TC-31-cambio-idioma-espanol-a-ingles.png` |

![TC-31](../evidencias/TC-31-cambio-idioma-espanol-a-ingles.png)

---

## TC-32

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-32 |
| **Nombre de la prueba** | `TC-32 (RF-5.1) - Verificar alternancia de idioma de inglés a español` |
| **Requisito relacionado** | RF-5.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>El portal debe cargar inicialmente en inglés (`/en`). |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/en y verificar `html[lang="en"]`.<br>2. Ubicar el enlace de idioma "ES".<br>3. Hacer clic y esperar la navegación a la raíz.<br>4. Verificar `html[lang="es"]`, el título "Registro de dominios .gt", el texto "Registra tu dominio .gt hoy mismo.", el enlace "EN" y el enlace "Inicio". |
| **Resultado esperado** | La interfaz regresa a español sin romper la navegación ni el contenido principal. |
| **Resultado obtenido** | El sitio volvió a la raíz en español, con `lang="es"`, título y contenido traducidos y el enlace "EN" disponible. |
| **Evidencia** | `evidencias/TC-32-cambio-idioma-ingles-a-espanol.png` |

![TC-32](../evidencias/TC-32-cambio-idioma-ingles-a-espanol.png)

---

## TC-33

| Campo | Detalle |
| --- | --- |
| **ID de prueba** | TC-33 |
| **Nombre de la prueba** | `TC-33 (RF-5.1) - Verificar alternancia consecutiva de idioma en la misma sesión` |
| **Requisito relacionado** | RF-5.1 |
| **Herramienta / método** | Navegar por medio de browser integrado con Playwright |
| **Precondiciones** | Tener conexión a Internet.<br>Ambas versiones de idioma deben estar disponibles.<br>El portal debe cargar inicialmente en español. |
| **Pasos realizados** | 1. Abrir https://dev2.registro.gt/ en español.<br>2. Cambiar a inglés con el enlace "EN" y verificar URL, `lang` y contenido.<br>3. Volver a español con el enlace "ES" en la misma sesión.<br>4. Verificar de nuevo URL, `lang` y contenido. |
| **Resultado esperado** | El usuario puede alternar de idioma más de una vez y la página conserva su funcionamiento normal. |
| **Resultado obtenido** | Las dos alternancias consecutivas funcionaron correctamente; en cada paso la URL, el atributo `lang` y los textos correspondieron al idioma seleccionado. |
| **Evidencia** | `evidencias/TC-33-alternancia-consecutiva-idioma.png` |

![TC-33](../evidencias/TC-33-alternancia-consecutiva-idioma.png)
