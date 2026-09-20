/*
 * =====================================================
 * PRÁCTICA 4 - MENÚ DINÁMICO CON ESTRUCTURA DE DATOS  |
 * Aplicación: AMVERFU                                 |
 * Archivo: script.js                                  |
 * ====================================================|
 *                                                     |
 * OBJETIVO:                                           |
 * Generar dinámicamente el menú de AMVERFU utilizando |
 * los datos almacenados en el archivo menu.json.      |
 *                                                     |
 * Flujo de funcionamiento:                            |
 *                                                     |
 *     menu.json                                       |
 *         ↓                                           |
 *       fetch()                                       |
 *         ↓                                           |
 *   response.json()                                   |
 *         ↓                                           |
 *       datos                                         |
 *         ↓                                           |
 *      forEach()                                      |
 *         ↓                                           |
 * Crear elementos HTML                                |
 *         ↓                                           |
 *  #menu-principal                                    |
 *                                                     | 
 * En este archivo se utiliza JavaScript para manipular|
 * dinámicamente el DOM (Document Object Model).       |
 * ====================================================|
 */

/*
 * --------------------------------------
 * 1. OBTENER LOS DATOS DEL ARCHIVO JSON|
 * --------------------------------------
 *
 * fetch() permite solicitar un recurso.
 *
 * En nuestro caso, solicitamos el archivo:
 *
 *     data/menu.json
 *
 * La ruta es relativa a practica-4.html.
 *
 * Importante:
 * La página debe ejecutarse mediante un servidor web local
 * como Live Server para que fetch() pueda solicitar el JSON.
 */
fetch("data/menu.json")

    /*
     * ----------------------------------------
     * 2. CONVERTIR LA RESPUESTA EN DATOS JSON|
     * ----------------------------------------
     *
     * fetch() devuelve una respuesta.
     *
     * response.json() convierte el contenido de esa respuesta
     * en datos que JavaScript puede utilizar.
     */
    .then(response => response.json())

    /*
     * ------------------------------------
     * 3. TRABAJAR CON LOS DATOS OBTENIDOS|
     * ------------------------------------
     *
     * La variable "datos" contiene el arreglo que tenemos
     * definido en menu.json.
     *
     * Por ejemplo:
     *
     * [
     *     {
     *         "nombre": "Inicio",
     *         "enlace": "#inicio"
     *     },
     *     ...
     * ]
     */
    .then(datos => {

        /*
         * ------------------------------------
         * 4. LOCALIZAR EL CONTENEDOR DEL MENÚ|
         * ------------------------------------
         *
         * En practica-4.html tenemos:
         *
         * <ul id="menu-principal"></ul>
         *
         * getElementById() permite localizar ese elemento
         * dentro del documento HTML.
         *
         * Guardamos la referencia en la constante
         * "menuPrincipal".
         */
        const menuPrincipal = document.getElementById("menu-principal");

        /*
         * ----------------------------------------------
         * 5. RECORRER LAS OPCIONES PRINCIPALES DEL MENÚ|
         * ----------------------------------------------
         *
         * forEach() permite recorrer cada elemento del arreglo.
         *
         * La variable "item" representa una opción del menú
         * en cada vuelta del recorrido.
         *
         * Por ejemplo:
         *
         * Primera vuelta:
         * item = Inicio
         *
         * Segunda vuelta:
         * item = Productos
         *
         * Tercera vuelta:
         * item = Servicios
         *
         * etc.
         */
        datos.forEach(item => {

            /*
             * --------------------------
             * 6. CREAR EL ELEMENTO <li>|
             * --------------------------
             *
             * createElement() permite crear un elemento HTML
             * desde JavaScript.
             *
             * En este caso creamos:
             *
             * <li></li>
             */
            const elemento = document.createElement("li");


            /*
             * -------------------------
             * 7. CREAR EL ELEMENTO <a>|
             * -------------------------
             *
             * Cada opción del menú será un enlace.
             *
             * Creamos:
             *
             * <a></a>
             */
            const enlace = document.createElement("a");

            /*
             * -------------------------------
             * 8. ASIGNAR EL TEXTO DEL ENLACE|
             * -------------------------------
             *
             * item.nombre contiene el nombre de la opción
             * obtenido desde menu.json.
             *
             * Ejemplo:
             *
             * "nombre": "Inicio"
             *
             * Por lo tanto:
             *
             * enlace.textContent
             *
             * tendrá como resultado:
             *
             * Inicio
             */
            enlace.textContent = item.nombre;

            /*
             * ---------------------------------
             * 9. ASIGNAR EL DESTINO DEL ENLACE|
             * ---------------------------------
             *
             * item.enlace contiene el destino definido
             * en menu.json.
             *
             * Ejemplo:
             *
             * "enlace": "#inicio"
             *
             * El resultado será equivalente a:
             *
             * <a href="#inicio">Inicio</a>
             */
            enlace.href = item.enlace;

            /*
             * -----------------------------------
             * 10. COLOCAR EL <a> DENTRO DEL <li>|
             * -----------------------------------
             *
             * appendChild() agrega un elemento como hijo
             * de otro elemento.
             *
             * La estructura resultante será:
             *
             * <li>
             *     <a>Inicio</a>
             * </li>
             */
            elemento.appendChild(enlace);

            /*
             * -----------------------------------
             * 11. COMPROBAR SI EXISTE UN SUBMENÚ|
             * -----------------------------------
             *
             * Algunas opciones del menú tienen una propiedad
             * llamada "submenu" en menu.json.
             *
             * Ejemplo:
             *
             * {
             *     "nombre": "Productos",
             *     "enlace": "#productos",
             *     "submenu": [...]
             * }
             *
             * Si item.submenu existe, ejecutaremos el código
             * que se encuentra dentro del if.
             */
            if (item.submenu) {

                /*
                 * ------------------------------
                 * 12. CREAR EL <ul> DEL SUBMENÚ|
                 * ------------------------------
                 *
                 * Creamos un nuevo elemento <ul>.
                 *
                 * Este será el contenedor de las opciones
                 * secundarias.
                 */
                const subMenu = document.createElement("ul");

                /*
                 * --------------------------------------
                 * 13. RECORRER LAS OPCIONES DEL SUBMENÚ|
                 * --------------------------------------
                 *
                 * item.submenu es otro arreglo de objetos.
                 *
                 * Por ejemplo:
                 *
                 * "submenu": [
                 *     {
                 *         "nombre": "Categorías",
                 *         "enlace": "#categorias"
                 *     },
                 *     {
                 *         "nombre": "Ofertas",
                 *         "enlace": "#ofertas"
                 *     }
                 * ]
                 *
                 * Utilizamos nuevamente forEach() para
                 * recorrer cada opción secundaria.
                 */
                item.submenu.forEach(subItem => {

                    /*
                     * ------------------------------
                     * 14. CREAR EL <li> DEL SUBMENÚ|
                     * ------------------------------
                     */
                    const subElemento = document.createElement("li");

                    /*
                     * -----------------------------
                     * 15. CREAR EL <a> DEL SUBMENÚ|
                     * -----------------------------
                     */
                    const subEnlace = document.createElement("a");

                    /*
                     * -----------------------------------
                     * 16. ASIGNAR EL TEXTO DEL SUBENLACE|
                     * -----------------------------------
                     *
                     * subItem.nombre contiene el nombre de
                     * la opción secundaria.
                     */
                    subEnlace.textContent = subItem.nombre;

                    /*
                     * -------------------------------------
                     * 17. ASIGNAR EL DESTINO DEL SUBENLACE|
                     * -------------------------------------
                     *
                     * subItem.enlace contiene el destino
                     * definido en menu.json.
                     */
                    subEnlace.href = subItem.enlace;

                    /*
                     * -----------------------------------
                     * 18. COLOCAR EL <a> DENTRO DEL <li>|
                     * -----------------------------------
                     *
                     * Resultado:
                     *
                     * <li>
                     *     <a>Categorías</a>
                     * </li>
                     */
                    subElemento.appendChild(subEnlace);

                    /*
                     * -------------------------------
                     * 19. AGREGAR EL <li> AL SUBMENÚ|
                     * -------------------------------
                     *
                     * Cada opción secundaria se agrega al
                     * <ul> que creamos anteriormente.
                     */
                    subMenu.appendChild(subElemento);

                });

                /*
                 * ---------------------------------------------
                 * 20. AGREGAR EL SUBMENÚ AL ELEMENTO PRINCIPAL|
                 * ---------------------------------------------
                 *
                 * El submenú se coloca dentro del <li>
                 * correspondiente a la opción principal.
                 *
                 * La estructura resultante será:
                 *
                 * <li>
                 *     <a>Productos</a>
                 *
                 *     <ul>
                 *         <li>
                 *             <a>Categorías</a>
                 *         </li>
                 *         <li>
                 *             <a>Ofertas</a>
                 *         </li>
                 *         ...
                 *     </ul>
                 * </li>
                 */
                elemento.appendChild(subMenu);
            }

            /*
             * ----------------------------------------
             * 21. AGREGAR LA OPCIÓN AL MENÚ PRINCIPAL|
             * ----------------------------------------
             *
             * Finalmente agregamos el <li> completo al
             * <ul id="menu-principal">.
             *
             * Esto hace que el elemento creado mediante
             * JavaScript pase a formar parte de la página.
             */
            menuPrincipal.appendChild(elemento);
        });
    }).catch(error => {

    /*
     * Si ocurre un error durante la carga del archivo JSON
     * o durante el procesamiento de los datos, se mostrará
     * información en la consola del navegador.
     */
    console.error("Error al cargar el menú:", error);

});