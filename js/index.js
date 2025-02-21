let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 🔹 Actualizar el contador del carrito
function actualizarCarrito() {
  document.getElementById("cantidad-carrito").textContent = carrito.length;
}

// 🔹 Mostrar productos en la pantalla
function mostrarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  lista.forEach((producto) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    let oferta = producto.precioOferta
      ? `<p>Oferta: $${producto.precioOferta}</p>`
      : "";
    let ahorrado = producto.precioOferta
      ? `<p class="ahorrado">Ahorras: $${
          producto.precio - producto.precioOferta
        }</p>`
      : "";

    tarjeta.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>Marca: ${producto.marca}</p>
      <p>Precio: $${producto.precio}</p>
      ${oferta}
      ${ahorrado}
      <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
    `;

    contenedor.appendChild(tarjeta);
  });

  // Agregar eventos a los botones "Agregar al carrito"
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", () => {
      agregarAlCarrito(boton.dataset.id);
    });
  });
}

// 🔹 Filtrar productos según búsqueda
function filtrarProductos() {
  const criterio = document.getElementById("busqueda").value.toLowerCase();
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(criterio) ||
      producto.marca.toLowerCase().includes(criterio)
  );
  mostrarProductos(productosFiltrados);
}

// 🔹 Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((prod) => prod.id === id);
  if (producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarCarrito();
  }
}

// 🔹 Mostrar productos en la pantalla del carrito
function mostrarCarrito() {
  const contenedorCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");

  contenedorCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");

    let precioFinal = producto.precioOferta || producto.precio;
    total += precioFinal;

    item.innerHTML = `
      <p><strong>${producto.nombre}</strong> - $${precioFinal}</p>
      <button class="eliminar-item" data-index="${index}">❌</button>
    `;

    contenedorCarrito.appendChild(item);
  });

  totalCarrito.textContent = total;

  document.querySelectorAll(".eliminar-item").forEach((boton) => {
    boton.addEventListener("click", () => {
      eliminarDelCarrito(boton.dataset.index);
    });
  });

  document.getElementById("pantalla-carrito").style.display = "block";
}




function vaciarCarrito(){
  try {

    carrito = [];
    localStorage.clear();
    mostrarCarrito();
    Swal.fire({
      title: "Se limpio el carrito correctamente!",
      icon: "success",
      draggable: true
    });
  }
  catch (error){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Se genero un error al intentar vaciar el carrito.",
      footer: '<a href="#">Contactese con soporte</a>'
    });
  }
 
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
  mostrarCarrito();
}
async function getProductosAPI() {
  try {
    const url = "./js/api.json";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error al cargar el archivo: ${response.statusText} : ${url}`
      );
    }
    productos = await response.json();

    return productos;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "excepcion al leer API: " + error,
      footer: '<a href="#">Contactese con soporte</a>'
    });
    return [];
  } finally {
    
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: "Termino la ejecuacion del metodo: 'buscarProducto' ",
    //   footer: '<a href="#">Contactese con soporte</a>'
    // });
  }
}

function cerrarCarrito() {
  document.getElementById("pantalla-carrito").style.display = "none";
}

document.getElementById("buscar").addEventListener("click", filtrarProductos);
document
  .getElementById("ver-carrito")
  .addEventListener("click", mostrarCarrito);
  document
  .getElementById("vaciar-carrito")
  .addEventListener("click", vaciarCarrito);
  
document
  .getElementById("cerrar-carrito")
  .addEventListener("click", cerrarCarrito);

mostrarProductos(productos);
actualizarCarrito();

//Ejecuto la siguiente linea para cargar los productos al refrescar la pantalla
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await getProductosAPI();
    filtrarProductos();
  
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Se genero un error al intentar cargar los productos",
      footer: '<a href="#">Contactese con soporte</a>'
    });
  }
});
