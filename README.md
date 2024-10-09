# Conserbot
[![Static Badge](https://img.shields.io/badge/discord.js-14.16.3-blue?link=https%3A%2F%2Fdiscord.js.org%2F)](https://discord.js.org)

Bot oficial del servidor de Discord de la Conservera.

## Conserbot puede:
- [x] [**Asignar roles**](#Roles)
- [x] [**Horarios de clases**](#Horarios)
- [x] [**Fechas de exámenes y tareas**](#Fechas)
- [x] [**Dar respuestas técnicas a cualquier pregunta**](#Respuestas)
- [ ] [**Hacer exámenes por ti**](#Exámenes)

## Roles
Consigue el rol de tu grado (DAW/DAM).
```
/role get @rol
```
> Conserbot: **@Tú** está estudiando **@rol**

## Horarios
Recibe información de tu próxima clase.
```
/class
```
> Conserbot: La proxima clase de **DAW** es **Bases de Datos** y empeiza en 5 días, 17 horas y 15 minutos el **Lunes** a las **17:45**

#Fechas
Infórmate de fechas de exámenes y tareas.
```
/deadlines see
```
> Conserbot: **Deadlines:**
**Listening** de Inglés Profesional el 2024/11/9 a las 16:30
**Examen** de Bases de Datos el 2024/11/11 a las 21:22
**Prueba** de Entornos de desasrrollo el 2024/12/11 a las 5:15

## Respuestas
Responde cualquier pregunta relacionada con el grado.
Integración con la API de **ChatGPT**.
```
/ask Qué es React?
```
> Conserbot: React es una biblioteca de JavaScript de código abierto, desarrollada por Facebook, que se utiliza para construir interfaces de usuario, principalmente para aplicaciones web de una sola página. Permite crear componentes reutilizables que facilitan la gestión del estado y la actualización eficiente del DOM (Document Object Model)...

## Exámenes
😔