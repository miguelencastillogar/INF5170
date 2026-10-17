
# Etapa 1: utiliza el SDK de .NET 10 para compilar la API.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Define el directorio de trabajo dentro del contenedor.
WORKDIR /src

# Copia el archivo del proyecto desde su ubicación real en GitHub.
COPY practicas/practica-9/backend/practica-9-api/practica-9-api.csproj practica-9-api/

# Restaura las dependencias del proyecto.
RUN dotnet restore practica-9-api/practica-9-api.csproj

# Copia el código fuente del backend.
COPY practicas/practica-9/backend/practica-9-api/ practica-9-api/

# Establece el directorio del proyecto.
WORKDIR /src/practica-9-api

# Publica la aplicación en modo Release.
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Etapa 2: utiliza el runtime de ASP.NET Core 10.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

# Define el directorio de ejecución.
WORKDIR /app

# Copia los archivos publicados.
COPY --from=build /app/publish .

# Configura el puerto HTTP del contenedor.
ENV ASPNETCORE_HTTP_PORTS=10000

# Documenta el puerto de escucha.
EXPOSE 10000

# Inicia la API.
ENTRYPOINT ["dotnet", "practica-9-api.dll"]