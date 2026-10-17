
/*
 * namespace: Organiza las clases relacionadas dentro del proyecto.
 * 
 * Por tanto, Define el espacio de nombres al que pertenece este controlador,
 * siguiendo la organización del proyecto.
 */
namespace practica_9_api.Services;

/**
 * Contiene la lógica matemática para validar una cédula dominicana
 * mediante el algoritmo del módulo 10.
 */
public static class ValidadorCedula // Declara una clase estática que puede utilizarse sin crear objetos.
{
    /*
     * Recibe la cédula, Comprueba el formato de la cédula, verifica
     * su dígito de control y devuelve un resultado booleano.
     * 
     * @param cedula Cédula de 11 dígitos, recibida como texto.
     * @return True si supera la validación matemática; false en caso contrario.
     */
    public static bool EsValida(string cedula)
    {
        // Rechaza valores vacíos o nulos.
        if (string.IsNullOrWhiteSpace(cedula))
        {
            return false; // No se puede validar una entrada vacía.
        }

        // Comprueba que la cédula tenga exactamente 11 caracteres.
        if (cedula.Length != 11)
        {
            return false; // Una longitud diferente no cumple el formato esperado.
        }

        // Comprueba que todos los caracteres sean dígitos numéricos.
        if (!cedula.All(char.IsDigit))
        {
            return false; // Rechaza letras, espacios y otros caracteres.
        }

        // Acumula los resultados de las multiplicaciones.
        int suma = 0;

        // Recorre los primeros diez dígitos para calcular el dígito verificador.
        for (int i = 0; i < 10; i++)
        {
            // Convierte el carácter actual en su valor numérico.
            int digito = cedula[i] - '0';

            // Alterna los multiplicadores 1 y 2, empezando por 1.
            int multiplicador = (i % 2 == 0) ? 1 : 2;

            // Multiplica el dígito por el multiplicador correspondiente.
            int producto = digito * multiplicador;

            // Si el producto supera 9, resta 9 para sumar sus dígitos.
            if (producto > 9)
            {
                producto -= 9;
            }

            // Agrega el producto ajustado a la suma acumulada.
            suma += producto;
        }

        // Calcula el dígito verificador esperado entre 0 y 9.
        int digitoVerificador = (10 - (suma % 10)) % 10;

        // Convierte el undécimo carácter en un número.
        int ultimoDigito = cedula[10] - '0';

        // La cédula supera el algoritmo si ambos dígitos coinciden.
        return digitoVerificador == ultimoDigito;
    }
}