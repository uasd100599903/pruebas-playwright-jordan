# Práctica 5.1 - Pruebas automatizadas de UI y API con Playwright

Nombre: Jordany Sosa
Matrícula: 100599903
Sección: INF5170-1
Asignatura: Lab Lenguaje de Programación III

## Aplicación
Para esta práctica usé el menú dinámico del Banco Futuro que hice en la tarea anterior (`index.html`, `app.js`, `menu.json` y `estilos.css`). El menú se carga desde `menu.json` y tiene un formulario para agregar y eliminar opciones.

## Herramienta
Playwright con JavaScript. Se ejecuta en Chromium.

## Cómo ejecutarlo
1. Instalar Node.js.
2. En la carpeta del proyecto:
```
npm install
npx playwright install chromium
npm test
npm run reporte
```
El servidor local (`http-server`, puerto 3000) se inicia solo al correr las pruebas.

## Pruebas de interfaz (`tests/ui.spec.js`)
1. El menú se carga desde `menu.json` (6 opciones principales).
2. El submenú se abre y muestra el contenido de la opción.
3. Navegación entre secciones al hacer clic en el menú.
4. La opción externa abre otra página en una pestaña nueva.
5. El formulario agrega una opción nueva al menú.
6. El formulario valida el ID repetido y el enlace incorrecto.
7. El botón Eliminar quita una opción del menú.

## Pruebas de API (`tests/api.spec.js`)
API pública: JSONPlaceholder (https://jsonplaceholder.typicode.com) y mi propio `menu.json`.

| Prueba | Código esperado | Qué se valida del JSON |
|---|---|---|
| GET /posts/1 | 200 | id, userId, title y body |
| GET /posts/99999 | 404 | no existe |
| GET /users | 200 | lista de 10 usuarios con correo |
| POST /posts | 201 | devuelve el título enviado y un id |
| GET /menu.json (API propia) | 200 | lista `menu` con 6 opciones |
| GET /no-existe.json | 404 | archivo que no existe |

## Evidencia
- `capturas/`: capturas de pantalla de las pruebas de interfaz.
- `reporte/`: reporte HTML de Playwright (se abre con `npm run reporte`).
- `evidencia/`: capturas automáticas de cada prueba.
