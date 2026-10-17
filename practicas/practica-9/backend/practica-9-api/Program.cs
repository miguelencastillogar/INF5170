
var builder = WebApplication.CreateBuilder(args); // Crea el constructor de la aplicación web.

// Registra los controladores que atenderán las solicitudes HTTP.
builder.Services.AddControllers();

// Registra la política CORS para controlar qué sitios pueden consumir la API.
builder.Services.AddCors(options =>
{
    // Define una política llamada FrontendLocal.
    options.AddPolicy("FrontendLocal", policy =>
    {
        // Permite el frontend local y el portafolio publicado en GitHub Pages.
        policy.WithOrigins(
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://miguelencastillogar.github.io"
        )

        // Permite las solicitudes HTTP necesarias para la aplicación.
        .WithMethods("GET", "POST", "OPTIONS")

        // Permite enviar datos en formato JSON.
        .WithHeaders("Content-Type");
    });
});

// Construye la aplicación con los servicios registrados.
var app = builder.Build();

// Aplica la política CORS a las solicitudes entrantes.
app.UseCors("FrontendLocal");

// Habilita la comprobación de autorización.
app.UseAuthorization();

// Conecta las rutas de los controladores con la aplicación.
app.MapControllers();

// Inicia la aplicación web.
app.Run();