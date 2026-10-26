# Plan de pruebas — versión 1.2.1

## A. Pruebas automatizadas

Ejecutar desde la carpeta `proyecto-final`:

```bash
node --check js/app.js
node tests/validator.mjs
node tests/regression.mjs
```

Criterio: todos los comandos terminan sin errores. Estas pruebas no sustituyen una prueba manual en Chrome/Edge ni verifican la calidad de una inferencia WebGPU real.

## B. Pruebas manuales en navegador

Ejecutar con Live Server. Para cada consulta, revisar respuesta, referencia y consola.

| N.º | IA local | Consulta | Resultado esperado |
|---:|---|---|---|
| 1 | Desactivada | ¿Cuáles son las funciones del rector? | Extracto normativo del artículo 38 y su referencia. |
| 2 | Desactivada | ¿Quiénes integran el Consejo Universitario? | Extracto normativo del artículo 32 y su referencia. |
| 3 | Desactivada | Explica en tres oraciones la diferencia entre las funciones del rector y las atribuciones del Consejo Universitario. | Tres oraciones; referencias a los artículos 38 y 34; etiqueta de síntesis determinista. |
| 4 | Activada | Repetir exactamente la consulta 3. | La misma síntesis determinista; debe indicar que no se utilizó IA generativa para esa comparación. |
| 5 | Desactivada | ¿Qué establece el Estatuto sobre un tema que no aparece en sus artículos? | Abstención; no inventar una disposición. |
| 6 | Activada | Repetir exactamente la consulta 5. | La misma abstención segura si no se recupera evidencia suficiente. |
| 7 | Activada | ¿Qué es [tema general presente en el banco]? | Si genera respuesta, debe estar relacionada con evidencia y mostrar referencias; si falla la validación, debe aparecer respaldo documental. |

## C. Criterios de aceptación

- Las consultas directas mantienen los artículos 38 y 32, respectivamente.
- La comparación rector/Consejo tiene el número de oraciones solicitado y la etiqueta de plantilla determinista.
- Activar la IA no cambia esa comparación determinista.
- La falta de evidencia conduce a abstención y no a una afirmación normativa inventada.
- No aparecen errores de JavaScript que bloqueen el chat.
- La consola no imprime el texto original de generación con trazas temporales de diagnóstico.

## D. Límites de esta validación

Las pruebas automatizadas cubren funciones y estructura; las pruebas manuales confirman los escenarios ejecutados en un navegador concreto. No certifican todos los artículos del banco ni la vigencia normativa posterior a la edición de abril de 2012. Los extractos pendientes deben cotejarse con el PDF oficial.


## E. Alcance de la actualización 1.2.1

Esta actualización documenta HTML, CSS, JavaScript y las suites de prueba. No modifica deliberadamente la lógica de consulta. Tras documentar, deben volver a ejecutarse `node --check js/app.js`, `node tests/validator.mjs` y `node tests/regression.mjs`. La validación real del modelo local requiere navegador compatible y no queda cubierta por las pruebas de Node.
