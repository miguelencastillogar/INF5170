
"use strict"; // Activa el modo estricto de JavaScript para detectar ciertos errores de programación.

// Obtiene el formulario HTML mediante el identificador definido en practica-9.html.
const formulario = document.getElementById("formulario-cedula");

// Obtiene el campo donde el usuario escribe la cédula.
const campoCedula = document.getElementById("cedula");

// Obtiene el botón que inicia la validación.
const botonValidar = document.getElementById("boton-validar");

// Obtiene el contenedor donde mostraremos el resultado de la API.
const contenedorResultado = document.getElementById("resultado");

// Define la dirección local del backend durante el desarrollo.
// Cuando publiquemos el proyecto, sustituiremos esta dirección por la URL pública de la API.
const URL_API = "http://localhost:5173/api/Cedulas/validar";

/**
 * Restablece el resultado anterior para que no parezca
 * que la nueva cédula ya fue consultada.
 */
function limpiarResultado() {
  
  // Elimina el texto del resultado anterior.
  contenedorResultado.textContent = "";

  // Elimina las clases CSS de éxito, error o resultado inválido.
  contenedorResultado.className = "";

  // Oculta el contenedor del resultado.
  contenedorResultado.hidden = true;
}

/**
 * Limpia el resultado anterior cuando el usuario modifica
 * el número de cédula.
 */
campoCedula.addEventListener("input", () => {
  
    // Restablece la vista al comenzar a corregir la cédula.
  limpiarResultado();
});

// Escucha el evento de envío del formulario.
formulario.addEventListener("submit", async (evento) => {
    
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();

    // Obtiene la cédula y elimina los espacios al principio y al final.
    const cedula = campoCedula.value.trim();

    // Comprueba que el usuario haya introducido exactamente once dígitos.
    if (!/^\d{11}$/.test(cedula)) {
        
        // Limpia cualquier resultado de una consulta anterior.
        limpiarResultado();

        // Detiene el proceso: la API no será consultada.
        return;
    }

    // Deshabilita el botón mientras esperamos la respuesta del servicio.
    botonValidar.disabled = true;

    // Informa al usuario que la solicitud está en proceso.
    botonValidar.textContent = "Validando...";

    // Oculta cualquier resultado anterior y prepara el nuevo mensaje.
    mostrarResultado("Consultando el servicio de validación...", "resultado-error");

    try {
        
        // Envía una solicitud HTTP POST al backend.
        const respuesta = await fetch(URL_API, {
            
            // Especifica el método HTTP utilizado por el endpoint.
            method: "POST",

            // Indica que el contenido enviado estará en formato JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Convierte la cédula en un objeto JSON para enviarlo al servicio.
            body: JSON.stringify({ cedula: cedula })
        });

        // Convierte el cuerpo de la respuesta HTTP de JSON a un objeto JavaScript.
        const resultado = await respuesta.json();

        // Gestiona las respuestas HTTP que indican que la solicitud no fue aceptada.
        if (!respuesta.ok) {
            
            // Muestra el mensaje de error devuelto por el servidor, si existe.
            mostrarResultado(
                resultado.mensaje || "No fue posible procesar la cédula.",
                "resultado-error"
            );

            // Finaliza el bloque try sin procesar el resultado como una validación exitosa.
            return;
        }

        // Determina el estilo y el mensaje según el resultado matemático recibido.
        if (resultado.valida) {
            
            // Presenta el resultado cuando la cédula cumple el algoritmo.
            mostrarResultado(resultado.mensaje, "resultado-valido");
        } else {
            
            // Presenta el resultado cuando la cédula no cumple el algoritmo.
            mostrarResultado(resultado.mensaje, "resultado-invalido");
        }
    
    } catch (error) {
        
        // Gestiona errores de conexión, como un backend apagado o inaccesible.
        mostrarResultado(
            "No se pudo conectar con el servicio. Compruebe que la API esté en ejecución.",
            "resultado-error"
        );

        // Registra información técnica del error en la consola del navegador.
        console.error("Error al comunicarse con la API:", error);
    
    } finally {
        
        // Reactiva el botón tanto si la solicitud tuvo éxito como si falló.
        botonValidar.disabled = false;

        // Restaura el texto original del botón.
        botonValidar.textContent = "Validar cédula";
    }
});

// Define una función reutilizable para mostrar mensajes en la interfaz.
function mostrarResultado(mensaje, claseCSS) {
    
    // Inserta el mensaje como texto, evitando interpretarlo como código HTML.
    contenedorResultado.textContent = mensaje;

    // Sustituye las clases anteriores por la clase correspondiente al resultado.
    contenedorResultado.className = claseCSS;

    // Hace visible el contenedor que inicialmente estaba oculto.
    contenedorResultado.hidden = false;
}
