//para cargar el primer producto
//agregarProducto("popo", "plpl", 5569);


// elementos HTML de entrada
let COD = document.getElementById("cod");
let producto = document.getElementById("prod");
let detalle = document.getElementById("det");
let cantidad = document.getElementById("cant");

//hago que el boton llene la tabla al hacer click
const CARGAR = document.querySelector("#cargar");
CARGAR.addEventListener("click", obtengoDatos);

//ingreso los productos
//function agregarProducto(producto, detalle, cantidad) {
function obtengoDatos() {
    // Obtén los valores ingresados en los campos del formulario
    //const COD = COD.value;
    const prod = producto.value;
    const det = detalle.value;
    const cant = cantidad.value;

    // Valida que los campos no estén vacíos
    if (!prod || !det || !cant) {
        alert("Todos los campos son obligatorios.");
        return;
    }
    // Llama a la función agregarProducto con los valores del formulario
    agregarProducto(prod, det, cant);

    // Limpia los campos del formulario
    COD.value = "";
    producto.value = "";
    detalle.value = "";
    cantidad.value = "";

    // Vuelve a inicializar la tabla
    initDataTable();
}

//ingreso los productos 
//function agregarProducto(producto, detalle, cantidad) {
function agregarProducto(producto, detalle, cantidad) {
    // Recuperar productos existentes del localStorage
    const productosRecuperados = localStorage.getItem('productosGuardados');
    let productos = [];
    if (productosRecuperados) {
        // parseao el objeto
        productos = JSON.parse(productosRecuperados);
    }


    // veo la cantidad de productos
    const longitudProductos = Object.keys(productos).length;
    //genero el codigo nuevo
    const cod = longitudProductos + 1;
    // creo un nuevo objeto de producto
    const nuevoProducto = { cod, producto, detalle, cantidad };
    //  agrego el nuevo producto al arreglo de productos
    productos.push(nuevoProducto);
    // convierto el arreglo de productos a JSON
    const productosJSON = JSON.stringify(productos);
    // actualizado en el localStorage
    localStorage.setItem('productosGuardados', productosJSON);
}


//estas dos variables me sirven para saber que si mi data table esta inicializada ya que al momento de actualizar
let dataTable;
// se necesita destruir la data table 
let dataTableInicializada = false;
//creo el objeto de la configuracion de mi data table 
const dataTableOptions = {
    //scrollX: "2000px", esto es para ponerle una barra da desplazamiento por si es muy grande la tabla
    lengthMenu: [5, 10, 15, 20, 100, 200, 500],// configura la logitud de motrar
    columnDefs: [
        { className: "centrado", targets: [0, 1, 2, 3, 4, 5] },
        //para que una columna no sea ordenable le desactivo
        //configuro como quiero que este el texto en las columnas y con "targets" le 
        //indico que columnas quiero que le aplique la clase 
        //indico que no quiero que las columnas 5 y 6 no sean ordenables 
        { orderable: false, targets: [4, 5] }
        // { searchable: false, targets: [1] } por si quiero que el buscador sea por una columna especifica
        //{ width: "50%", targets: [0] } por si quiero datle un valor especifico a una columna 
    ]
    ,
    //longitud de pagina seria la cantidad de registro que me muestre 
    pageLength: 10,
    //ak le doy  true para indicarle que pueda ser una tabla destuible y se vuelva a crear 
    destroy: true,
    //para cambiarle el idioma de la tabla 
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

//ak hago la funcion para la data table
const initDataTable = async () => {
    //si esta inicializada la destruye 
    if (dataTableInicializada) {
        dataTable.destroy();
    }
    //llamo a listar los usuarios
    await listUser();
    // ak le doy el id de la tabla y llamo a la funcion DataTable(ak va,
    // el objeto con parametros de configuracion de opciones, si lo quiero vacio sin parametro le pongo{})
    dataTable = $("#posiciones").DataTable(dataTableOptions);
    //ak infomo que mi data table inicializo
    dataTableInicializada = true;

}

//esta funcion solo lista los usuarios en una tabla comun
const listUser = async () => {
    try {
        const productosRecuperados = localStorage.getItem('productosGuardados');
        console.log("linea 80", productosRecuperados);
        const productos = JSON.parse(productosRecuperados);
        let content = ``;
        productos.forEach((producto, index) => {
            //interamos y vamos acumulando(lo mandamos al html) 
            content += `
            <tr>
            <td>${index + 1}</td>
            <td>${producto.producto}</td>
            <td>${producto.detalle}</td>
            <td>${producto.cantidad}</td>
            <td><i class="fa-solid fa-check" style="color: green;"></i></td>
            <td>
            <button class="btn btn-sm btn-primary editar" data-index="${index}"><i class="fa-solid fa-pencil"></i></button>
            
            <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-can"></i></button>
            </td>
            </tr>`;
            //el icono es copiado de la pagina https://fontawesome.com/icons/check?f=classic&s=solid
        });
        //lo mando al html al contenido que estoy interando 
        tableBody_users.innerHTML = content;

        // para usar el botón Editar
        const botonesEditar = document.querySelectorAll(".editar");
        botonesEditar.forEach((boton) => {
            boton.addEventListener("click", () => {
                const index = boton.getAttribute("data-index");
                console.log("muestro index del boton seleccionado", index);
                editarProducto(index);
            });
        });

    } catch (error) {
        alert(error);
    }
};


//funcion que que se carga al iniciar la pagina 
window.addEventListener("load", async () => {
    //funcion que llama al cargar 
    initDataTable();
});

function editarProducto(index) {
    // muestro el boton editar
    document.getElementById('editar').style.display = 'inline';

    // oculto el boton cargar
    document.getElementById('cargar').style.display = 'none'; 

    // Recupera la lista de productos del localStorage
    const productosRecuperados = localStorage.getItem('productosGuardados');
    console.log("linea 193",productosRecuperados)
    let productos = [];

    if (productosRecuperados) {
        productos = JSON.parse(productosRecuperados);
    }

    // Verifica que el índice sea válido
    if (index >= 0 && index < productos.length) {
        // Obtén el producto a editar
        const productoAEditar = productos[index];
        console.log("linea 193", productoAEditar)

        // Rellena los campos del formulario con los datos del producto
        const editCod = document.getElementById("cod");
        const editProducto = document.getElementById("prod");
        const editDetalle = document.getElementById("det");
        const editCantidad = document.getElementById("cant");

        editCod.value = productoAEditar.cod;
        editProducto.value = productoAEditar.producto;
        editDetalle.value = productoAEditar.detalle;
        editCantidad.value = productoAEditar.cantidad;
         // Ahora puedes permitir que el usuario realice las ediciones necesarias en el formulario
        // Después de que el usuario haga las ediciones, debes guardar los cambios en el localStorage
        // y actualizar la lista de productos en la tabla.
    }
    
}



const EDIT = document.querySelector("#editar");
EDIT.addEventListener("click", editaBoton);

function editaBoton() {
    // Actualiza los valores del productoAEditar con los valores de los campos de entrada
    let uno = document.getElementById("cod").value;
    producto = document.getElementById("prod").value;
    detalle = document.getElementById("det").value;
    cantidad = document.getElementById("cant").value;
    
    }



// function editaBoton(){
//         // Actualiza los valores del productoAEditar con los valores de los campos de entrada
//     let COD = document.getElementById("cod");
//     let producto = document.getElementById("prod");
//     let detalle = document.getElementById("det");
//     let cantidad = document.getElementById("cant");

//         console.log("linea 232", COD)
//     COD = COD.value;
//     prod = producto.value;
//     det = detalle.value;
//     cant = cantidad.value;
//     console.log("linea 240", COD)
//         //  productoAEditar = editCod.value;
//         //  productoAEditar.producto = editProducto.value;
//         //  productoAEditar.detalle = editDetalle.value;
//         //  productoAEditar.cantidad = editCantidad.value;

//         // Actualiza el objeto en la lista de productos
//     const productosRecuperados = localStorage.getItem('productosGuardados');
//     console.log("linea 193", productosRecuperados)
//     let productos = [];

//     if (productosRecuperados) {
//         productos = JSON.parse(productosRecuperados);
//     }

//         // Convierte la lista de productos a JSON
//         const productosJSON = JSON.stringify(productos);

//         // Guarda los cambios en el localStorage
//         localStorage.setItem('productosGuardados', productosJSON);
//         //console.log("trolo", productosGuardados);

//         // Restaura la vista a su estado inicial
//         document.getElementById('editar').style.display = 'none';
//         document.getElementById('cargar').style.display = 'inline';

//         // Limpia los campos del formulario
//     COD.value = "";
//     producto.value = "";
//     detalle.value = "";
//     cantidad.value = "";

//         // Vuelve a inicializar la tabla para reflejar los cambios
//         initDataTable();

// }





//---------------------------------------------------------error------------------------
// //para cargar el primer producto
// agregarProducto("popo", "plpl", 5569);


// // elementos HTML de entrada
// const COD = document.getElementById("cod");
// const producto = document.getElementById("prod");
// const detalle = document.getElementById("det");
// const cantidad = document.getElementById("cant");

// //hago que el boton llene la tabla al hacer click
// const CARGAR = document.querySelector("#cargar");
// CARGAR.addEventListener("click", obtengoDatos);
// let productoEditando = -1;


// //ingreso los productos
// //function agregarProducto(producto, detalle, cantidad) {
// function obtengoDatos() {
//     // Obtén los valores ingresados en los campos del formulario
//     //const COD = COD.value;
//     const prod = producto.value;
//     const det = detalle.value;
//     const cant = cantidad.value;

//     // Valida que los campos no estén vacíos
//     if (!prod || !det || !cant) {
//         alert("Todos los campos son obligatorios.");
//         return;
//     }
//     // Llama a la función agregarProducto con los valores del formulario
//     agregarProducto(prod, det, cant);

//     // Limpia los campos del formulario
//     COD.value = "";
//     producto.value = "";
//     detalle.value = "";
//     cantidad.value = "";

//     // Vuelve a inicializar la tabla
//     initDataTable();
// }

// //ingreso los productos 
// //function agregarProducto(producto, detalle, cantidad) {
// function agregarProducto(produ, deta, canti) {
//     console.log("todo del 47", produ, deta, canti)
//     // Recuperar productos existentes del localStorage
//     const productosRecuperados = localStorage.getItem('productosGuardados');
//     let productos = [];
//     if (productosRecuperados) {
//         // parseao el objeto
//         productos = JSON.parse(productosRecuperados);
//     }
//     //cod nuevo -----------------------------
//     // if (productoEditando === -1) {
//     //     // veo la cantidad de productos
//     //     const longitudProductos = productos.length;
//     //     //genero el codigo nuevo
//     //     const codNuevo = longitudProductos + 1;
//     //     const nuevoProducto = { cod: codNuevo, producto: prod, detalle: det, cantidad: cant };
//     //     productos.push(nuevoProducto);

//     // } else {
//     //     // Editar el producto existente
//     //     const productoAEditar = productos[productoEditando];
//     //     productoAEditar.producto = prod;
//     //     productoAEditar.detalle = det;
//     //     productoAEditar.cantidad = cant;

//     //     // Restablece la variable productoEditando
//     //     productoEditando = -1;
//     // }
//     // veo la cantidad de productos
//     const longitudProductos = Object.keys(productos).length;
//     //genero el codigo nuevo
//     const cod = longitudProductos + 1;
//     // creo un nuevo objeto de producto
//     const nuevoProducto = { cod, producto, detalle, cantidad };
//     //  agrego el nuevo producto al arreglo de productos
//     productos.push(nuevoProducto);
//     // convierto el arreglo de productos a JSON
//     const productosJSON = JSON.stringify(productos);
//     console.log("linea 85", productos)
//     // actualizado en el localStorage
//     localStorage.setItem('productosGuardados', productosJSON);
// }



// // Convierte el arreglo en una cadena JSON
// //const datosJSON = JSON.stringify(productos);

// // Guarda la cadena en localStorage con una clave específica
// //localStorage.setItem('productosGuardados', datosJSON);
// //-----------------------------------


// //estas dos variables me sirven para saber que si mi data table esta inicializada ya que al momento de actualizar
// let dataTable;
// // se necesita destruir la data table 
// let dataTableInicializada = false;
// //creo el objeto de la configuracion de mi data table 
// const dataTableOptions = {
//     //scrollX: "2000px", esto es para ponerle una barra da desplazamiento por si es muy grande la tabla
//     lengthMenu: [5, 10, 15, 20, 100, 200, 500],// configura la logitud de motrar
//     columnDefs: [
//         { className: "centrado", targets: [0, 1, 2, 3, 4, 5] },
//         //para que una columna no sea ordenable le desactivo
//         //configuro como quiero que este el texto en las columnas y con "targets" le 
//         //indico que columnas quiero que le aplique la clase 
//         //indico que no quiero que las columnas 5 y 6 no sean ordenables 
//         { orderable: false, targets: [4, 5] }
//         // { searchable: false, targets: [1] } por si quiero que el buscador sea por una columna especifica
//         //{ width: "50%", targets: [0] } por si quiero datle un valor especifico a una columna 
//     ]
//     ,
//     //longitud de pagina seria la cantidad de registro que me muestre 
//     pageLength: 10,
//     //ak le doy  true para indicarle que pueda ser una tabla destuible y se vuelva a crear 
//     destroy: true,
//     //para cambiarle el idioma de la tabla 
//     language: {
//         lengthMenu: "Mostrar _MENU_ registros por página",
//         zeroRecords: "Ningún usuario encontrado",
//         info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
//         infoEmpty: "Ningún usuario encontrado",
//         infoFiltered: "(filtrados desde _MAX_ registros totales)",
//         search: "Buscar:",
//         loadingRecords: "Cargando...",
//         paginate: {
//             first: "Primero",
//             last: "Último",
//             next: "Siguiente",
//             previous: "Anterior"
//         }
//     }
// };

// //ak hago la funcion para la data table
// const initDataTable = async () => {
//     //si esta inicializada la destruye 
//     if (dataTableInicializada) {
//         dataTable.destroy();
//     }
//     //llamo a listar los usuarios
//     await listUser();
//     // ak le doy el id de la tabla y llamo a la funcion DataTable(ak va,
//     // el objeto con parametros de configuracion de opciones, si lo quiero vacio sin parametro le pongo{})
//     dataTable = $("#posiciones").DataTable(dataTableOptions);
//     //ak infomo que mi data table inicializo
//     dataTableInicializada = true;

// }

// //esta funcion solo lista los usuarios en una tabla comun
// const listUser = async () => {
//     try {
//         const productosRecuperados = localStorage.getItem('productosGuardados');
//         console.log("linea 80", productosRecuperados);
//         const productos = JSON.parse(productosRecuperados);
//         let content = ``;
//         productos.forEach((producto, index) => {
//             //interamos y vamos acumulando(lo mandamos al html) 
//             content += `
//             <tr>
//             <td>${index + 1}</td>
//             <td>${producto.producto}</td>
//             <td>${producto.detalle}</td>
//             <td>${producto.cantidad}</td>
//             <td><i class="fa-solid fa-check" style="color: green;"></i></td>
//             <td>
//             <button class="btn btn-sm btn-primary editar" data-index="${index}"><i class="fa-solid fa-pencil"></i></button>
            
//             <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-can"></i></button>
//             </td>
//             </tr>`;
//             //el icono es copiado de la pagina https://fontawesome.com/icons/check?f=classic&s=solid
//         });
//         //lo mando al html al contenido que estoy interando 
//         tableBody_users.innerHTML = content;

//         // para usar el botón Editar
//         const botonesEditar = document.querySelectorAll(".editar");
//         botonesEditar.forEach((boton) => {
//             boton.addEventListener("click", () => {
//                 const index = boton.getAttribute("data-index");
//                 console.log("muestro index del boton seleccionado", index);
//                 editarProducto(index);
//             });
//         });

//     } catch (error) {
//         alert(error);
//     }
// };


// //funcion que que se carga al iniciar la pagina 
// window.addEventListener("load", async () => {
//     //funcion que llama al cargar 
//     initDataTable();
// });

// function editarProducto(index) {
//     // Recupera la lista de productos del localStorage
//     const productosRecuperados = localStorage.getItem('productosGuardados');
//     let productos = [];

//     if (productosRecuperados) {
//         productos = JSON.parse(productosRecuperados);
//     }

//     // Verifica que el índice sea válido
//     if (index >= 0 && index < productos.length) {
//         // Obtén el producto a editar
//         const productoAEditar = productos[index];

//         // Rellena los campos del formulario con los datos del producto
//         const editCod = document.getElementById("cod");
//         const editProducto = document.getElementById("prod");
//         const editDetalle = document.getElementById("det");
//         const editCantidad = document.getElementById("cant");

//         editCod.value = productoAEditar.cod;
//         editProducto.value = productoAEditar.producto;
//         editDetalle.value = productoAEditar.detalle;
//         editCantidad.value = productoAEditar.cantidad;

//         // Ahora puedes permitir que el usuario realice las ediciones necesarias en el formulario
//         // Después de que el usuario haga las ediciones, debes guardar los cambios en el localStorage
//         // y actualizar la lista de productos en la tabla.
//     }
// }




// // function editarProducto(index) {
// //     //recupero lo que tengo en local storange  => localStorage.getItem('productosGuardados')
// //     console.log("producto antes de editar: ", localStorage.getItem('productosGuardados'));
// //     // //indice de producto seleccionado
// //     // const productoSeleccionado = productos[index];
// //     // // selecciono los campos
// //     const editCod = document.getElementById("cod");
// //     const editProducto = document.getElementById("prod");
// //     const editDetalle = document.getElementById("det");
// //     const editCantidad = document.getElementById("cant");
// //     // // lleno los campos del producto seleccionado
// //     // //pongo que el codigo no lo pueda editar
// //     // editCod.disabled = true;
// //     // editCod.value = productoSeleccionado.cod;
// //     // // editProducto.value = prompt("Nombre de Producto");
// //     // // editDetalle.value = prompt("Detalle de Producto");
// //     // // editCantidad.value = prompt("Cantidad de Producto");
// //     // //agregado para cumplir con la consigna lineas 143-144-145
// //     // // let msj = "Producto:  " + editProducto.value + "  Detalle:  " + editDetalle.value + "  Cantidad:  " + editCantidad.value;
// //     // // alert(msj);
// //     // agregarProducto();
// //     // editCod.value = productoSeleccionado.cod;
// //     // editProducto.value = productoSeleccionado.producto;
// //     // editDetalle.value = productoSeleccionado.detalle;
// //     // editCantidad.value = productoSeleccionado.cantidad;
// // }