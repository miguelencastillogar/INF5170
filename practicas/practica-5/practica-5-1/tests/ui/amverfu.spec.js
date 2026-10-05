// Importamos las funciones test y expect de Playwright.
import { test, expect } from '@playwright/test';

// =================================
// UI-01 - CARGA INICIAL DE AMVERFU|
// =================================

test('UI-01 - AMVERFU carga correctamente', async ({ page }) => {

    // Abrimos nuestra aplicación.
    //
    // El "/" representa la dirección definida como baseURL
    // en playwright.config.js:
    //
    // http://localhost:3000
    //
    // Como nuestro archivo HTML tiene un nombre específico,
    // indicamos la ruta completa del archivo.
    await page.goto('/practica-5.html');

    // Verificamos que el título de la página sea el esperado.
    //
    // toHaveTitle() comprueba el contenido de la etiqueta:
    //
    // <title>...</title>
    //
    await expect(page).toHaveTitle(
        'AMVERFU - Explorador Pokémon'
    );

    // Verificamos que el encabezado principal AMVERFU
    // sea visible en la página.
    //
    // getByRole() busca un elemento utilizando su rol
    // accesible.
    //
    // En este caso buscamos un encabezado <h1>.
    await expect(
        page.getByRole('heading', { name: 'AMVERFU', level: 1 })
    ).toBeVisible();

    // Verificamos que también esté visible el título
    // de la sección de búsqueda.
    await expect(
        page.getByRole('heading', {
            name: 'Buscar un Pokémon',
            level: 2
        })
    ).toBeVisible();

    // Verificamos que el campo para introducir
    // el nombre del Pokémon esté visible.
    await expect(
        page.getByLabel('Nombre del Pokémon:')
    ).toBeVisible();

    // Verificamos que el botón Buscar esté visible.
    await expect(
        page.getByRole('button', { name: 'Buscar' })
    ).toBeVisible();

    // Verificamos que el botón Limpiar esté visible.
    await expect(
        page.getByRole('button', { name: 'Limpiar' })
    ).toBeVisible();

});

// ===============================
// UI-02 - BÚSQUEDA DE UN POKÉMON|
// ===============================

test('UI-02 - Buscar un Pokémon', async ({ page }) => {

    // Abrimos nuestra aplicación.
    await page.goto('/practica-5.html');

    // Localizamos el campo de texto mediante su etiqueta.
    const campoPokemon = page.getByLabel('Nombre del Pokémon:');

    // Escribimos "pikachu" en el campo de búsqueda.
    //
    // fill() coloca automáticamente el texto dentro
    // del elemento indicado.
    await campoPokemon.fill('pikachu');

    // Localizamos el botón Buscar y hacemos clic sobre él.
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Esperamos a que aparezca el encabezado con
    // el nombre del Pokémon.
    //
    // Nuestra aplicación convierte el nombre recibido
    // a mayúsculas mediante:
    //
    // datos.name.toUpperCase()
    //
    await expect(
        page.getByRole('heading', { name: 'PIKACHU' })
    ).toBeVisible();

    // Comprobamos que se muestre el identificador del Pokémon.
    await expect(
        page.getByText('ID:')
    ).toBeVisible();

    // Comprobamos que se muestre la información de altura.
    await expect(
        page.getByText('Altura:')
    ).toBeVisible();

    // Comprobamos que se muestre la información de peso.
    await expect(
        page.getByText('Peso:')
    ).toBeVisible();

});

// =======================================
// UI-03 - LIMPIAR FORMULARIO Y RESULTADO|
// =======================================

test('UI-03 - Limpiar formulario y resultado', async ({ page }) => {

    // Abrimos nuestra aplicación.
    await page.goto('/practica-5.html');

    // Localizamos el campo donde se escribe
    // el nombre del Pokémon.
    const campoPokemon = page.getByLabel('Nombre del Pokémon:');

    // Escribimos un Pokémon para generar un resultado.
    await campoPokemon.fill('pikachu');

    // Presionamos el botón Buscar.
    await page.getByRole('button', { name: 'Buscar' }).click();

    // Comprobamos que la búsqueda produjo un resultado.
    await expect(
        page.getByRole('heading', { name: 'PIKACHU' })
    ).toBeVisible();

    // Presionamos el botón Limpiar.
    await page.getByRole('button', { name: 'Limpiar' }).click();

    // Comprobamos que el campo de texto quedó vacío.
    await expect(campoPokemon).toHaveValue('');

    // Comprobamos que volvió a aparecer el mensaje inicial.
    await expect(
        page.getByText(
            'Escribe el nombre de un Pokémon y presiona "Buscar".'
        )
    ).toBeVisible();

});