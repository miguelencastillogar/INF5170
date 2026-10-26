// Pruebas funcionales aisladas del validador.
// Extraemos funciones puras de app.js para ejecutarlas en Node sin inicializar DOM ni WebGPU.
// Cada caso afirma un resultado esperado y falla el proceso si el comportamiento cambia.
// Este archivo no prueba la calidad real del modelo; prueba reglas deterministas del validador.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `No se encontró ${name}`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`No se pudo extraer ${name}`);
}

function normalizarTexto(texto) {
  return String(texto ?? '').toLocaleLowerCase('es')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z])-\s+([a-z])/g, '$1$2')
    .replace(/[¿?¡!.,;:()[\]{}"'“”]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const obtenerNumero = extractFunction('obtenerNumeroOracionesSolicitado');
const extraerCuerpo = extractFunction('extraerCuerpoRespuesta');
const contar = extractFunction('contarOraciones');
const validar = extractFunction('validarRespuestaGenerada');
const validarComparativa = extractFunction('validarComparacionRectorConsejo');
const make = new Function('normalizarTexto', `${obtenerNumero}; ${extraerCuerpo}; ${contar}; ${validar}; ${validarComparativa}; return { obtenerNumeroOracionesSolicitado, extraerCuerpoRespuesta, contarOraciones, validarRespuestaGenerada, validarComparacionRectorConsejo };`);
const api = make(normalizarTexto);

const pregunta = 'Explica en tres oraciones la diferencia entre las funciones del rector y las atribuciones del Consejo Universitario.';
const cuerpoValido = 'El artículo 38 establece las funciones del rector y su responsabilidad institucional. El artículo 34 describe atribuciones del Consejo Universitario y sus decisiones colegiadas. Ambos órganos tienen responsabilidades distintas dentro de la Universidad.';
const referencias = '\nFuentes consultadas: Artículo 38; Artículo 34.';

// Ejecuta un caso y deja visible su resultado; una aserción fallida detiene la suite.
function test(name, fn) { fn(); console.log(`✓ ${name}`); }

// Casos positivos y negativos: extensión solicitada, referencias, abreviaturas y repetición.

test('Reconoce solicitud de tres oraciones', () => assert.equal(api.obtenerNumeroOracionesSolicitado(pregunta), 3));
test('No cuenta la línea de referencias como oración del cuerpo', () => assert.equal(api.contarOraciones(api.extraerCuerpoRespuesta(cuerpoValido + referencias)), 3));
test('Acepta tres oraciones y referencias al final', () => assert.equal(api.validarRespuestaGenerada(pregunta, cuerpoValido + referencias).valida, true));
test('Rechaza cuatro oraciones reales', () => assert.equal(api.validarRespuestaGenerada(pregunta, cuerpoValido + ' Esta es una cuarta oración.' + referencias).valida, false));
test('Rechaza solo dos oraciones cuando se piden tres', () => {
  const dos = 'El artículo 38 describe las funciones del rector en la Universidad. El artículo 34 detalla las atribuciones del Consejo Universitario y sus responsabilidades.';
  assert.match(api.validarRespuestaGenerada(pregunta, dos + referencias).motivo, /se detectaron 2/);
});
test('No cuenta el punto de la abreviatura Art. como fin de oración', () => {
  const texto = 'El Art. 38 describe las funciones del rector. El Art. 34 describe las atribuciones del Consejo Universitario. Ambos órganos tienen responsabilidades distintas.';
  assert.equal(api.contarOraciones(texto), 3);
});
test('Rechaza respuestas que repiten la pregunta', () => {
  const repetida = pregunta + ' La diferencia es que el rector cumple funciones ejecutivas y el Consejo toma decisiones colegiadas.';
  assert.equal(api.validarRespuestaGenerada(pregunta, repetida).valida, false);
});

test('Acepta comparación cuando el cuerpo nombra ambos órganos y la evidencia contiene los artículos 38 y 34', () => {
  const evidencias = [{ referencia: 'Artículo 38' }, { referencia: 'Artículo 34' }];
  const respuesta = 'El rector supervisa la labor universitaria y vela por el cumplimiento del Estatuto. El Consejo Universitario reglamenta y supervisa las actividades administrativas. Ambos ejercen funciones complementarias dentro de la Universidad.';
  assert.equal(api.validarComparacionRectorConsejo(respuesta, evidencias).valida, true);
});
test('No exige que el modelo repita los números de artículo dentro del cuerpo', () => {
  const evidencias = [{ referencia: 'Artículo 38' }, { referencia: 'Artículo 34' }];
  const respuesta = 'El rector supervisa la labor universitaria. El Consejo Universitario toma decisiones colegiadas. Sus responsabilidades se complementan dentro de la institución.';
  assert.equal(api.validarComparacionRectorConsejo(respuesta, evidencias).valida, true);
});
test('Rechaza comparación si falta uno de los órganos en el cuerpo', () => {
  const evidencias = [{ referencia: 'Artículo 38' }, { referencia: 'Artículo 34' }];
  const respuesta = 'El rector supervisa la labor universitaria y vela por el Estatuto.';
  assert.equal(api.validarComparacionRectorConsejo(respuesta, evidencias).valida, false);
});
test('Rechaza comparación si no se recuperaron ambos artículos', () => {
  const evidencias = [{ referencia: 'Artículo 38' }];
  const respuesta = 'El rector supervisa la labor universitaria. El Consejo Universitario toma decisiones colegiadas.';
  assert.match(api.validarComparacionRectorConsejo(respuesta, evidencias).motivo, /No se recuperaron ambos artículos/);
});

test('Una sección de fuentes no puede compensar un cuerpo demasiado corto', () => {
  const respuesta = 'El rector supervisa la labor universitaria.\nFuentes consultadas: Artículo 38; Artículo 34.';
  assert.equal(api.validarRespuestaGenerada(pregunta, respuesta).valida, false);
});

console.log('\nResultado: 12 pruebas funcionales del validador aprobadas.');
