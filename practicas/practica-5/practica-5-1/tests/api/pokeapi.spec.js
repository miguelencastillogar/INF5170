// Importamos las funciones test y expect de Playwright.
import { test, expect } from '@playwright/test';

// =====================================
// API-01 - CONSULTAR POKÉMON EXISTENTE|
// =====================================

test('API-01 - Consultar Pikachu en PokéAPI', async ({ request }) => {

    // Realizamos una solicitud HTTP GET directamente
    // contra el endpoint de PokéAPI.
    //
    // request permite realizar pruebas de API sin
    // necesidad de abrir un navegador.
    const respuesta = await request.get('https://pokeapi.co/api/v2/pokemon/pikachu');

    // Comprobamos que el servidor respondió con
    // el código HTTP 200.
    //
    // 200 significa que la solicitud fue procesada
    // correctamente y el recurso fue encontrado.
    expect(respuesta.status()).toBe(200);

    // Convertimos el cuerpo de la respuesta HTTP
    // desde JSON hacia un objeto JavaScript.
    const datos = await respuesta.json();

    // Comprobamos que el nombre recibido sea "pikachu".
    expect(datos.name).toBe('pikachu');

    // Comprobamos que la respuesta contenga
    // un identificador para el Pokémon.
    expect(datos.id).toBeDefined();

    // Comprobamos que también exista información
    // sobre la altura.
    expect(datos.height).toBeDefined();

    // Comprobamos que también exista información
    // sobre el peso.
    expect(datos.weight).toBeDefined();

});

// =======================================
// API-02 - CONSULTAR POKÉMON INEXISTENTE|
// =======================================

test('API-02 - Consultar Pokémon inexistente', async ({ request }) => {

    // Realizamos una solicitud HTTP GET utilizando
    // un nombre de Pokémon que no existe.
    const respuesta = await request.get('https://pokeapi.co/api/v2/pokemon/no-existe');

    // Comprobamos que la API responda con HTTP 404.
    //
    // 404 significa:
    // "Not Found" / "Recurso no encontrado".
    expect(respuesta.status()).toBe(404);

});