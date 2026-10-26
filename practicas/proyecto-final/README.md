# Chatbot del Estatuto Orgánico de la UASD — versión estable 1.2.1

Proyecto académico de INF5170 — Laboratorio de Lenguaje de Programación III.

## Contenido

```text
proyecto-final/
├── proyecto-final.html
├── css/styles.css
├── js/app.js
├── data/estatuto.json
├── tests/
│   ├── validator.mjs
│   └── regression.mjs
├── README.md
├── DOCUMENTO_TECNICO.md
└── PLAN_DE_PRUEBAS.md
```

## Funcionalidad

- Interfaz adaptable a computadora y móvil.
- Búsqueda documental en el banco local `data/estatuto.json`.
- Extractos normativos directos para consultas identificadas, incluidas las funciones del rector (artículo 38) y la composición del Consejo Universitario (artículo 32).
- Síntesis determinista para las comparaciones entre las funciones del rector y las atribuciones del Consejo Universitario, basada en los artículos 38 y 34. Esa ruta se usa tanto con la IA local desactivada como activada y se etiqueta para dejar claro que no utilizó generación de IA.
- IA local opcional mediante WebLLM para otras consultas con evidencia recuperada. Las respuestas generadas se validan; si no pasan los controles, se utiliza el respaldo documental.
- Abstención cuando el banco no contiene evidencia suficientemente relacionada.
- Referencias, advertencias de cotejo y comentarios en el código que explican las decisiones técnicas principales.

## Ejecutar localmente

1. Descomprime el paquete.
2. Abre la carpeta `proyecto-final` en Visual Studio Code.
3. Inicia Live Server desde `proyecto-final.html`.
4. No abras el HTML mediante `file://`: el navegador debe poder recuperar el JSON por HTTP/HTTPS.

La búsqueda documental funciona sin activar la IA local. Para activar el modelo, pulsa **Activar IA local**. La primera carga necesita conexión a Internet para descargar el modelo y un navegador/equipo compatibles con WebGPU. No se utiliza una clave de API.

## Pruebas automatizadas

Con Node.js instalado, desde esta carpeta ejecuta:

```bash
node --check js/app.js
node tests/validator.mjs
node tests/regression.mjs
```

Estas pruebas comprueban la sintaxis, funciones de validación, formato de las síntesis, rutas de respuesta, existencia de artículos necesarios y algunos invariantes del banco. No ejecutan una inferencia real de WebGPU ni certifican la exactitud de cada registro del Estatuto.

## Publicación en GitHub Pages

1. Conserva una copia de la versión publicada actualmente.
2. Copia el contenido de esta carpeta a `practicas/proyecto-final/` en el repositorio.
3. Confirma que se mantengan las rutas y nombres de archivo.
4. Publica los cambios en la rama configurada para GitHub Pages.
5. Abre la página publicada, realiza una recarga forzada y prueba las consultas del `PLAN_DE_PRUEBAS.md`.

## Fuente y limitaciones

El banco documental se preparó a partir de una edición del Estatuto publicada en abril de 2012. El proyecto no certifica que esa edición incorpore reformas posteriores y reconoce que parte del material extraído requiere cotejo visual con el PDF original. Las referencias deben verificarse contra la fuente.

Fuente oficial indicada en el proyecto: https://postgrado.uasd.edu.do/wp-content/uploads/2024/06/ESTATUTO-ORGANICO-UASD.pdf

Este es un prototipo académico de consulta documental, no una fuente de interpretación jurídica definitiva. La recuperación léxica es aproximada y las respuestas generativas pueden equivocarse; ante falta de evidencia, la aplicación debe abstenerse.

## Historial de versión

### 1.2.1 — documentación del código y entrega estable

- Se amplía la documentación del código sin cambiar deliberadamente la lógica funcional de la versión 1.2.0.
- Se documentan las secciones principales del HTML y los bloques visuales del CSS.
- Se añaden comentarios tipo JSDoc a las funciones de `js/app.js` para explicar su responsabilidad y los parámetros relevantes.
- Se aclara el alcance de las pruebas automatizadas y por qué `data/estatuto.json` debe conservar sintaxis JSON estándar.
- Se vuelven a ejecutar las pruebas automatizadas incluidas en el paquete. La compatibilidad concreta de WebGPU depende del navegador y del equipo de destino.


## Convenciones de documentación del código

- `proyecto-final.html`: comentarios en las secciones principales de la interfaz y los recursos vinculados.
- `css/styles.css`: comentarios por bloques visuales, accesibilidad, diseño adaptable y estados de la IA.
- `js/app.js`: comentarios de función que describen propósito, parámetros relevantes y decisiones de control.
- `tests/validator.mjs` y `tests/regression.mjs`: explicación del alcance y de los límites de cada conjunto de pruebas.
- `data/estatuto.json`: se mantiene como JSON válido; su esquema y advertencias se documentan aquí y en el documento técnico, porque JSON estándar no admite comentarios.

La versión 1.2.1 es una actualización de documentación; no pretende cambiar el comportamiento funcional validado en la versión 1.2.0.
