// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  // Ir a la página localhost:10000.
  await page.goto('http://localhost:10000');

  // Esperamos que el título sea SOS2324-13.
  await expect(page).toHaveTitle(/SOS2324-13/);
});

test('go to wri-api', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets para comprobar
  // que Svelte la está ejecutando.
  await page.goto('http://localhost:10000/wris-datasets');
});

test('load data', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets.
  await page.goto('http://localhost:10000/wris-datasets');

  // Pulsamos el botón 'Cargar datos de prueba'.
  await page.getByRole('button', { name: /Cargar datos de prueba/ }).click();

  await page.waitForTimeout(2000);

  // Esperamos más de un elemento en la lista.
  let dataCounter = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter).toBeGreaterThan(0);
});

test('create a data', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets.
  await page.goto('http://localhost:10000/wris-datasets');

  // Rellenamos algun campo (wri) id="newWri" con un dato.
  await page.locator('#newWri').fill('99.9');

  // Pulsamos el botón 'Crear un nuevo dato'.
  await page.getByRole('button', { name: /Crear un nuevo dato/ }).click();

  // Pulsamos el botón 'Página siguiente'.
  await page.getByRole('button', { name: /Página siguiente/ }).click();

  // Esperamos más de un elemento en la lista.
  let dataCounter = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter).toBeGreaterThan(0);

  // Pulsamos el botón 'Página anterior'.
  await page.getByRole('button', { name: /Página anterior/ }).click();

  // Esperamos más de 9 elementos en la lista (ya que hay más de una pág).
  let dataCounter2 = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter2).toBeGreaterThan(9);
});

test('use filter', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets.
  await page.goto('http://localhost:10000/wris-datasets');

  // Pulsamos el botón 'Filtrar'.
  await page.getByRole('button', { name: /Filtrar/ }).click();

  // Esperamos que el <caption> 'Menú de búsqueda' sea visible.
  await expect(page.getByText('Menú de búsqueda')).toBeVisible();

  // Rellenamos el campo 'Country' del Menú de búsqueda con el valor 'Kiribati'.
  await page.locator('#countryFilter').fill('Kiribati');

  // Rellenamos el campo 'Datos desde el año' del Menú de búsqueda con el valor '2012'.
  await page.locator('#fromFilter').fill('2012');

  // Rellenamos el campo 'Datos hasta el año' del Menú de búsqueda con el valor '2015'.
  await page.locator('#toFilter').fill('2015');

  // Pulsamos el botón 'Buscar'.
  await page.getByRole('button', { name: /Buscar/ }).click();

  // Esperamos más de un elemento en la lista.
  let dataCounter = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter).toBeGreaterThan(0);

  // Pulsamos el botón 'Limpiar Búsqueda'
  await page.getByRole('button', { name: /Limpiar búsqueda/ }).click();

  // Esperamos más de un elementos en la lista.
  let dataCounter2 = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter2).toBeGreaterThan(0);
});

test('delete all data', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets.
  await page.goto('http://localhost:10000/wris-datasets');

  // Pulsamos el botón 'Eliminar todos los datos'.
  await page.getByRole('button', { name: /Eliminar todos los datos/ }).click();

  // Esperamos encontrarnos con 0 objetos.
  let dataCounter = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter).toBe(0);
});