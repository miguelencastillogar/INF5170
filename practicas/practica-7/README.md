# Práctica 7. Crear un Formulario con Acceso a Base de Datos

**Asignatura:** INF5170 — Laboratorio de Lenguaje de Programación III  
**Proyecto:** AMVERFU — Gestión de Productos  
**Tecnologías:** HTML5, CSS3, JavaScript, Supabase y PostgreSQL.

---

## 1. Descripción del proyecto

AMVERFU — Gestión de Productos es una aplicación web que permite administrar productos mediante un formulario conectado a una base de datos relacional.

El proyecto se desarrolla como parte de la Práctica 7 de INF5170, cuyo objetivo es implementar las operaciones básicas de creación, consulta, actualización y eliminación de registros, conocidas como CRUD.

La aplicación utiliza Supabase como servicio de base de datos y GitHub Pages para publicar el frontend y permitir el acceso desde Internet.

## 2. Objetivo general

Desarrollar una aplicación web sencilla que permita gestionar productos mediante un formulario conectado a una base de datos PostgreSQL.

### Objetivos específicos

- Registrar productos nuevos.
- Consultar los productos almacenados.
- Modificar los datos de productos existentes.
- Eliminar productos con confirmación previa.
- Buscar productos por nombre.
- Aplicar herramientas de inteligencia artificial como apoyo al desarrollo y las pruebas.
- Publicar el código fuente en un repositorio público de GitHub.

## 3. Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la interfaz y formulario. |
| CSS3 | Diseño visual y adaptación a diferentes pantallas. |
| JavaScript | Validaciones, eventos y operaciones CRUD. |
| Supabase | Servicio de acceso a la base de datos mediante su API. |
| PostgreSQL | Almacenamiento relacional de los productos. |
| GitHub | Control de versiones y alojamiento del código fuente. |
| GitHub Pages | Publicación del frontend estático. |
| ChatGPT | Apoyo en el diseño, la programación, las explicaciones técnicas y las pruebas. |
| Visual Studio Code y Live Server | Edición y ejecución local durante el desarrollo. |

## 4. Estructura del proyecto

```text
practica-7/
├── practica-7.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

### Descripción de los archivos

- **practica-7.html:** contiene el formulario, los campos de entrada y la tabla de productos.
- **css/styles.css:** define los colores, la distribución, los botones, la tabla y los estilos adaptables.
- **js/app.js:** inicializa la conexión con Supabase y gestiona las operaciones CRUD y la búsqueda.
- **README.md:** documenta el propósito, las tecnologías, la configuración y el funcionamiento de la aplicación.

## 5. Diseño de la base de datos

La aplicación utiliza una tabla denominada `productos`, creada en el esquema `public` de PostgreSQL.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | BIGINT | Identificador único autogenerado. |
| `nombre` | VARCHAR(100) | Nombre del producto. |
| `precio` | NUMERIC(10,2) | Precio del producto. |
| `cantidad` | INTEGER | Cantidad disponible. |
| `creado_en` | TIMESTAMPTZ | Fecha y hora de creación del registro. |

El identificador `id` es la clave primaria. El nombre es obligatorio y la base de datos impide almacenar precios o cantidades negativos.

## 6. Funcionalidades implementadas

### 6.1. Registrar productos

El usuario introduce el nombre, el precio y la cantidad disponible. La aplicación valida los datos y envía el registro a Supabase.

### 6.2. Consultar productos

La aplicación consulta los registros almacenados y los presenta en una tabla ordenada por identificador.

### 6.3. Modificar productos

El botón **Editar** carga los datos del producto seleccionado en el formulario. Al guardar los cambios, se actualiza el registro existente.

### 6.4. Eliminar productos

El botón **Eliminar** solicita confirmación antes de ejecutar la operación. Si el usuario confirma, el registro se elimina de la base de datos.

### 6.5. Buscar productos

El campo de búsqueda permite filtrar los productos por nombre, sin distinguir entre mayúsculas y minúsculas.

## 7. Configuración de Supabase

Para utilizar la aplicación se necesita un proyecto de Supabase con la tabla `productos` y las políticas de seguridad configuradas.

En el archivo `js/app.js` se establecen los datos de conexión:

```javascript
const SUPABASE_URL = "TU_PROJECT_URL";
const SUPABASE_KEY = "TU_CLAVE_PUBLICA";
```

Estos valores deben sustituirse por la URL del proyecto y su clave pública `publishable` o la clave heredada `anon`, según la configuración del proyecto.

La aplicación utiliza la biblioteca oficial de Supabase para JavaScript v2, cargada mediante CDN desde el archivo HTML.

### Seguridad

La tabla tiene habilitada la seguridad a nivel de fila (RLS). Para esta práctica se han configurado políticas que permiten a visitantes sin autenticación consultar, insertar, modificar y eliminar productos.

**Advertencia:** este esquema de permisos es adecuado únicamente para una demostración con datos ficticios. Cualquier visitante puede modificar o eliminar registros. Para una aplicación real se recomienda implementar autenticación, limitar los permisos y establecer políticas más restrictivas.

No se deben publicar contraseñas de la base de datos, claves secretas ni claves `service_role` en el frontend o en GitHub.

## 8. Ejecución local

Para ejecutar la aplicación durante el desarrollo:

1. Clonar o descargar el repositorio de GitHub.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Configurar la URL y la clave pública de Supabase en `js/app.js`.
4. Verificar que la tabla y las políticas de acceso estén configuradas correctamente.
5. Abrir `practica-7.html` mediante Live Server.
6. Probar las operaciones de registro, consulta, modificación, eliminación y búsqueda.

Se necesita conexión a Internet para acceder al servicio de Supabase.

## 9. Publicación en GitHub Pages

GitHub Pages permite publicar los archivos estáticos de la aplicación. El frontend utiliza la API de Supabase para acceder a la base de datos alojada.

Para publicar la aplicación:

1. Guardar todos los archivos de la práctica en el repositorio público de GitHub.
2. Verificar que el frontend utilice la URL y la clave pública correctas.
3. Configurar GitHub Pages para publicar desde la rama y la carpeta correspondientes.
4. Comprobar que el archivo `practica-7.html` sea accesible mediante la URL pública.
5. Probar las operaciones CRUD desde la versión publicada.

GitHub Pages no ejecuta un servidor backend propio; en esta solución, el acceso a la base de datos se realiza mediante Supabase.

## 10. Pruebas funcionales

Las pruebas de la aplicación deben verificar los siguientes casos:

| Prueba | Resultado esperado |
|---|---|
| Registrar un producto válido | El producto se guarda y aparece en la tabla. |
| Consultar los productos | Se muestran los registros almacenados. |
| Modificar un producto | Los cambios se guardan sin crear otro registro. |
| Cancelar una eliminación | El producto permanece almacenado. |
| Confirmar una eliminación | El producto desaparece de la tabla y de la base de datos. |
| Buscar por nombre | Se muestran las coincidencias encontradas. |
| Buscar un producto inexistente | Se informa que no hay coincidencias. |
| Introducir datos inválidos | La aplicación impide el envío y muestra un mensaje. |

## 11. Uso de inteligencia artificial

ChatGPT se utilizó como herramienta de apoyo durante el desarrollo de la práctica para:

- Organizar la estructura de archivos.
- Elaborar el formulario y sus estilos.
- Explicar la conexión entre JavaScript, Supabase y PostgreSQL.
- Implementar las operaciones CRUD.
- Revisar las validaciones y los posibles errores.
- Preparar la documentación técnica.

El código debe ser revisado, ejecutado y validado por el estudiante para comprobar su funcionamiento y comprender las decisiones técnicas utilizadas.

## 12. Conclusión

El desarrollo de AMVERFU — Gestión de Productos permite aplicar los conceptos fundamentales de la programación web y el acceso a bases de datos relacionales.

La práctica integra HTML, CSS y JavaScript con PostgreSQL mediante Supabase, y demuestra cómo realizar operaciones CRUD desde una interfaz web.

Además, el uso de GitHub y GitHub Pages facilita la publicación del código fuente y el acceso al frontend para fines académicos.

---

**Proyecto académico:** INF5170 — Práctica 7  
**Nombre de la aplicación:** AMVERFU — Gestión de Productos