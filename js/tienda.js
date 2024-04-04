//Proyecto Final
let carrito = [];
// let instrumentos = [];
const instrumentos = [
  {id:1, nombre: "Yamaha RDP0F5 HOR Batería acústica Rydeen, Hot Red", precio: 37252.12, descripcion: "Juego de batería de 5 tambores. Color rojo candente" ,img: "bateriaAcustica1.jpg"  },
  {id:2, nombre: "RDP2F5 PB Batería acústica Rydeen, Plateado brillante Bombo 22", precio: 39524.41, descripcion: "Juego de batería de 5 tambores. Color plateado escarchado" , img: "bateriaAcustica2.jpg"  },
  {id:3, nombre: "DTX452K Bateria electrónica", precio: 70538.32, descripcion: "DTX452K Bateria electrónica" , img: "bateriaElectrica1.jpg"  },
  {id:4, nombre: "VAD103 Bateria electroacústica DESING KIT", precio: 203522.86, descripcion: "VAD103 Bateria electrónica" , img: "bateriaElectrica2.jpg"  },
  {id:5, nombre: "CCDU141620 Classics custom dual set", precio: 44174.93, descripcion: "Meinl Juegos de platillos" , img: "platillos1.jpg"  },
  {id:6, nombre: "CC-141620+18 Set de platillos Custom Classic (5)", precio: 43204.41, descripcion: "Meinl Custom Juegos de platillos" , img: "platillos2.jpg"  },
  {id:7, nombre: "TXR5AW Bolillos Forward 5A RAW", precio: 932.20, descripcion: "Bolillos y Brochas" , img: "accesorios1.png"  },
  {id:8, nombre: "MDH DRUM Almohadillas amortiguadoras de Miel", descripcion: "Apagadores DRUM HONEY DAMPER PADS" , precio: 710.81, img: "accesorios2.jpg"  },
] ;

// Inicializar conteoDescuento con el valor almacenado en localStorage (si existe)
let conteoDescuento = localStorage.getItem('conteoDescuento') ? parseInt(localStorage.getItem('conteoDescuento')) : 0;
const nombreUsuario = localStorage.getItem("nombreUsuario");

// Comando para mostrar el sweet alert de visita una sola vez.
if (!localStorage.getItem('primeraVisita')) {
  Swal.fire("¡¡Bienvenido " + nombreUsuario +  " a la mejor tienda de instrumentos musicales!! \n\nAquí encontrarás: \n\nBaterías acústicas, baterías eléctricas, platillos y accesorios. \n\nTodos al mejor precio del mercado. \n\n ¡¡Tenemos interesantes DESCUENTOS para aquellos que elijan 3 productos o más, así que...!! \n\n¡¡Ven y descúbrelo!!");
  localStorage.setItem('primeraVisita', 'true');
}

// fetch("../../proyectofinal-Martinez2/db/db.json")
//     .then(response => response.json())
//     .then(data => {
//         instrumentos = data;
//         crearHtml(instrumentos);
//     });
//fetch
//array de servicios en formato json consultado con fetch de manera local
// Función para mostrar productos
function mostrarProductos() {
  fetch("https://ambiorix565rd.github.io/db/data.json")
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text(); // Leer el cuerpo de la respuesta como texto
      })
      .then(text => {
          try {
              const data = JSON.parse(text); // Intentar parsear el texto como JSON
              instrumentos = data;
              crearHtml(instrumentos);
          } catch (error) {
              console.error('Error parsing JSON:', error);
              mostrarNotificacion("Error al cargar los productos. Por favor, intenta nuevamente más tarde.");
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
          mostrarNotificacion(`Error fetching data: ${error.message}`);
      });
}

   // Local Storage
//Verificar si hay un producto en el carrito
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
 mostrarCarrito();  // Actualizar el HTML del carrito
} 

// Agregar productos al carrito
function btnCarrito(id) {
  return new Promise((resolve, reject) => {
    // Buscar el producto en el array de instrumentos
    const producto = instrumentos.find(item => item.id === id);
    //verificamos y actualizamos al carrito
    if (producto) {
      carrito.push(producto);
      // Guardar el carrito en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));
      // Incrementar el conteo de descuento solo cuando se agrega un producto
      conteoDescuento += 1;
      localStorage.setItem('conteoDescuento', conteoDescuento.toString());
      mostrarCarrito();
      resolve();
    } else {
      reject("Producto no encontrado");
    }
  });
}

//Funcion para mostrar notificacion Toastify
function mostrarNotificacion(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000
  }).showToast();
}

// Modificación en el evento del botón agregar al carrito
async function btnAgregarCarrito(id) {
  //Manejar las respuesta del resultado de la promesa
  await btnCarrito(id)
      .then(() => {
          // Mostrar notificación Toastify
          mostrarNotificacion("Producto agregado al carrito!");
      })
      .catch(error => {
          console.error(error);
          mostrarNotificacion("Error al agregar producto al carrito.");
      });
}

//Funcion para quitar un producto del carrito.
function opcionEliminar(id) {
  // Asincronia para que tarde en reflejar la operacion realizada por el cliente con el boton eliminar carrito
  return new Promise((resolve, reject) => {
    // Busca el índice del producto con el id dado
    const index = carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
      // Para decrementar el valor de conteoDescuento
      conteoDescuento -= 1;
      localStorage.setItem('conteoDescuento', conteoDescuento.toString());
      carrito.splice(index, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      // Elimina el producto del array
      mostrarCarrito();
      resolve();
    } else {
      reject("Producto no encontrado");
    }
  });
}

// Modificación en el evento del botón eliminar del carrito
async function btnEliminarCarrito(id) {
  //Esto hace que espere a que se complete la funcion asincronica eliminar carrito antes de continuar
  await opcionEliminar(id)
      .then(() => {
        // Mostrar notificación Toastify
          mostrarNotificacion("Producto eliminado del carrito!");
      })
      .catch(error => {
          console.error(error);
          mostrarNotificacion("Error al eliminar producto del carrito.");
      });
}

//Para mostrar los productos del carrito en el html
function mostrarCarrito() {
  const carritoContenedor = document.getElementById("carritoContenedor");
  carritoContenedor.innerHTML = "";

  carrito.forEach(producto => {
      const { img, nombre, precio, id } = producto;

      const html = `
          <div class="carrito-item">
              <img src="../assets/img/${img}" alt="${nombre}" />
              <h4>${nombre}</h4>
              <p>RD$${precio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <button class="btn btn-primary" id="btneliminar" onclick="btnEliminarCarrito(${id})">Eliminar</button>
          </div>
      `;

      carritoContenedor.innerHTML += html;
  });
}

// Función para crear estructura html
function crearHtml(arr) {
  const cardInstrumento = document.getElementById("card-instrument-tienda")
  cardInstrumento.innerHTML = "";
  //validar qué pasa cuando no recibo ningun array
  let html;
  for (const el of arr) {
    const { img, nombre, precio, id, descripcion, } = el;

    html = `<div  class="card-instrument-tienda" data-aos="fade-right"
    data-aos-offset="100"
    data-aos-duration="1500"
    data-aos-easing="ease-in-sine">
      <img src="../assets/img/${img}" alt="${nombre}"/>
        <h3>${nombre}</h3>
        <p>
        ${descripcion}
        </p>
        <p><strong>RD$${precio.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></p>
        <div class="logo-button-shopp">
        <button class="btn btn-primary button-instrument-tienda logo-button-shopp" id="button-instrument-tienda" onclick="btnAgregarCarrito(${id})">Agregar al carrito <img src="../assets/img/shopping.svg" alt="logo-shopping" class="carrito-logo"></button>
        </div>
    </div>`;
    //se la agrego al contenedor
    cardInstrumento.innerHTML += html;
  }
}

//Funcion para que funcione el local Storage
function mostrarProductos(){
  const cardInstrumento = document.getElementById("card-instrument-tienda")
  cardInstrumento.innerHTML = "";
  crearHtml(instrumentos);
}

// Llamar a la función mostrarProductos al cargar la página
mostrarProductos();


const inputs =  document.querySelectorAll('input')
const inputSearch = inputs [0];
//buscador de servicios por barra de busqueda de la pagina
inputSearch.addEventListener('keyup', ()=>{
  const encontrado = filtrarInstrumento(instrumentos, inputSearch.value);
  crearHtml(encontrado);
});

//Funcion de búsqueda
function filtrarInstrumento(arr, filtro) {
  const filtrado = arr.filter((el) => {
    return el.nombre.toLowerCase().includes(filtro.toLowerCase());
  });
  return filtrado;
}

//Para hacer funcionar el boton de calcular el total
const btnCalcularCarrito = document.querySelector("#btnCalcularCarrito");

btnCalcularCarrito.addEventListener("click", ()=>{
    let total, impuesto, subtotal, descuento, descuentoFinal;
    total = 0;

    carrito.forEach(producto => {
        total += producto.precio;
    });

    impuesto = total * 0.18;
    subtotal = total - impuesto;

    if(carrito.length == 0){

      Swal.fire("El carrito está vacío!", "", "error");
      return;

    } else if(carrito.length >= 3) {
        descuento = (10 / 100) * subtotal;
        descuentoFinal = (subtotal - descuento) + impuesto;

        Swal.fire({
            title: "¡Usted seleccionó " + conteoDescuento + " Productos!" + "\n\n¡Aplica para un 10% de descuento!\n\n" + "¿Desea continuar con el proceso de pago?\n\n",
            text: "Total: RD$" + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Subtotal (sin impuestos): RD$" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Impuestos: RD$" + impuesto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Descuento (10%): RD$" + descuento.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Total con descuento: RD$" + descuentoFinal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Pagar",
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
              //Para que se reinicie el conteo cuando se realice la compra y se vacie el carrito.
              conteoDescuento = 0;
              
                Swal.fire("¡Gracias por su compra " + nombreUsuario + "!", "", "success");
                // Vaciar el carrito
                carrito = [];
                
                // Actualizar el localStorage
                localStorage.removeItem('carrito');
                
                // Actualizar la vista del carrito
                mostrarCarrito();
            } else if (result.isDenied) {
                Swal.fire("Continue con la compra", "", "info");
            }
        });
        
    } else {
        Swal.fire({
            title: "¡Usted seleccionó " + conteoDescuento + " Productos!" + "\n\n¡No aplica para un 10% de descuento!\n\n" + "¿Desea continuar con el proceso de pago?\n\n",
            text: "Total: RD$" + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Subtotal (sin impuestos): RD$" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\n" +
                  "Impuestos: RD$" + impuesto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Pagar",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                //Para que se reinicie el conteo cuando se realice la compra y se vacie el carrito.
                conteoDescuento = 0;
                Swal.fire("¡Gracias por su compra " + nombreUsuario + "!", "", "success");
                // Vaciar el carrito
                carrito = [];
                
                // Actualizar el localStorage
                localStorage.removeItem('carrito');
                
                // Actualizar la vista del carrito
                mostrarCarrito();
            } else if (result.isDenied) {
                Swal.fire("Continue con la compra", "", "info");
            }
        });
    }
});

// Boton de vaciar carrito.
const btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");
btnVaciarCarrito.addEventListener("click", ()=>{
   
  if(carrito.length == 0){
    Swal.fire("¡El carrito ya se encuentra vacío!", "", "error");
      return;
  }
  else{
    Swal.fire({
      title: "¿Quieres vaciar el carrito?",
      text: "¡No vas a poder revertir esto!",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, vaciar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Vaciar el array carrito
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();  
        conteoDescuento = 0;

        Swal.fire({
          title: 'Carrito Vacío',
          text: 'El carrito ha sido vaciado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
      });
      } else if (result.isDenied) {
        Swal.fire("Continue con la compra", "", "info");
      }

    });
  }
})