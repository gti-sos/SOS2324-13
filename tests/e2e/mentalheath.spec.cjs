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

//COMPROBAR INICIAL
  test('Prueba de carga de datos', async ({ page }) => {
      // Ir a la página de la aplicación
      await page.goto('http://localhost:10000/mentalhealth-datasets');
  
      // Esperar a que se cargue el botón para listar los datos
      await page.waitForSelector('button:has-text("Listar datos")');
  
      // Hacer clic en el botón para listar los datos
      await page.click('button:has-text("Listar datos")');
  
      // Esperar a que se carguen los datos
      await page.waitForSelector('ul li');
  
      // Obtener la lista de elementos de datos
      const datasetItems = await page.$$('ul li');
  
      // Verificar que haya al menos cinco elementos en la lista
      expect(datasetItems.length).toBeGreaterThanOrEqual(5);
  });
  //COMPROBAR CREAR DATOS
  test('Prueba de creación de nuevo dato', async ({ page }) => {
      // Ir a la página de la aplicación
      await page.goto('http://localhost:10000/mentalhealth-datasets');
  
      // Esperar a que se cargue el botón para crear un nuevo dato
      await page.waitForSelector('button:has-text("Crear un nuevo dato")');
  
      // Hacer clic en el botón para crear un nuevo dato
      await page.click('button:has-text("Crear un nuevo dato")');
  
      // Esperar a que se carguen los campos de entrada
      await page.waitForSelector('input');
  
      // Rellenar los campos de entrada con datos de prueba
      await page.fill('input[placeholder="País"]', 'Nuevo País');
      await page.fill('input[placeholder="Código"]', 'Nuevo Código');
      await page.fill('input[placeholder="Esquizofrenia"]', '0.5');
      await page.fill('input[placeholder="Trastorno bipolar"]', '0.3');
      await page.fill('input[placeholder="Trastorno alimentario"]', '0.2');
      await page.fill('input[placeholder="Trastorno de ansiedad"]', '0.4');
      await page.fill('input[placeholder="Trastorno por consumo de drogas"]', '0.1');
      await page.fill('input[placeholder="Depresión"]', '0.6');
      await page.fill('input[placeholder="Alcoholismo"]', '0.7');
      await page.fill('input[placeholder="Año"]', '2024');
  
      // Hacer clic en el botón para enviar el nuevo dato
      await page.click('button:has-text("Crear un nuevo dato")');
  
      // Esperar a que se cargue la confirmación de nuevo dato creado
      await page.waitForSelector('.confirmation');
  
      // Verificar que se haya mostrado el mensaje de confirmación
      const confirmationMessage = await page.textContent('.confirmation');
      expect(confirmationMessage).toContain('Nuevo dato creado');
  });
  //COMPROBAR ELIMINAR DATOS
  test('Prueba de eliminación de todos los datos', async ({ page }) => {
      // Ir a la página de la aplicación
      await page.goto('http://localhost:10000/mentalhealth-datasets');
  
      // Esperar a que se cargue el botón para eliminar todos los datos
      await page.waitForSelector('button:has-text("Eliminar todos los datos")');
  
      // Hacer clic en el botón para eliminar todos los datos
      await page.click('button:has-text("Eliminar todos los datos")');
  
      // Esperar a que se cargue la confirmación de eliminación de todos los datos
      await page.waitForSelector('.confirmation');
  
      // Verificar que se haya mostrado el mensaje de confirmación
      const confirmationMessage = await page.textContent('.confirmation');
      expect(confirmationMessage).toContain('Todos los datos eliminados');
  });

  //COMPROBAR FILTRO
  test('Prueba de filtro de búsqueda con datos existentes', async ({ page }) => {
    // Ir a la página de la aplicación
    await page.goto('http://localhost:10000/mentalhealth-datasets');

    // Esperar a que se cargue el botón para mostrar la tabla de búsqueda
    await page.waitForSelector('button:has-text("Mostrar tabla de búsqueda")');

    // Hacer clic en el botón para mostrar la tabla de búsqueda
    await page.click('button:has-text("Mostrar tabla de búsqueda")');

    // Esperar a que se carguen los campos de filtro
    await page.waitForSelector('input[id="countryFilter"]');
    await page.waitForSelector('input[id="yearFilter"]');

    // Rellenar los campos de filtro con valores específicos
    await page.fill('input[id="countryFilter"]', 'Afghanistan');
    await page.fill('input[id="yearFilter"]', '1997'); // Asegúrate de usar un año que exista en tus datos

    // Hacer clic en el botón para buscar
    await page.click('button:has-text("Buscar")');

    // Esperar a que se carguen los resultados de la búsqueda
    await page.waitForSelector('ul li');

    // Obtener la lista de elementos de resultados de la búsqueda
    const searchResults = await page.$$('ul li');

    // Verificar que los resultados de la búsqueda sean los esperados
    expect(searchResults.length).toBeGreaterThan(0); // Asegurarse de que haya al menos un resultado

    // Verificar que los resultados de la búsqueda coincidan con los criterios de filtro
    for (const result of searchResults) {
        const textContent = await result.textContent();
        expect(textContent).toContain('Afghanistan'); // Verificar que el país coincida
        expect(textContent).toContain('1997'); // Verificar que el año coincida
    }
});
//COMPROBAR UPDATE
test('Prueba de actualización de datos', async ({ page }) => {
    // Ir a la página de la aplicación
    await page.goto('http://localhost:10000/mentalhealth-datasets');

    // Esperar a que se carguen los datos del país y año específicos
    await page.waitForSelector('input[id="country"]');
    await page.waitForSelector('input[id="year"]');

    // Rellenar los campos de entrada con datos de prueba
    await page.fill('input[id="country"]', 'Afghanistan');
    await page.fill('input[id="year"]', '1997'); // Asegúrate de usar un año que exista en tus datos

    // Esperar a que se carguen los datos en los campos de entrada
    await page.waitForTimeout(1000); // Pausa para asegurarse de que los datos se hayan cargado correctamente

    // Modificar los datos cargados
    await page.fill('input[id="schizophrenia"]', '0.5'); // Modifica el valor de esquizofrenia

    // Hacer clic en el botón para actualizar los datos
    await page.click('button:has-text("Actualizar dato")');

    // Esperar a que se muestre el mensaje de confirmación o de error
    await page.waitForSelector('.message');

    // Verificar si se muestra el mensaje de confirmación
    const confirmationMessage = await page.textContent('.message.confirmation');
    expect(confirmationMessage).toContain('Datos actualizados correctamente');

    // Verificar que no se muestre ningún mensaje de error
    const errorMessage = await page.textContent('.message.error');
    expect(errorMessage).toBeNull(); // Asegurarse de que no haya mensaje de error
});

