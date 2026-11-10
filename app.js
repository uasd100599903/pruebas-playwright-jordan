let menu = [];

fetch('menu.json')
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (datos) {
    menu = datos.menu;
    dibujarTodo();
    mostrarContenido(menu[0]);
  })
  .catch(function () {
    document.getElementById('contenido').textContent = 'No se pudo cargar menu.json';
  });

function buscarOpcion(lista, id) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === id) return lista[i];
    if (lista[i].hijos) {
      const encontrada = buscarOpcion(lista[i].hijos, id);
      if (encontrada) return encontrada;
    }
  }
  return null;
}

function eliminarOpcion(lista, id) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === id) {
      lista.splice(i, 1);
      return;
    }
    if (lista[i].hijos) eliminarOpcion(lista[i].hijos, id);
  }
}

function mostrarContenido(opcion) {
  document.getElementById('contenido').innerHTML = '';
  const titulo = document.createElement('h2');
  titulo.textContent = opcion.nombre;
  const parrafo = document.createElement('p');
  parrafo.textContent = opcion.texto || '';
  document.getElementById('contenido').appendChild(titulo);
  document.getElementById('contenido').appendChild(parrafo);
}

function crearOpcion(opcion) {
  const li = document.createElement('li');
  const enlace = document.createElement('a');
  enlace.href = opcion.enlace;
  enlace.textContent = (opcion.icono || '') + ' ' + opcion.nombre;
  li.appendChild(enlace);

  if (opcion.hijos && opcion.hijos.length > 0) {
    const sub = document.createElement('ul');
    for (let i = 0; i < opcion.hijos.length; i++) {
      sub.appendChild(crearOpcion(opcion.hijos[i]));
    }
    li.appendChild(sub);
  }

  enlace.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (opcion.enlace.startsWith('http')) {
      window.open(opcion.enlace, '_blank');
      return;
    }
    li.classList.toggle('abierto');
    mostrarContenido(opcion);
  };
  return li;
}

function dibujarLista(lista, nivel) {
  const ul = document.getElementById('admin');
  for (let i = 0; i < lista.length; i++) {
    const item = document.createElement('li');
    item.style.marginLeft = (nivel * 20) + 'px';
    item.textContent = lista[i].id + ' - ' + lista[i].nombre + ' ';
    const boton = document.createElement('button');
    boton.textContent = 'Eliminar';
    boton.onclick = (function (id) {
      return function () {
        eliminarOpcion(menu, id);
        dibujarTodo();
      };
    })(lista[i].id);
    item.appendChild(boton);
    ul.appendChild(item);
    if (lista[i].hijos) dibujarLista(lista[i].hijos, nivel + 1);
  }
}

function dibujarTodo() {
  const ul = document.getElementById('lista-menu');
  ul.innerHTML = '';
  for (let i = 0; i < menu.length; i++) {
    ul.appendChild(crearOpcion(menu[i]));
  }

  const select = document.getElementById('f-padre');
  select.innerHTML = '';
  select.add(new Option('Ninguno (opción principal)', ''));
  for (let i = 0; i < menu.length; i++) {
    select.add(new Option(menu[i].nombre, menu[i].id));
  }

  document.getElementById('admin').innerHTML = '';
  dibujarLista(menu, 0);
}

document.getElementById('formulario').onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('f-id').value.trim().toLowerCase();
  const nombre = document.getElementById('f-nombre').value.trim();
  const icono = document.getElementById('f-icono').value.trim();
  const enlace = document.getElementById('f-enlace').value.trim();
  const texto = document.getElementById('f-texto').value.trim();
  const padre = document.getElementById('f-padre').value;
  const mensaje = document.getElementById('mensaje');

  if (id === '' || nombre === '') {
    mensaje.textContent = 'El ID y el nombre son obligatorios.';
    return;
  }
  if (buscarOpcion(menu, id)) {
    mensaje.textContent = 'Ese ID ya existe, usa otro.';
    return;
  }
  if ((nombre + icono + texto + id).includes('<') || (nombre + icono + texto + id).includes('>')) {
    mensaje.textContent = 'No se permiten los símbolos < y >.';
    return;
  }
  const enlaceBueno = (enlace.startsWith('#') && enlace.length > 1) ||
    enlace.startsWith('http://') || enlace.startsWith('https://');
  if (!enlaceBueno) {
    mensaje.textContent = 'El enlace debe empezar con # o con http(s)://';
    return;
  }

  const nueva = { id: id, nombre: nombre, icono: icono, enlace: enlace, texto: texto };
  if (padre === '') {
    menu.push(nueva);
  } else {
    const opcionPadre = buscarOpcion(menu, padre);
    if (!opcionPadre.hijos) opcionPadre.hijos = [];
    opcionPadre.hijos.push(nueva);
  }

  mensaje.textContent = 'Opción agregada.';
  document.getElementById('formulario').reset();
  dibujarTodo();
};
