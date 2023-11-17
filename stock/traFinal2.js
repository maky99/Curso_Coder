//para cargar el primer producto
//agregarProducto("popo", "plpl", 55);

// elementos HTML de entrada
let COD = document.getElementById("cod");
let producto = document.getElementById("prod");
let detalle = document.getElementById("det");
let cantidad = document.getElementById("cant");

//hago que el boton llene la tabla al hacer click
let CARGAR = document.querySelector("#cargar");
CARGAR.addEventListener("click", obtengoDatos);

function limpiarCampos() {
    // Limpia los campos del formulario
    COD.value = "";
    producto.value = "";
    detalle.value = "";
    cantidad.value = "";
}

//ingreso los productos
//function agregarProducto(producto, detalle, cantidad) {
function obtengoDatos() {
    // Obtén los valores ingresados en los campos del formulario
    //const COD = COD.value;
    let prod = producto.value;
    let det = detalle.value;
    let cant = cantidad.value;

    // Valida que los campos no estén vacíos
    if (!prod || !det || !cant) {
        alert("Todos los campos son obligatorios.");
        return;
    }
    // Llama a la función agregarProducto con los valores del formulario
    agregarProducto(prod, det, cant);

    // // Limpia los campos del formulario
    limpiarCampos();
    // COD.value = "";
    // producto.value = "";
    // detalle.value = "";
    // cantidad.value = "";

    // Vuelve a inicializar la tabla
    initDataTable();
}

//ingreso los productos
function agregarProducto(producto, detalle, cantidad) {
    function agregarProducto(producto, detalle, cantidad) {
        // Recuperar productos existentes del localStorage
        let productosRecuperados = localStorage.getItem('productosGuardados');
        let productos = [];
        if (productosRecuperados) {
            // parseao el objeto
            productos = JSON.parse(productosRecuperados);
        }
        // veo la cantidad de productos
        let longitudProductos = Object.keys(productos).length;
        //genero el codigo nuevo
        let cod = longitudProductos + 1;
        // creo un nuevo objeto de producto
        let nuevoProducto = { cod, producto, detalle, cantidad };
        //  agrego el nuevo producto al arreglo de productos
        productos.push(nuevoProducto);
        // convierto el arreglo de productos a JSON
        let productosJSON = JSON.stringify(productos);
        // actualizado en el localStorage
        localStorage.setItem('productosGuardados', productosJSON);
    }
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
        // const productosRecuperados = localStorage.getItem('productosGuardados');
        // console.log("linea 80", productosRecuperados);
        // const productos = JSON.parse(productosRecuperados);
        const response = await fetch('datos.json');

        // Verificar si la solicitud fue exitosa (código de estado 200)
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }

        // Obtener los datos JSON de la respuesta
        const productos = await response.json();

        let content = ``;
        productos.forEach((producto, index) => {
            //interamos y vamos acumulando(lo mandamos al html) 
            content += `
            <tr>
            <td>${index + 1}</td>
            <td>${producto.producto}</td>
            <td>${producto.detalle}</td>
            <td>${producto.cantidad}</td>
            <td><i class="fa-solid fa-check" style="color: orange;"></i></td>
            <td>
            <button class="btn btn-sm btn-primary editar" data-index="${index}"><i class="fa-solid fa-pencil"></i></button>
            <button class="btn btn-sm btn-danger eliminar" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
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
        //para usar el boton eliminar
        const botonesEliminar = document.querySelectorAll(".eliminar");
        botonesEliminar.forEach((boton) => {
            boton.addEventListener("click", () => {
                const index = boton.getAttribute("data-index");
                eliminarProducto(index);
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
    let productosRecuperados = localStorage.getItem('productosGuardados');
    //console.log("linea 193",productosRecuperados)
    let productos = [];

    if (productosRecuperados) {
        productos = JSON.parse(productosRecuperados);
    }

    // Verifica que el índice sea válido
    if (index >= 0 && index < productos.length) {
        // Obtén el producto a editar
        let productoAEditar = productos[index];
        //console.log("linea 193", productoAEditar)

        // llena los campos del formulario con los datos del producto a editar
        document.getElementById("cod").value = productoAEditar.cod;
        document.getElementById("cod").readOnly = true;//parque no edite el cod
        document.getElementById("prod").value = productoAEditar.producto;
        document.getElementById("det").value = productoAEditar.detalle;
        document.getElementById("cant").value = productoAEditar.cantidad;
    }
}

let EDIT = document.querySelector("#editar");
EDIT.addEventListener("click", editaBoton);

function editaBoton() {
    // Actualiza los valores del productoAEditar con los valores de los campos de entrada
    let COD = document.getElementById("cod").value;
    let producto = document.getElementById("prod").value;
    let detalle = document.getElementById("det").value;
    let cantidad = document.getElementById("cant").value;

    let productosRecuperados = localStorage.getItem('productosGuardados');
    let productos = JSON.parse(productosRecuperados);

    let nuevoProductoEditado = { cod: COD, producto, detalle, cantidad };

    productos.forEach((producto, index) => {
        console.log("238  ", COD)
        if (producto.cod == nuevoProductoEditado.cod) {
            // actualiza el producto con los nuevos valores
            productos[index] = nuevoProductoEditado;
        }
    });

    // guarda los cambios en el localstorge
    localStorage.setItem('productosGuardados', JSON.stringify(productos));

    // limpia los campos
    limpiarCampos();
    //parque pueda editar el cod
    document.getElementById("cod").readOnly = false;

    // actualza la tabla
    initDataTable();

    // oculata el  editar y muestra el cargar
    document.getElementById('editar').style.display = 'none';
    document.getElementById('cargar').style.display = 'inline';

}

function eliminarProducto(index) {
    const productosRecuperados = localStorage.getItem('productosGuardados');
    let productos = [];

    if (productosRecuperados) {
        productos = JSON.parse(productosRecuperados);
    }

    if (index >= 0 && index < productos.length) {
        // elimina el producto con indice especificado
        productos.splice(index, 1);

        // actualiza el localstorge
        localStorage.setItem('productosGuardados', JSON.stringify(productos));

        // actualiza la tabla
        initDataTable();
    }
}

veoDatos();
async function veoDatos() {
    try {
        const respuesta = await fetch('./datos.json');
        const data = await respuesta.json();
        console.log("toy con data ", data)

    } catch (error) {
        console.error("Error al cargar datos iniciales desde el archivo:", error);
    }
}