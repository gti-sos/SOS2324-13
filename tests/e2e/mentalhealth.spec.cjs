// @ts-check
const { test, expect } = require('@playwright/test');

//COMPROBAR SI TIENE TITULO
test('has title', async ({ page }) => {
  // Ir a la página localhost:10000.
  await page.goto('http://localhost:10000');

  // Esperamos que el título sea SOS2324-13.
  await expect(page).toHaveTitle(/SOS2324-13/);
});

//COMPROBAR SI VA A MI API
test('go to mentalhealth-api', async ({ page }) => {
  await page.goto('http://localhost:10000/mentalhealth-datasets');
});

//COMPROBAR SI HA CARGADO LOS DATOS
test('load data', async ({ page }) => {
  // Ir a la página localhost:10000/mentalhealth-datasets.
  await page.goto('http://localhost:10000/mentalhealth-datasets');

  // Pulsamos el botón 'Cargar datos de prueba'.
  await page.getByRole('button', { name: /Cargar datos iniciales/ }).click();

  await page.waitForTimeout(2000);

  // Esperamos más de un elemento en la lista.
  let dataCounter = (await page.locator('.listaElementos').all()).length;

  expect(dataCounter).toBeGreaterThan(0);
});