// =================================
// REFERENCIAS A ELEMENTOS DEL HTML|
// =================================

// Obtenemos el formulario de búsqueda mediante su ID.
const formulario = document.getElementById('formulario-busqueda');

// Obtenemos el campo donde el usuario escribe
// el nombre del Pokémon.
const campoPokemon = document.getElementById('pokemon');

// Obtenemos el contenedor donde mostraremos
// el resultado de la búsqueda.
const resultado = document.getElementById('resultado');

// Obtenemos el botón que permite limpiar el formulario.
const botonLimpiar = document.getElementById('boton-limpiar');

// ======================
// EVENTO DEL FORMULARIO|
// ======================

/*
    addEventListener() permite escuchar eventos que ocurren
    en nuestra página.

    En este caso estamos escuchando el evento "submit",
    que ocurre cuando el usuario envía el formulario.
*/
formulario.addEventListener('submit', async (evento) => {

    /*
        preventDefault() evita el comportamiento
        predeterminado del formulario.

        Normalmente, un formulario intentaría recargar
        la página al enviarse.

        Nosotros queremos realizar la consulta mediante
        JavaScript sin recargar la página.
    */
    evento.preventDefault();

    // ==============================
    // OBTENER EL NOMBRE DEL POKÉMON|
    // ==============================

    /*
        value obtiene el contenido escrito por el usuario.

        trim() elimina espacios innecesarios al principio
        y al final del texto.
    */
    const nombrePokemon = campoPokemon.value.trim().toLowerCase();

    // =================
    // VALIDAR EL CAMPO|
    // =================

    /*
        Si el usuario no escribió ningún nombre,
        mostramos un mensaje y detenemos la ejecución.
    */
    if (nombrePokemon === '') {

        resultado.innerHTML = `
            <p>
                Por favor, escribe el nombre de un Pokémon.
            </p>
        `;

        return;
    }

    // ========================================
    // MENSAJE MIENTRAS SE REALIZA LA CONSULTA|
    // ========================================

    resultado.innerHTML = `
        <p>
            Consultando información...
        </p>
    `;

    // ==================
    // CONSULTAR POKÉAPI|
    // ==================

    try {

        /*
            fetch() permite realizar una solicitud HTTP.

            En este caso utilizamos GET para solicitar
            información de un Pokémon.
        */
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);

        // =======================
        // VALIDAR RESPUESTA HTTP|
        // =======================

        /*
            response.ok será true cuando la respuesta HTTP
            indique que la solicitud fue exitosa.

            Por ejemplo:
            HTTP 200 → true

            Si obtenemos un error como:
            HTTP 404 → false
        */
        if (!respuesta.ok) {

            /*
                Si la API no encuentra el Pokémon,
                mostramos un mensaje al usuario.
            */
            resultado.innerHTML = `
                <p>
                    No se encontró el Pokémon
                    <strong>${nombrePokemon}</strong>.
                </p>
            `;

            return;
        }

        // ===========================
        // CONVERTIR RESPUESTA A JSON|
        // ===========================

        /*
            json() convierte la respuesta HTTP en un
            objeto JavaScript que podemos utilizar.

            La respuesta de PokéAPI contiene información
            como nombre, ID, altura, peso, habilidades, etc.
        */
        const datos = await respuesta.json();

        // ================================
        // MOSTRAR INFORMACIÓN DEL POKÉMON|
        // ================================

        resultado.innerHTML = `
            <h3>${datos.name.toUpperCase()}</h3>

            <p>
                <strong>ID:</strong>
                ${datos.id}
            </p>

            <p>
                <strong>Altura:</strong>
                ${datos.height}
            </p>

            <p>
                <strong>Peso:</strong>
                ${datos.weight}
            </p>
        `;
    
    } catch (error) {

        /*
            catch() nos permite manejar errores que no sean
            simplemente una respuesta HTTP incorrecta.

            Por ejemplo:
            - Problemas de conexión.
            - Problemas de red.
            - Bloqueo de la solicitud.
        */

        console.error('Error al consultar PokéAPI:', error);

        resultado.innerHTML = `
            <p>
                Ocurrió un error al consultar la API.
                Intenta nuevamente.
            </p>
        `;
    }

});

// ===============================
// LIMPIAR FORMULARIO Y RESULTADO|
// ===============================

/*
    Escuchamos el evento "click" del botón Limpiar.

    Aunque el atributo type="reset" ya limpia los campos
    del formulario, necesitamos realizar manualmente
    la limpieza del área de resultados.
*/
botonLimpiar.addEventListener('click', () => {

    /*
        Restauramos el contenido inicial del contenedor
        donde mostramos los resultados.
    */
    resultado.innerHTML = `
        <p id="mensaje">
            Escribe el nombre de un Pokémon y presiona
            "Buscar".
        </p>
    `;

    /*
        Colocamos nuevamente el cursor en el campo
        de búsqueda para facilitar una nueva consulta.
    */
    campoPokemon.focus();

});