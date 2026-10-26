/*
 * INF5170 - Aplicación integrada candidata.
 * Este archivo administra la autenticación, el menú dinámico y el formulario.
 * La clave publishable/anon puede estar en el frontend; nunca colocar aquí
 * una clave secreta de servidor (service_role).
 */

// Se reutiliza el proyecto Supabase ya configurado en la Práctica 7.
const SUPABASE_URL = "https://gzwzyyllqlsabwohaxfs.supabase.co";
const SUPABASE_KEY = "sb_publishable_hHyY6dm0vJVkczoyIAqzjA_fjg1QvFk";
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Referencias a los componentes principales de la interfaz.
const vistaLogin = document.getElementById("vista-login");
const vistaAplicacion = document.getElementById("vista-aplicacion");
const formularioLogin = document.getElementById("formulario-login");
const mensajeLogin = document.getElementById("mensaje-login");
const estadoSesion = document.getElementById("estado-sesion");
const formularioFinal = document.getElementById("formulario-final");
const mensajeFormulario = document.getElementById("mensaje-formulario");
const pasos = [...formularioFinal.querySelectorAll("[data-paso]")];
let pasoActual = 1;
let usuarioActual = null;

// Muestra mensajes sin interpretar el contenido como HTML.
function mostrarMensaje(elemento, texto, tipo = "") {
  elemento.textContent = texto;
  elemento.className = tipo ? `mensaje ${tipo}` : "mensaje";
}

// Cambia entre la pantalla de acceso y la aplicación protegida.
function mostrarAplicacion(usuario) {
  usuarioActual = usuario;
  const autenticado = Boolean(usuario);
  vistaLogin.hidden = autenticado;
  vistaAplicacion.hidden = !autenticado;
  estadoSesion.textContent = autenticado ? `Sesión: ${usuario.email}` : "Sesión no iniciada";
  if (autenticado) cargarMenu();
}

// El menú se obtiene desde JSON y sus elementos se crean mediante DOM.
async function cargarMenu() {
  const menu = document.getElementById("menu-principal");
  const mensaje = document.getElementById("mensaje-menu");
  try {
    const respuesta = await fetch("data/menu.json");
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const opciones = await respuesta.json();
    menu.replaceChildren();

    opciones.forEach((opcion) => {
      const item = document.createElement("li");
      const enlace = document.createElement("a");
      enlace.textContent = opcion.nombre;
      enlace.href = opcion.enlace;
      if (opcion.externo) {
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
      }
      item.appendChild(enlace);
      menu.appendChild(item);
    });
    mostrarMensaje(mensaje, "");
  } catch (error) {
    console.error("No se pudo cargar el menú JSON:", error);
    menu.replaceChildren();
    mostrarMensaje(mensaje, "No fue posible cargar el menú. Abre la aplicación desde GitHub Pages o un servidor web.", "error");
  }
}

// Inicio de sesión mediante Supabase Auth. No se crean usuarios desde el portal.
formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const boton = document.getElementById("btn-login");
  boton.disabled = true;
  mostrarMensaje(mensajeLogin, "Validando credenciales…");
  const email = document.getElementById("correo-login").value.trim();
  const password = document.getElementById("clave-login").value;

  try {
    const { data, error } = await clienteSupabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    mostrarAplicacion(data.user);
    formularioLogin.reset();
    mostrarMensaje(mensajeLogin, "");
  } catch (error) {
    console.error("Error de autenticación:", error);
    mostrarMensaje(mensajeLogin, "No se pudo iniciar sesión. Verifica el correo, la contraseña y la configuración de Supabase.", "error");
  } finally {
    boton.disabled = false;
  }
});

// Cerrar sesión en Supabase y volver a la pantalla de acceso.
document.getElementById("btn-cerrar-sesion").addEventListener("click", async () => {
  const { error } = await clienteSupabase.auth.signOut();
  if (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No fue posible cerrar la sesión. Inténtalo nuevamente.");
    return;
  }
  mostrarAplicacion(null);
});

// Valida los campos visibles antes de permitir avanzar al siguiente paso.
function validarPasoVisible() {
  const fieldset = pasos.find((paso) => Number(paso.dataset.paso) === pasoActual);
  const campos = [...fieldset.querySelectorAll("input, select, textarea")];
  for (const campo of campos) {
    if (!campo.checkValidity()) {
      campo.reportValidity();
      return false;
    }
  }
  return true;
}

// Actualiza la visibilidad de los pasos y el indicador de progreso.
function mostrarPaso(numero) {
  pasoActual = numero;
  pasos.forEach((paso) => { paso.hidden = Number(paso.dataset.paso) !== pasoActual; });
  document.getElementById("paso-indicador").textContent = `Paso ${pasoActual} de ${pasos.length}`;
  document.getElementById("barra-progreso").style.width = `${(pasoActual / pasos.length) * 100}%`;
  document.getElementById("btn-anterior").hidden = pasoActual === 1;
  document.getElementById("btn-siguiente").hidden = pasoActual === pasos.length;
  document.getElementById("btn-guardar").hidden = pasoActual !== pasos.length;
  mostrarMensaje(mensajeFormulario, "");
}

document.getElementById("btn-siguiente").addEventListener("click", () => {
  if (validarPasoVisible()) mostrarPaso(Math.min(pasoActual + 1, pasos.length));
});
document.getElementById("btn-anterior").addEventListener("click", () => {
  mostrarPaso(Math.max(pasoActual - 1, 1));
});

// Guarda el registro en PostgreSQL mediante Supabase, asociado al usuario autenticado.
formularioFinal.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (!validarPasoVisible()) return;
  if (!usuarioActual) {
    mostrarAplicacion(null);
    mostrarMensaje(mensajeLogin, "La sesión expiró. Inicia sesión nuevamente.", "error");
    return;
  }

  const boton = document.getElementById("btn-guardar");
  boton.disabled = true;
  mostrarMensaje(mensajeFormulario, "Guardando información…");

  const registro = {
    user_id: usuarioActual.id,
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    telefono: document.getElementById("telefono").value.trim() || null,
    motivo: document.getElementById("motivo").value,
    detalles: document.getElementById("detalles").value.trim() || null
  };

  try {
    const { data, error } = await clienteSupabase
      .from("registros_finales")
      .insert(registro)
      .select("id, creado_en")
      .single();
    if (error) throw error;

    document.getElementById("mensaje-resultado").textContent =
      `Registro #${data.id} guardado correctamente el ${new Date(data.creado_en).toLocaleString("es-DO")}.`;
    document.getElementById("resultado").hidden = false;
    formularioFinal.closest("section").hidden = true;
    formularioFinal.reset();
    mostrarPaso(1);
  } catch (error) {
    console.error("Error al guardar el formulario:", error);
    mostrarMensaje(mensajeFormulario, "No se pudo guardar el registro. Comprueba que ejecutaste el SQL de configuración y que las políticas RLS están activas.", "error");
  } finally {
    boton.disabled = false;
  }
});

// Permite iniciar otro formulario sin recargar la página.
document.getElementById("btn-nuevo").addEventListener("click", () => {
  document.getElementById("resultado").hidden = true;
  formularioFinal.closest("section").hidden = false;
  formularioFinal.reset();
  mostrarPaso(1);
});

// Al cargar la página, recuperar la sesión existente si la hay.
async function inicializarAplicacion() {
  mostrarPaso(1);
  const { data, error } = await clienteSupabase.auth.getSession();
  if (error) console.error("No se pudo recuperar la sesión:", error);
  mostrarAplicacion(data?.session?.user ?? null);
}

// Mantiene la interfaz sincronizada con cambios de autenticación.
clienteSupabase.auth.onAuthStateChange((_evento, sesion) => {
  mostrarAplicacion(sesion?.user ?? null);
});
inicializarAplicacion();