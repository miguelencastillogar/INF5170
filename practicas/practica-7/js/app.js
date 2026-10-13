
/* ************************* */
/* Configuración de Supabase */
/* ************************* */

// Sustituir estos valores por los de tu proyecto.
const SUPABASE_URL = "https://gzwzyyllqlsabwohaxfs.supabase.co";
const SUPABASE_KEY = "sb_publishable_hHyY6dm0vJVkczoyIAqzjA_fjg1QvFk";

// Crear el cliente para comunicarnos con Supabase.
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* **************************** */
/* Referencias a elementos HTML */
/* **************************** */

// Obtener la tabla donde mostraremos los productos.
const tablaProductos = document.getElementById("tabla-productos");

// Obtener el área donde mostraremos mensajes.
const elementoMensaje = document.getElementById("mensaje");

/* *************************** */
/* Mostrar mensajes al usuario */
/* *************************** */

function mostrarMensaje(texto, tipo = "mensaje-exito") {
    
    elementoMensaje.textContent = texto;
    elementoMensaje.className = tipo;
}

/* ******************************* */
/* Consultar productos en Supabase */
/* ******************************* */

async function cargarProductos() {
    
    try {
        
        // Preparar la consulta de productos.
        let consulta = clienteSupabase.from("productos").select("*");

        // Obtener el texto escrito en el campo de búsqueda.
        const termino = document.getElementById("buscar").value.trim();

        // Filtrar por nombre cuando se haya escrito un término.
        if (termino !== "") {
            consulta = consulta.ilike("nombre", `%${termino}%`);
        }

        // Ejecutar la consulta y ordenar los resultados.
        const { data, error } = await consulta.order("id", { ascending: true });

        // Comprobar si Supabase devolvió un error.
        if (error) {
            throw error;
        }

        // Limpiar el contenido anterior de la tabla.
        tablaProductos.replaceChildren();

        // Comprobar si existen productos registrados.
        if (data.length === 0) {
            
            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 5;
            celda.textContent = "No hay productos registrados.";

            fila.appendChild(celda);
            tablaProductos.appendChild(fila);

            return;
        }

        // Recorrer los productos recibidos desde Supabase.
        data.forEach((producto) => {
            
            const fila = document.createElement("tr");

            // Crear las celdas con los datos del producto.
            const valores = [
                producto.id,
                producto.nombre,
                Number(producto.precio).toFixed(2),
                producto.cantidad
            ];

            valores.forEach((valor) => {
                const celda = document.createElement("td");

                // textContent evita interpretar los datos como HTML.
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            // Crear la celda de acciones.
            const celdaAcciones = document.createElement("td");

            // Crear el botón para editar el producto.
            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.textContent = "Editar";
            botonEditar.className = "btn-editar";
            botonEditar.dataset.id = producto.id;

            // Crear el botón para eliminar el producto.
            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "btn-eliminar";
            botonEliminar.dataset.id = producto.id;

            // Agregar los botones a la celda.
            celdaAcciones.append(botonEditar, botonEliminar);
            fila.appendChild(celdaAcciones);

            // Agregar la fila a la tabla.
            tablaProductos.appendChild(fila);
        });

    } catch (error) {
        
        console.error("Error al consultar productos:", error);

        mostrarMensaje("No fue posible cargar los productos. Revisa la conexión con Supabase.", "mensaje-error");

        tablaProductos.replaceChildren();

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Error al cargar los productos.";

        fila.appendChild(celda);
        tablaProductos.appendChild(fila);
    }
}

/* ******************* */
/* Registrar productos */
/* ******************* */

// Obtener los elementos del formulario.
const formularioProducto = document.getElementById("formulario-producto");
const campoId = document.getElementById("producto-id");
const campoNombre = document.getElementById("nombre");
const campoPrecio = document.getElementById("precio");
const campoCantidad = document.getElementById("cantidad");

// Escuchar el envío del formulario.
formularioProducto.addEventListener("submit", async (evento) => {
    
    // Evitar que el navegador recargue la página.
    evento.preventDefault();

    // Obtener los datos introducidos por el usuario.
    const nombre = campoNombre.value.trim();
    const precio = Number(campoPrecio.value);
    const cantidad = Number(campoCantidad.value);

    // Validar los datos antes de enviarlos.
    if (nombre === "" || campoPrecio.value === "" || campoCantidad.value === "" || !Number.isFinite(precio) || !Number.isInteger(cantidad) || precio < 0 || cantidad < 0) {
        mostrarMensaje("Introduce un nombre, un precio y una cantidad válidos.", "mensaje-error");
        return;
    }

    // Preparar el objeto que se guardará en PostgreSQL.
    const producto = {
        nombre: nombre,
        precio: precio,
        cantidad: cantidad
    };

    try {
        
        // Deshabilitar el botón mientras se guarda el registro.
        const botonGuardar = document.getElementById("btn-guardar");
        botonGuardar.disabled = true;
        
        // Comprobar si estamos registrando o modificando.
        const id = campoId.value;
        let resultado;

        if (id === "") {
            
            // Registrar un producto nuevo.
            resultado = await clienteSupabase.from("productos").insert([producto]);
        
        } else {
            
            // Modificar el producto seleccionado.
            resultado = await clienteSupabase.from("productos").update(producto).eq("id", Number(id));
        }

        // Comprobar si Supabase devolvió un error.
        if (resultado.error) {
            throw resultado.error;
        }

        // Limpiar el formulario y restaurar sus botones.
        formularioProducto.reset();
        campoId.value = "";

        document.getElementById("titulo-formulario").textContent = "Registrar producto";

        document.getElementById("btn-guardar").textContent = "Guardar producto";

        document.getElementById("btn-cancelar").hidden = true;

        // Mostrar el resultado de la operación.
        mostrarMensaje(id === "" ? "Producto registrado correctamente." : "Producto modificado correctamente.", "mensaje-exito");

        // Actualizar el listado.
        await cargarProductos();

    } catch (error) {
        
        console.error("Error al registrar el producto:", error);

        mostrarMensaje("No fue posible registrar el producto. Revisa los permisos y la conexión.", "mensaje-error");

    } finally {
        
        // Habilitar nuevamente el botón.
        document.getElementById("btn-guardar").disabled = false;
    }
});

/* **************************** */
/* Acciones sobre los productos */
/* **************************** */

// Escuchar los clics realizados dentro de la tabla.
tablaProductos.addEventListener("click", async (evento) => {

    // Identificar cuál botón se ha pulsado.
    const botonEditar = evento.target.closest(".btn-editar");
    const botonEliminar = evento.target.closest(".btn-eliminar");

    // ----------------------
    // A. Editar un producto|
    // ----------------------

    if (botonEditar) {

        // Obtener el ID del producto seleccionado.
        const id = Number(botonEditar.dataset.id);

        // Obtener las celdas de la fila correspondiente.
        const fila = botonEditar.closest("tr");
        const celdas = fila.querySelectorAll("td");

        // Cargar los datos del producto en el formulario.
        campoId.value = id;
        campoNombre.value = celdas[1].textContent;
        campoPrecio.value = celdas[2].textContent;
        campoCantidad.value = celdas[3].textContent;

        // Cambiar el formulario al modo de edición.
        document.getElementById("titulo-formulario").textContent = "Modificar producto";

        document.getElementById("btn-guardar").textContent = "Guardar cambios";

        document.getElementById("btn-cancelar").hidden = false;

        // Desplazarse hasta el formulario.
        formularioProducto.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        mostrarMensaje("Modifica los datos y pulsa Guardar cambios.", "mensaje-exito");

        return;
    }

    // ------------------------
    // B. Eliminar un producto|
    // ------------------------

    if (botonEliminar) {

        // Obtener el ID del producto seleccionado.
        const id = Number(botonEliminar.dataset.id);

        // Solicitar confirmación antes de eliminar.
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");

        // Si el usuario cancela, no se realiza ninguna operación.
        if (!confirmar) {
            return;
        }

        try {
            
            // Deshabilitar el botón mientras se procesa la petición.
            botonEliminar.disabled = true;

            // Eliminar el producto seleccionado en Supabase.
            const { error } = await clienteSupabase.from("productos").delete().eq("id", id);

            // Comprobar si ocurrió un error.
            if (error) {
                throw error;
            }

            // Si el producto eliminado estaba en edición,
            // limpiar el formulario y cancelar ese modo.
            if (Number(campoId.value) === id) {
                
                formularioProducto.reset();
                campoId.value = "";

                document.getElementById("titulo-formulario").textContent = "Registrar producto";

                document.getElementById("btn-guardar").textContent = "Guardar producto";

                document.getElementById("btn-cancelar").hidden = true;
            }

            // Informar que la operación terminó correctamente.
            mostrarMensaje("Producto eliminado correctamente.", "mensaje-exito");

            // Volver a consultar los productos.
            await cargarProductos();

        } catch (error) {
            
            console.error("Error al eliminar el producto:", error);

            mostrarMensaje("No fue posible eliminar el producto. Revisa la conexión y los permisos.", "mensaje-error");

            // Si la fila sigue disponible, habilitar el botón.
            if (botonEliminar.isConnected) {
                botonEliminar.disabled = false;
            }
        }
    }
});

/* ******************* */
/* Cancelar la edición */
/* ******************* */

// Restaurar el formulario al modo de registro.
document.getElementById("btn-cancelar").addEventListener("click", () => {
    
    formularioProducto.reset();
    campoId.value = "";

    document.getElementById("titulo-formulario").textContent = "Registrar producto";

    document.getElementById("btn-guardar").textContent = "Guardar producto";

    document.getElementById("btn-cancelar").hidden = true;

    mostrarMensaje("Edición cancelada.", "mensaje-exito");
});

/* ********************* */
/* Búsqueda de productos */
/* ********************* */

// Buscar nuevamente cada vez que cambie el texto.
document.getElementById("buscar").addEventListener("input", () => {
    cargarProductos();
});

/* ******************************* */
/* Inicialización de la aplicación */
/* ******************************* */

// Cargar los productos al abrir la página.
cargarProductos();