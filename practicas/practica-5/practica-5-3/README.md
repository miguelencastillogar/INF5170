# Práctica 5.3 — Pruebas de Performance

## AMVERFU — Explorador Pokémon

### INF5170 — Laboratorio de Lenguaje de Programación III

---

## 1. Descripción

En esta práctica se realizaron pruebas de rendimiento sobre una API pública utilizada por la aplicación **AMVERFU — Explorador Pokémon**, con el propósito de evaluar su comportamiento al recibir múltiples solicitudes.

La herramienta utilizada para las pruebas fue **Apache JMeter 5.6.3**.

El servicio evaluado fue **PokéAPI**, utilizando una solicitud HTTP GET para consultar la información correspondiente al Pokémon Pikachu.

---

## 2. Objetivo

El objetivo de esta práctica es comprender y aplicar pruebas de performance sobre un servicio web, evaluando aspectos como:

- Tiempo de respuesta.
- Cantidad de solicitudes ejecutadas.
- Porcentaje de errores.
- Throughput.
- Variabilidad de los tiempos de respuesta.
- Comportamiento del servicio ante diferentes cantidades de usuarios virtuales.

---

## 3. Aplicación y servicio utilizado

### Aplicación

**AMVERFU — Explorador Pokémon**

AMVERFU fue utilizada previamente en las prácticas del curso como aplicación web para el consumo de servicios relacionados con Pokémon.

### API evaluada

**PokéAPI**

Endpoint utilizado:

```text
GET https://pokeapi.co/api/v2/pokemon/pikachu