
# Etapa 1: utiliza el SDK de .NET 10 para compilar la API.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Define el directorio de trabajo dentro del contenedor.
WORKDIR /src

# Copia el archivo del proyecto para restaurar sus dependencias.
COPY practica-9-api/practica-9-api.csproj practica-9-api/

# Descarga las dependencias declaradas por el proyecto.
RUN dotnet restore practica-9-api/practica-9-api.csproj

# Copia el código fuente del backend al contenedor.
COPY practica-9-api/ practica-9-api/

# Establece el directorio donde se encuentra el proyecto.
WORKDIR /src/practica-9-api

# Compila y publica la API en modo Release.
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: utiliza el runtime de ASP.NET Core 10.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

# Define el directorio de ejecución de la aplicación.
WORKDIR /app

# Copia la publicación final desde la etapa de compilación.
COPY --from=build /app/publish .

# Configura el puerto HTTP que utilizará el servidor.
ENV ASPNETCORE_HTTP_PORTS=10000

# Documenta el puerto que utilizará el servicio.
EXPOSE 10000

# Inicia la API cuando arranque el contenedor.
ENTRYPOINT ["dotnet", "practica-9-api.dll"]
