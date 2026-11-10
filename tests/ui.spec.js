const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('el menú se carga desde menu.json', async ({ page }) => {
  const opciones = page.locator('#lista-menu > li');
  await expect(opciones).toHaveCount(6);
  await expect(page.locator('#lista-menu')).toContainText('Cuentas');
  await expect(page.locator('#lista-menu')).toContainText('Préstamos');
  await page.screenshot({ path: 'capturas/01-menu-cargado.png' });
});

test('el submenú se abre y muestra el contenido de la opción', async ({ page }) => {
  const subopcion = page.locator('#lista-menu a', { hasText: 'Cuenta de ahorro' });
  await expect(subopcion).toBeHidden();

  await page.locator('#lista-menu > li > a', { hasText: 'Cuentas' }).click();
  await expect(subopcion).toBeVisible();
  await page.screenshot({ path: 'capturas/02-submenu-abierto.png' });

  await subopcion.click();
  await expect(page.locator('#contenido h2')).toHaveText('Cuenta de ahorro');
  await expect(page.locator('#contenido p')).toContainText('intereses');
});

test('navegación entre secciones al hacer clic en el menú', async ({ page }) => {
  await page.locator('#lista-menu > li > a', { hasText: 'Servicios en línea' }).click();
  await expect(page.locator('#contenido h2')).toHaveText('Servicios en línea');

  await page.locator('#lista-menu > li > a', { hasText: 'Contacto' }).click();
  await expect(page.locator('#contenido h2')).toHaveText('Contacto');
  await expect(page.locator('#contenido p')).toContainText('809-555-0100');
  await page.screenshot({ path: 'capturas/03-navegacion-contacto.png' });
});

test('la opción externa abre otra página en una pestaña nueva', async ({ page, context }) => {
  await context.route('https://www.sb.gob.do/**', route => {
    route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Superintendencia</h1>' });
  });

  const [nuevaPagina] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('#lista-menu > li > a', { hasText: 'Superintendencia' }).click()
  ]);
  await nuevaPagina.waitForLoadState();
  await expect(nuevaPagina).toHaveURL(/sb\.gob\.do/);
  await nuevaPagina.screenshot({ path: 'capturas/04-pagina-externa.png' });
});

test('el formulario agrega una opción nueva al menú', async ({ page }) => {
  await page.fill('#f-id', 'seguros');
  await page.fill('#f-nombre', 'Seguros');
  await page.fill('#f-enlace', '#seguros');
  await page.fill('#f-texto', 'Seguros de vida y de auto.');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.locator('#mensaje')).toHaveText('Opción agregada.');
  await expect(page.locator('#lista-menu > li')).toHaveCount(7);

  await page.locator('#lista-menu > li > a', { hasText: 'Seguros' }).click();
  await expect(page.locator('#contenido h2')).toHaveText('Seguros');
  await page.screenshot({ path: 'capturas/05-opcion-agregada.png' });
});

test('el formulario valida el ID repetido y el enlace incorrecto', async ({ page }) => {
  await page.fill('#f-id', 'inicio');
  await page.fill('#f-nombre', 'Otra');
  await page.fill('#f-enlace', '#otra');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await expect(page.locator('#mensaje')).toContainText('ya existe');

  await page.fill('#f-id', 'nueva');
  await page.fill('#f-enlace', 'hola');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await expect(page.locator('#mensaje')).toContainText('enlace');
  await expect(page.locator('#lista-menu > li')).toHaveCount(6);
  await page.screenshot({ path: 'capturas/06-validaciones.png' });
});

test('el botón Eliminar quita una opción del menú', async ({ page }) => {
  const fila = page.locator('#admin li', { hasText: /^contacto -/ });
  await fila.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.locator('#lista-menu > li')).toHaveCount(5);
  await expect(page.locator('#lista-menu')).not.toContainText('Contacto');
  await page.screenshot({ path: 'capturas/07-opcion-eliminada.png' });
});
