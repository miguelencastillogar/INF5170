# Práctica 5.1 - Pruebas Automatizadas de UI y API

## INF5170 - Laboratorio de Lenguaje de Programación III

---

## 1. Descripción

En esta práctica se implementaron pruebas automatizadas para una aplicación web
desarrollada con HTML, CSS y JavaScript.

La aplicación utilizada se denomina **AMVERFU - Explorador Pokémon** y permite
consultar información de un Pokémon mediante la API pública PokéAPI.

Para la automatización de las pruebas se utilizó **Playwright**.

---

## 2. Objetivo

El objetivo de esta práctica es aplicar pruebas automatizadas sobre una
aplicación web, verificando tanto el comportamiento de su interfaz de usuario
(UI) como la comunicación con una API REST.

Se implementaron:

- 3 pruebas automatizadas de UI.
- 2 pruebas automatizadas de API.
- Ejecución de las pruebas UI en Chromium, Firefox y WebKit.
- Validación de códigos de respuesta HTTP.
- Validación del contenido JSON recibido desde la API.

---

## 3. Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- npm
- Playwright
- http-server
- PokéAPI
- Git / GitHub

---

## 4. Aplicación AMVERFU

La aplicación permite introducir el nombre de un Pokémon y consultar
información sobre él.

La información presentada incluye:

- Nombre.
- ID.
- Altura.
- Peso.

También dispone de un botón **Limpiar**, que permite restaurar el formulario
y el mensaje inicial.

---

## 5. Estructura del proyecto

```text
practica-5-1/
│
├── app/
│   ├── css/
│   │   └── estilos.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   └── practica-5-1.html
│
├── tests/
│   ├── api/
│   │   └── pokeapi.spec.js
│   │
│   └── ui/
│       └── amverfu.spec.js
│
├── playwright-report/
│   └── index.html
│
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md