# Documento técnico — Chatbot del Estatuto Orgánico de la UASD

## 1. Descripción

Aplicación web académica para realizar consultas sobre el Estatuto Orgánico de la Universidad Autónoma de Santo Domingo (UASD). El usuario escribe una pregunta, selecciona una pregunta sugerida o consulta un artículo por número. La aplicación busca información en una base JSON local y muestra la respuesta recuperada, su referencia y, cuando corresponda, una advertencia de validación.

## 2. Tecnologías

- HTML5: estructura semántica de la interfaz.
- CSS3: presentación visual adaptable a escritorio y dispositivos móviles.
- JavaScript: eventos, carga de datos, normalización, puntuación de coincidencias y presentación de respuestas.
- JSON: almacena preguntas y respuestas, sugerencias, casos de abstención, glosario y extractos de artículos.
- GitHub Pages: publicación estática de la interfaz.
- Live Server: ejecución local durante el desarrollo.

## 3. Arquitectura

La aplicación se divide en tres capas ligeras:

1. **Interfaz:** `proyecto-final.html` define la conversación, formulario y zona de preguntas sugeridas.
2. **Lógica del cliente:** `js/app.js` carga el archivo JSON, prepara un índice documental, compara preguntas y presenta el resultado.
3. **Conocimiento:** `data/estatuto.json` contiene los registros documentales y metadatos de validación.

La carga se realiza con `fetch("data/estatuto.json")`. Por ello, la página debe ejecutarse desde un servidor HTTP/HTTPS.

## 4. Funcionamiento de la búsqueda

1. Normaliza el texto: minúsculas, eliminación de tildes y normalización de espacios.
2. Tokeniza la consulta y descarta palabras frecuentes.
3. Compara la consulta con preguntas preparadas y palabras clave.
4. Busca casos de abstención conocidos.
5. Si no encuentra una respuesta preparada suficiente, intenta localizar un artículo o una entrada del glosario.
6. Muestra el texto recuperado, la referencia y las advertencias disponibles.
7. Si no encuentra evidencia suficiente, informa al usuario sin fabricar una respuesta.

La puntuación es heurística y no equivale a una interpretación semántica. Debe evaluarse con preguntas reales y ajustar los umbrales si las pruebas evidencian falsos positivos o abstenciones innecesarias.

## 5. Base documental y controles

El JSON declara 105 preguntas y respuestas, 41 preguntas sugeridas, 7 casos de abstención, 65 entradas de glosario y 146 extractos de artículos. Estas cantidades describen el paquete; no significan que todos los registros estén validados definitivamente. El código muestra advertencias para registros pendientes y conserva las referencias cuando existen.

La edición fuente corresponde a abril de 2012. La aplicación no certifica que incluya todas las reformas posteriores.

## 6. Estado de integración de inteligencia artificial

La aplicación integra un modelo generativo local mediante WebLLM, que se descarga y ejecuta en el navegador cuando el usuario lo activa y el equipo dispone de WebGPU compatible. La recuperación documental es una capa independiente basada en coincidencias léxicas y reglas de intención.

Desde la versión 1.1.3, las consultas normativas de alta precisión —artículo explícito y algunas intenciones reconocidas, como composición/atribuciones del Consejo Universitario, funciones del rector y derechos estudiantiles— priorizan el extracto documental y omiten la generación del modelo. Esta decisión reduce el riesgo de paráfrasis inventadas del modelo pequeño. Las consultas generales pueden continuar usando generación local; esa salida no debe considerarse verificada automáticamente. Si se integra una API externa en el futuro, las credenciales deben residir en un backend y no en el cliente estático publicado.

## 7. Control de fidelidad documental (v1.1.3)

- Se muestra el texto recuperado del artículo en consultas normativas reconocidas.
- Se eliminan algunos pies/encabezados de página típicos de la extracción PDF antes de mostrar el texto.
- Se añade una advertencia visible sobre la necesidad de cotejo visual con el PDF y sobre el alcance temporal de la edición consultada.
- No se afirma que esta regla valide automáticamente todos los extractos ni que el PDF de 2012 incorpore reformas posteriores.

## 8. Seguridad y privacidad

- El contenido se presenta usando `textContent`, evitando interpretar las respuestas recuperadas como HTML.
- No se solicita información personal.
- No se almacena el historial de conversación de forma persistente.
- No se deben publicar secretos o claves de API en el repositorio.

## 8. Publicación

La carpeta se puede alojar en GitHub Pages porque no necesita un servidor propio para la búsqueda documental. Debe publicarse el archivo JSON en la ruta relativa indicada y probarse desde la URL HTTPS final.

## 9. Mejoras futuras

- Integración de IA semántica o generativa mediante un backend seguro.
- Pruebas automatizadas de ranking, abstención y cobertura.
- Revisión visual del texto extraído contra el PDF oficial.
- Registro formal de resultados y métricas de calidad.


## Ajuste de recuperación documental — versión 1.0.3

Se añadió una priorización por intención para consultas concretas: composición del Consejo Universitario (artículo 32), atribuciones del Consejo Universitario (artículo 34), funciones del Rector (artículo 38) y derechos estudiantiles (artículo 100). Cuando se identifica una de estas intenciones, el contexto se limita al artículo objetivo para reducir contaminación por entradas del glosario u otros artículos. El prompt también instruye al modelo a no inventar ni repetir integrantes o cargos.

Este ajuste es una mitigación, no una garantía matemática contra alucinaciones. Debe validarse con las pruebas P16–P20 y cotejarse la respuesta con el PDF original.


### Nota de compatibilidad WebGPU — v1.0.4

Tras detectar `DXGI_ERROR_DEVICE_HUNG` y `Device was lost` con el modelo anterior, se seleccionó un modelo de menor consumo estimado (`SmolLM2-360M-Instruct-q4f32_1-MLC`), se redujo la ventana de contexto a 2048 tokens, el número de evidencias recuperadas a tres y la salida máxima a 160 tokens. Si falla la inferencia, el motor se invalida para evitar reutilizar un objeto ya liberado y se mantiene la búsqueda documental como respaldo. Esto es una mitigación, no una garantía: debe probarse en el equipo final.


## 8. Consultas explicativas y comparativas (v1.1.3)

Las consultas que solicitan explicación, comparación o síntesis ya no reciben automáticamente el extracto normativo prioritario. Para la comparación entre las funciones del Rector y las atribuciones del Consejo Universitario, el recuperador incorpora los artículos 38 y 34 como evidencias separadas y la respuesta se genera con el modelo local. El prompt exige respetar el formato solicitado y sintetizar, en lugar de reproducir íntegramente el artículo. La interfaz identifica estas respuestas como síntesis generadas por IA local. Esta mejora no garantiza por sí sola la exactitud de la generación: deben ejecutarse pruebas en navegador y cotejar las referencias con la fuente oficial.


## Ajustes de la versión 1.1.3

Para comparaciones entre el Rector y el Consejo Universitario, el contexto enviado al modelo se limita a 1,050 caracteres por artículo para reducir el riesgo de exceder la ventana de contexto configurada (2,048 tokens). La generación permite hasta 180 tokens de salida. Los mensajes de error distinguen un fallo de generación de una pérdida confirmada del dispositivo gráfico; la causa exacta debe verificarse en la consola del navegador.


## Ajuste v1.1.3
Se reduce a 650 caracteres por artículo la evidencia usada en comparaciones entre rector y Consejo Universitario, y el límite de generación a 120 tokens, para mantener la solicitud dentro de la ventana de contexto del modelo local.


## Ajuste v1.1.3
Se compacta el prompt de sistema, se limita a 420 caracteres la evidencia por artículo en comparaciones y se mejora la detección de generaciones vacías o aparentemente incompletas. Esto reduce el riesgo de exceder el contexto de 2048 tokens, pero debe validarse en el navegador real.


## Ajuste v1.1.3
Se incorpora validación posterior a la generación: detecta respuestas demasiado cortas, repetición de la pregunta, finales aparentemente truncados y, cuando se solicitan, respuestas que no contienen exactamente tres oraciones. Si falla la validación, se descarta la generación y se utiliza el respaldo documental. La validación es heurística y debe comprobarse en el navegador.


## Ajuste v1.1.3
La comparación entre las funciones del rector y las atribuciones del Consejo Universitario usa una síntesis documental determinista basada en los artículos 38 y 34, y se identifica explícitamente como plantilla sin generación de IA. Las demás respuestas generadas pasan por validaciones heurísticas; si fallan, se muestra el respaldo documental con un aviso claro.


## Ajuste v1.1.3
Se amplía la detección de consultas de relación/comparación entre rector y Consejo Universitario para distintas formulaciones naturales y se admite la validación del número solicitado de dos, tres o cuatro oraciones. La síntesis documental de dos oraciones utiliza los artículos 38 y 34 y etiqueta claramente que no se utilizó IA generativa.


## Cambios de la versión 1.1.3
Se amplía la detección de consultas explicativas y de relación; la síntesis documental rector/Consejo admite solicitudes de dos o tres oraciones; la validación de formato reconoce ambos límites. Se deben ejecutar pruebas de regresión y validar el resultado final en navegador.


## Resultados de regresión — v1.1.3
Pruebas locales ejecutadas sobre las funciones de clasificación, síntesis determinista y validación de formato:
- PASS: consulta explicativa comparativa con solicitud de tres oraciones.
- PASS: pregunta formulada como «¿Qué relación existe…?» con solicitud de dos oraciones.
- PASS: variante «Compara en dos oraciones…».
- PASS: consulta normativa directa no se desvía a la síntesis comparativa.
- PASS: validación acepta una respuesta de dos oraciones completas y de longitud suficiente.

Estas pruebas verifican la lógica aislada en Node.js; no sustituyen las pruebas integrales en Chrome/WebGPU ni certifican la exactitud normativa de todo el banco documental.


## Nota de estabilidad v1.1.4

Se preservan las respuestas normativas directas. Las comparaciones entre rector y Consejo Universitario intentan usar IA local cuando está activada; la validación exige referencias a los artículos 38 y 34 y a ambos órganos. Ante fallo o rechazo, se utiliza la síntesis documental determinista como respaldo. Verifique ambos modos (IA activa y desactivada) y las rutas de error en el navegador de destino.


## Control de generación y recuperación — v1.1.5

El motor local realiza como máximo dos intentos de generación por consulta: el intento inicial y un reintento correctivo si la respuesta no supera las validaciones de forma. El reintento no se ejecuta indefinidamente. Si no se obtiene una respuesta válida, se activa el respaldo documental y se indica que la generación no fue validada. La validación automática no certifica que cada afirmación sea semánticamente correcta; las referencias deben cotejarse con la fuente.

## Candidata v1.1.7: conteo separado del cuerpo y las fuentes

`extraerCuerpoRespuesta()` separa la sección `Fuentes consultadas:` del cuerpo principal antes de comprobar la extensión solicitada. `contarOraciones()` identifica finales de oración en español y evita contar el punto de abreviaturas como `Art.` cuando va seguido del número de artículo. Ambas funciones incluyen comentarios explicativos en el código fuente.

Se agregó `tests/validator-v1.1.7.mjs`, que extrae las funciones puras del archivo principal y las prueba con Node.js sin inicializar el DOM ni WebGPU. Esta candidata no se considera estable hasta superar la prueba manual de navegador y la regresión completa.

## Candidata v1.1.7: validación comparativa basada en evidencia

La validación de una comparación ahora se divide en dos responsabilidades:

- `validarComparacionRectorConsejo()` comprueba que el cuerpo explique ambos órganos y que las evidencias recuperadas incluyan las referencias a los artículos 38 y 34.
- Los números de artículo ya no se exigen dentro de la redacción del modelo; la aplicación presenta las referencias obtenidas del conjunto de evidencias.

Esta separación evita rechazar respuestas potencialmente correctas solo por no repetir los números en el cuerpo, sin aceptar comparaciones cuando falte una de las fuentes. Se añadieron pruebas unitarias de aceptación y rechazo. La prueba de navegador con el modelo real sigue pendiente.

## Candidata v1.1.8: diagnóstico de generación local

La interfaz presenta las referencias recuperadas, por lo que el prompt del modelo ya no le solicita una segunda sección «Fuentes consultadas». Esto reduce instrucciones redundantes y separa la responsabilidad de generación de la responsabilidad de citar las evidencias usadas por la aplicación. Se añadió un registro temporal en consola (`[IA diagnóstico]`) con el texto original de cada intento y el resultado del validador. El texto rechazado solo se registra para diagnóstico y continúa sin mostrarse al usuario como respuesta aceptada.

La candidata se verifica con 12 pruebas funcionales del validador y 13 comprobaciones estructurales. Esas pruebas no pueden demostrar la calidad de la inferencia real ni el funcionamiento de WebGPU en el equipo de destino; se requiere la prueba manual descrita en el plan de pruebas. Las trazas de diagnóstico deben revisarse antes de generar la versión estable.


## Candidata v1.1.9 — comparaciones documentales controladas (NO PUBLICAR)


### Decisión de arquitectura

Las comparaciones entre las funciones del rector y las atribuciones del Consejo Universitario se desvían antes de invocar el modelo generativo y utilizan `crearSintesisComparativaRectorConsejo()`. Esta decisión se basa en evidencia de ejecución real: el modelo SmolLM2-360M introdujo contenido ajeno al Estatuto y produjo respuestas que incumplían el número de oraciones. La síntesis controlada usa los artículos 38 y 34 del banco local y la interfaz identifica explícitamente que no se utilizó IA generativa. No se afirma que toda la IA local sea fiable; las demás consultas generativas siguen siendo experimentales y requieren validación.

## Versión estable 1.2.1 — consolidación de entrega

Esta versión consolida la ruta documental determinista para comparaciones entre el rector y el Consejo Universitario. La síntesis usa los artículos 38 y 34, ofrece dos o tres oraciones según la solicitud reconocida y se identifica como plantilla determinista; la IA generativa no se invoca para esta comparación, aunque el motor esté activado. Las consultas normativas directas conservan prioridad y las consultas sin evidencia suficiente se abstienen.

Se retiraron las trazas temporales de diagnóstico que imprimían el texto original generado por el modelo en la consola. Las respuestas generadas para otras consultas siguen sometidas a validación y, si se rechazan o falla el motor, se presenta el respaldo documental.

Pruebas locales de entrega: `node --check js/app.js`, `node tests/validator.mjs` y `node tests/regression.mjs`. Estas pruebas no ejecutan WebGPU ni certifican el cotejo de cada extracto contra el PDF. La fuente base corresponde a una edición de abril de 2012; no se afirma que incorpore reformas posteriores.


## Actualización 1.2.1 — documentación del código

Se añadieron comentarios de sección en HTML y CSS, documentación tipo JSDoc en las funciones de `js/app.js`, y aclaraciones sobre el alcance de las pruebas automatizadas. `data/estatuto.json` permanece como JSON estándar sin comentarios internos para preservar su validez; la estructura de sus colecciones y las limitaciones de la fuente se describen en este documento y en el README. Esta actualización es documental y no cambia deliberadamente el comportamiento funcional.
