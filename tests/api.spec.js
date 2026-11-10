const { test, expect } = require('@playwright/test');

const API = 'https://jsonplaceholder.typicode.com';

test('GET /posts/1 devuelve 200 y un JSON con los campos esperados', async ({ request }) => {
  const respuesta = await request.get(API + '/posts/1');
  expect(respuesta.status()).toBe(200);
  expect(respuesta.headers()['content-type']).toContain('application/json');

  const datos = await respuesta.json();
  expect(datos.id).toBe(1);
  expect(datos.userId).toBe(1);
  expect(typeof datos.title).toBe('string');
  expect(typeof datos.body).toBe('string');
});

test('GET /posts/99999 devuelve 404 porque no existe', async ({ request }) => {
  const respuesta = await request.get(API + '/posts/99999');
  expect(respuesta.status()).toBe(404);
  expect(respuesta.ok()).toBeFalsy();
});

test('GET /users devuelve 200 y una lista de 10 usuarios con correo', async ({ request }) => {
  const respuesta = await request.get(API + '/users');
  expect(respuesta.status()).toBe(200);

  const usuarios = await respuesta.json();
  expect(Array.isArray(usuarios)).toBeTruthy();
  expect(usuarios).toHaveLength(10);
  for (const usuario of usuarios) {
    expect(usuario.email).toContain('@');
  }
});

test('POST /posts devuelve 201 y el dato que se envió', async ({ request }) => {
  const respuesta = await request.post(API + '/posts', {
    data: { title: 'prueba', body: 'hola desde playwright', userId: 1 }
  });
  expect(respuesta.status()).toBe(201);

  const datos = await respuesta.json();
  expect(datos.title).toBe('prueba');
  expect(datos.userId).toBe(1);
  expect(datos.id).toBeGreaterThan(0);
});

test('la API propia /menu.json devuelve 200 y la lista del menú', async ({ request }) => {
  const respuesta = await request.get('/menu.json');
  expect(respuesta.status()).toBe(200);

  const datos = await respuesta.json();
  expect(Array.isArray(datos.menu)).toBeTruthy();
  expect(datos.menu.length).toBe(6);
  expect(datos.menu[0].id).toBe('inicio');
  expect(datos.menu[1].hijos).toHaveLength(2);
});

test('pedir un archivo que no existe en el servidor devuelve 404', async ({ request }) => {
  const respuesta = await request.get('/no-existe.json');
  expect(respuesta.status()).toBe(404);
});
