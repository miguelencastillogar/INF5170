/**
 * using: Permite utilizar tipos definidos en otro espacio de nombres.
 * 
 * Microsoft.AspNetCore.Mvc:
 * 
 * Importa las herramientas de ASP.NET Core necesarias para crear controladores y
 * gestionar solicitudes HTTP.
 */
using Microsoft.AspNetCore.Mvc;
/*
 * Permite utilizar la clase que implementa el algoritmo del módulo 10.
 */
using practica_9_api.Services;

/*
 * namespace: Organiza las clases relacionadas dentro del proyecto.
 * 
 * Por tanto, Define el espacio de nombres al que pertenece este controlador,
 * siguiendo la organización del proyecto.
 */
namespace practica_9_api.Controllers;

/*
 * Identifica esta clase como un controlador de API y habilita 
 * comportamientos específicos, como la validación automática de
 * ciertos datos de entrada.
 */
[ApiController]

/*
 * Define la ruta base del controlador. [controller] se sustituye
 * por el nombre de la clase sin el sufijo "Controller".
 * Por tanto, la ruta base de este controlador será /api/Cedulas.
 */
[Route("api/[controller]")]

/*
 * Declara el controlador y hereda de ControllerBase para
 * disponer de funcionalidades de respuesta HTTP. 
 */
public class CedulasController : ControllerBase
{
    /*
     * HttpPost("validar"): Define una operación que responde a solicitudes HTTP POST en la ruta /api/Cedulas/validar.
     * 
     * [FromBody]: Indica que los datos se reciben desde el cuerpo de la solicitud.
     * 
     * SolicitudValidacion: Representa los datos que recibirá la API.
     * 
     * IActionResult: Permite devolver diferentes tipos de respuestas HTTP:
     *   
     *  *-) BadRequest(...): Devuelve HTTP 400 cuando la entrada no cumple el formato requerido.
     *  *-) Ok(...): Devuelve HTTP 200 cuando la solicitud se procesa correctamente.
     *  *-) All(char.IsDigit): Comprueba que todos los caracteres sean dígitos.
     */
    [HttpPost("validar")]
    public IActionResult Validar([FromBody] SolicitudValidacion solicitud)
    {
        // Comprueba si el objeto recibido existe y si la cédula contiene exactamente 11 dígitos.
        if (solicitud == null || string.IsNullOrWhiteSpace(solicitud.Cedula) || solicitud.Cedula.Length != 11 || !solicitud.Cedula.All(char.IsDigit))
        {
            // Devuelve el código HTTP 400 (Bad Request) y un mensaje en formato JSON.
            return BadRequest(
                new
                {
                    mensaje = "Debe proporcionar una cédula compuesta por exactamente 11 dígitos."
                }
            );
        }

        // Ejecuta el algoritmo del módulo 10 mediante nuestra clase de validación.
        bool esValida = ValidadorCedula.EsValida(solicitud.Cedula);

        // Devuelve HTTP 200 y un resultado JSON con la conclusión matemática.
        return Ok(
            new
            {
                cedula = solicitud.Cedula,
                valida = esValida,
                mensaje = esValida ? "La cédula cumple el algoritmo del módulo 10." : "La cédula no cumple el algoritmo del módulo 10."
            }
        );
    }
}

// Representa los datos que el cliente debe enviar al endpoint.
public class SolicitudValidacion
{
    // Almacena la cédula recibida en el cuerpo de la solicitud JSON.
    public string Cedula { get; set; } = string.Empty;
}
