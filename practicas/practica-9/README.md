# Práctica 9: Servicios Web

## 1. Información general

**Asignatura:** INF5170 – Laboratorio de Lenguaje de Programación III  
**Práctica:** 9 – Servicios Web  
**Aplicación:** Validador de Cédulas Dominicanas  
**Tecnologías:** HTML5, CSS3, JavaScript, ASP.NET Core Web API y Docker.

## 2. Objetivo

Desarrollar una aplicación web que permita introducir una cédula dominicana y comprobar si cumple el algoritmo matemático del módulo 10.

La práctica demuestra la comunicación entre un frontend web y un servicio web REST que recibe datos en formato JSON y devuelve una respuesta también en JSON.

## 3. Arquitectura de la solución

La aplicación se divide en dos componentes principales:

### Frontend

Desarrollado con HTML5, CSS3 y JavaScript.

Responsabilidades:

- Presentar el formulario de entrada de la cédula.
- Validar que el formato contenga exactamente 11 dígitos.
- Enviar la solicitud al backend mediante HTTP.
- Mostrar el resultado de la validación.
- Informar al usuario cuando ocurre un error de comunicación.

### Backend

Desarrollado con ASP.NET Core Web API sobre .NET 10.

Responsabilidades:

- Recibir las solicitudes de validación.
- Comprobar el formato de la cédula.
- Ejecutar el algoritmo del módulo 10.
- Devolver una respuesta JSON con el resultado.
- Aplicar las políticas CORS para controlar los orígenes autorizados.

## 4. Estructura del proyecto

```text
practica-9/
├── practica-9.html
├── README.md
├── css/
│   └── estilos.css
├── js/
│   └── app.js
└── backend/
    ├── Dockerfile
    └── practica-9-api/
        ├── Controllers/
        │   └── CedulasController.cs
        ├── Services/
        │   └── ValidadorCedula.cs
        ├── Program.cs
        ├── appsettings.json
        └── practica-9-api.csproj
```

## 5. Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| HTML5 | Estructura de la interfaz web. |
| CSS3 | Diseño visual y presentación de resultados. |
| JavaScript | Validación del formulario y comunicación con la API. |
| C# | Implementación de la lógica del backend. |
| ASP.NET Core Web API | Exposición del servicio REST. |
| .NET 10 | Plataforma de desarrollo y ejecución del backend. |
| Docker | Preparación del contenedor para el despliegue. |
| Git y GitHub | Control de versiones y alojamiento del código fuente. |
| GitHub Pages | Publicación del frontend. |
| Render | Plataforma prevista para alojar el backend. |

## 6. Endpoint del servicio web

El backend expone el siguiente endpoint:

**Método:** `POST`  
**Ruta:** `/api/Cedulas/validar`  
**Formato de entrada:** JSON  
**Formato de respuesta:** JSON

### Ejemplo de solicitud

```json
{
  "cedula": "00112345673"
}
```

### Ejemplo de respuesta

```json
{
  "cedula": "00112345673",
  "valida": true,
  "mensaje": "La cédula cumple el algoritmo del módulo 10."
}
```

El valor de `valida` indica si el número cumple el algoritmo matemático implementado.

## 7. Algoritmo de validación

El servicio utiliza un procedimiento basado en el módulo 10 para comprobar el dígito verificador.

El proceso consiste en:

1. Comprobar que la entrada contenga exactamente 11 dígitos numéricos.
2. Procesar los primeros diez dígitos utilizando multiplicadores alternos de 1 y 2.
3. Restar 9 a los productos superiores a 9.
4. Sumar los resultados obtenidos.
5. Calcular el dígito verificador esperado.
6. Compararlo con el último dígito de la cédula.

La validación del formato y el cálculo del dígito verificador son responsabilidades del backend. El frontend también comprueba el formato para ofrecer una mejor experiencia al usuario.

**Nota:** superar esta comprobación matemática no demuestra que una cédula haya sido emitida oficialmente ni verifica la identidad de su titular.

## 8. Ejecución local

### Requisitos

- .NET 10 SDK.
- Visual Studio Code u otro editor compatible.
- Un navegador web.
- Una extensión o servidor local para servir el frontend, como Live Server.

### Iniciar el backend

Desde PowerShell, ejecutar:

```powershell
cd C:\vsc\INF5170\practicas\practica-9\backend

dotnet run --project .\practica-9-api\practica-9-api.csproj
```

Durante las pruebas locales, la API escucha en:

`http://localhost:5173`

### Iniciar el frontend

Abrir `practica-9.html` mediante Live Server.

La dirección del frontend debe corresponder a uno de los orígenes autorizados en la política CORS del backend.

### Compilar el backend

Para comprobar que el proyecto compila correctamente:

```powershell
dotnet build .\practica-9-api\practica-9-api.csproj
```

## 9. Pruebas realizadas

Se han realizado las siguientes comprobaciones durante el desarrollo:

- Inicio de la API ASP.NET Core.
- Compilación satisfactoria del proyecto.
- Solicitud POST al endpoint de validación.
- Respuesta positiva para `00112345673`.
- Respuesta negativa para `00112345674`.
- Rechazo de entradas con un formato incorrecto.
- Comunicación satisfactoria entre el frontend local y el backend local.
- Restablecimiento de la vista al modificar la entrada después de mostrar un resultado anterior.

## 10. Seguridad y consideraciones técnicas

- La API comprueba el formato de la entrada antes de ejecutar el algoritmo.
- CORS limita los orígenes autorizados para las solicitudes del navegador; no sustituye la autenticación ni otras medidas de seguridad.
- La publicación definitiva debe utilizar HTTPS.
- La dirección local `localhost` solamente sirve para pruebas en el equipo donde se ejecuta el backend.
- El frontend público necesita una URL pública del backend para funcionar desde otros dispositivos.

## 11. Despliegue

La publicación del frontend se realizará mediante GitHub Pages.

El backend se preparará para su publicación mediante Docker en Render, utilizando una dirección HTTPS pública. Una vez desplegado, se actualizará la URL del servicio en `js/app.js` y se verificará la política CORS correspondiente.

**Estado:** el funcionamiento local está comprobado. La publicación pública y la prueba final desde GitHub Pages quedan pendientes de completar.

## 12. Conclusión

Esta práctica permite comprender la integración entre una interfaz web y un servicio REST desarrollado con ASP.NET Core Web API.

También permite aplicar conceptos de validación de datos, solicitudes HTTP, intercambio de información mediante JSON, configuración CORS, control de versiones y preparación de aplicaciones para su despliegue.