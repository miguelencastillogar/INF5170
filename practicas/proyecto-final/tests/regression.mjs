/**
 * Pruebas de regresión estructural del proyecto.
 * Comprueban recursos requeridos, integridad del banco y presencia de rutas de seguridad.
 * No sustituyen una prueba manual del navegador ni una ejecución real de WebGPU.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const knowledge = JSON.parse(fs.readFileSync(path.join(root, 'data/estatuto.json'), 'utf8'));
const flow = app.slice(app.indexOf('async function procesarPregunta'), app.indexOf('function renderizarPreguntasSugeridas'));
function test(name, fn) { fn(); console.log(`✓ ${name}`); }

test('Las comparaciones rector/Consejo se desvían antes de invocar el motor de IA', () => {
  const comparison = flow.indexOf('if (esComparacionRectorConsejo(texto))');
  const ai = flow.indexOf('if (motorIA)');
  assert.ok(comparison >= 0 && ai > comparison, 'La ruta comparativa debe preceder a la ruta generativa');
  assert.ok(flow.indexOf('crearMensajeBot(sintesisComparativa)', comparison) < ai);
});
test('La interfaz declara que la IA generativa no se utilizó para esa comparación', () => {
  assert.match(flow, /la IA generativa no se utilizó para esta consulta/);
});
test('La síntesis controlada sigue siendo explícita y determinista', () => {
  assert.match(app, /Síntesis documental validada · plantilla determinista; IA generativa no utilizada/);
  assert.match(app, /const dosOraciones =/);
  assert.match(app, /const tresOraciones =/);
  // Ejecutamos la función con artículos simulados para comprobar la extensión real
  // sin iniciar DOM, WebGPU ni descargar el modelo.
  const start = app.indexOf('function crearSintesisComparativaRectorConsejo(');
  const brace = app.indexOf('{', start);
  let depth = 0, end = -1;
  for (let i = brace; i < app.length; i++) {
    if (app[i] === '{') depth++;
    if (app[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  assert.ok(start >= 0 && end > start, 'No se pudo aislar la función de síntesis');
  const fn = app.slice(start, end);
  const normalizarTexto = text => String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[¿?¡!.,;:()[\]{}"“”]/g, ' ').replace(/\s+/g, ' ').trim();
  const esConsultaExplicativa = () => true;
  const esComparacionRectorConsejo = () => true;
  const buscarArticuloPorNumero = n => ({ extracted_text: `ARTÍCULO ${n} texto de prueba` });
  const obtenerNumeroOracionesSolicitado = q => /dos oraciones/i.test(q) ? 2 : 3;
  const crear = new Function('normalizarTexto', 'esConsultaExplicativa', 'esComparacionRectorConsejo', 'buscarArticuloPorNumero', 'obtenerNumeroOracionesSolicitado', `${fn}; return crearSintesisComparativaRectorConsejo;`)(normalizarTexto, esConsultaExplicativa, esComparacionRectorConsejo, buscarArticuloPorNumero, obtenerNumeroOracionesSolicitado);
  const dos = crear('Responde en dos oraciones');
  const tres = crear('Explica en tres oraciones');
  const count = text => (text.match(/[.!?]+(?=\s+[¿¡A-ZÁÉÍÓÚÑ]|\s*$)/g) || []).length;
  assert.equal(count(dos.texto), 2, 'La síntesis de dos oraciones debe tener dos finales');
  assert.equal(count(tres.texto), 3, 'La síntesis de tres oraciones debe tener tres finales');
});
test('El banco contiene los artículos 32, 34 y 38 necesarios', () => {
  const nums = new Set(knowledge.article_extracts.map(a => Number(a.article_number)));
  for (const n of [32, 34, 38]) assert.ok(nums.has(n), `Falta artículo ${n}`);
});
test('Las consultas normativas directas mantienen prioridad antes de la comparación y de la IA', () => {
  const direct = flow.indexOf('crearRespuestaNormativaPrioritaria(texto)');
  const comparison = flow.indexOf('if (esComparacionRectorConsejo(texto))');
  const ai = flow.indexOf('if (motorIA)');
  assert.ok(direct >= 0 && direct < comparison && comparison < ai);
});
test('Se mantiene el respaldo documental ante fallos de generación', () => {
  assert.match(flow, /crearRespuestaDocumental\(texto\)/);
  assert.match(flow, /Respaldo documental/);
});
test('Se conserva el control del número de oraciones en las respuestas generadas restantes', () => {
  assert.match(app, /count !== oracionesSolicitadas/);
});
console.log('\nResultado: pruebas de regresión de la versión 1.2.1 aprobadas.');

// Las trazas que imprimían el texto generado por el modelo fueron retiradas
// antes de la entrega estable para no exponer contenido de las consultas en consola.
test('No quedan trazas temporales que impriman respuestas generadas', () => {
  assert.doesNotMatch(app, /\[IA diagnóstico\] Intento/);
});

test('El HTML referencia recursos locales existentes', () => {
  const html = fs.readFileSync(path.join(root, 'proyecto-final.html'), 'utf8');
  assert.ok(fs.existsSync(path.join(root, 'css/styles.css')));
  assert.ok(fs.existsSync(path.join(root, 'js/app.js')));
  assert.ok(fs.existsSync(path.join(root, 'data/estatuto.json')));
  assert.match(html, /css\/styles\.css/);
  assert.match(html, /js\/app\.js/);
});

test('El banco documental conserva conteos declarados y números de artículo únicos', () => {
  assert.equal(knowledge.article_extracts.length, 146);
  const nums = knowledge.article_extracts.map(a => Number(a.article_number));
  assert.equal(new Set(nums).size, nums.length);
  assert.equal(knowledge.questions_and_answers.length, 105);
  assert.equal(knowledge.glossary_entries.length, 65);
  assert.equal(knowledge.suggested_questions.length, 41);
});
