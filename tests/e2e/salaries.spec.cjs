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
test('go to salaries-api', async ({ page }) => {
    await page.goto('http://localhost:10000/salaries-datasets');
  });

//COMPROBAR INICIAL
  test('Prueba de carga de datos', async ({ page }) => {
      // Ir a la página de la aplicación
      await page.goto('http://localhost:10000/salaries-datasets');
  
      // Esperar a que se cargue el botón para listar los datos
      await page.waitForSelector('button:has-text("Obtener todos los datos")');
  
      // Hacer clic en el botón para listar los datos
      await page.click('button:has-text("Obtener todos los datos")');
  
      // Esperar a que se carguen los datos
      await page.waitForSelector('ul li');
  
      // Obtener la lista de elementos de datos
      const datasetItems = await page.$$('ul li');

      await page.waitForTimeout(2000);
  
      // Verificar que haya al menos cinco elementos en la lista
      expect(datasetItems.length).toBeGreaterThanOrEqual(10);
  });