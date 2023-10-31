let productos = [
    { cod: 1, producto: "Azucar", detalle: "Ledesma", cantidad: 2 },
    { cod: 2, producto: "Detergente", detalle: "Ayudyn", cantidad: 5 },
    { cod: 3, producto: "Dentrifico", detalle: "Colgate", cantidad: 22 },
    { cod: 4, producto: "Galletas", detalle: "Surtido Bagley", cantidad: 10 },
];
//hago que el boton llene la tabla al hacer click
const BOTLLENAR = document.querySelector("#llenaTabla");
BOTLLENAR.addEventListener("click", CompletoTabla);
//puedo llenar la tabla en ves del boton es asi
//CompletoTabla()

function CompletoTabla() {
    //  limpio la tabla antes de llenarla .
    const armaTabla = document.getElementById("posiciones");
    while (armaTabla.rows.length > 1) {
        armaTabla.deleteRow(1);
    }

    for (let index = 0; index < productos.length; index++) {
        const prod = productos[index];

        // creo una fila para cada producto
        const fila = armaTabla.insertRow();

        // creo celdas para cada propiedad.
        const celdaCod = fila.insertCell(0);
        const celdaProducto = fila.insertCell(1);
        const celdaDetalle = fila.insertCell(2);
        const celdaCantidad = fila.insertCell(3);
        const celEditar = fila.insertCell(4);
        const celBorrar = fila.insertCell(4);

        // asigno valores a las celdas.
        celdaCod.textContent = prod.cod;
        celdaProducto.textContent = prod.producto; // Asigna prod.cod a la celda correspondiente
        celdaDetalle.textContent = prod.detalle; // Asigna prod.producto a la celda correspondiente
        celdaCantidad.textContent = prod.cantidad; // Asigna prod.cantidad a la celda correspondiente

        //creo boton editar
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-warning";
        celEditar.appendChild(botonEditar);

        // manejo el vento de editar cuando lo selecciona 
        botonEditar.addEventListener("click", function () {
            editarProducto(index);
        });
        //creo boton borrar
        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.className = "btn btn-danger";
        celBorrar.appendChild(botonBorrar);
        botonBorrar.addEventListener("click", function () {
            borrarProducto(index);
        });
    }
}

// elementos HTML de entrada
const COD = document.getElementById("cod");
const PROD = document.getElementById("prod");
const DET = document.getElementById("det");
const CANT = document.getElementById("cant");

//hago que el boton llene la tabla al hacer click
const CARGAR = document.querySelector("#cargar");
CARGAR.addEventListener("click", agregarProducto);


// Función para agregar un nuevo producto al array
function agregarProducto() {

    const nuevoCod = parseInt(COD.value);
    const nuevoProd = PROD.value;
    const nuevoDet = DET.value;
    const nuevaCanti = parseInt(CANT.value);

    // Verifica si el nuevo código ya existe en el array de productos
    const codigoExistente = productos.find(producto => producto.cod === nuevoCod);
    if (codigoExistente) {
        const edita = productos.splice((nuevoCod - 1), 1, {
            cod: nuevoCod,
            producto: nuevoProd,
            detalle: nuevoDet,
            cantidad: nuevaCanti

        });
        console.log("producto despues de editar: ", productos[nuevoCod - 1])
        // limpio los campos despues de cargarlo
        COD.value = "";
        //habilito el codigo del producto
        COD.disabled = false;
        PROD.value = "";
        DET.value = "";
        CANT.value = "";
        // actualizo la tabla 
        CompletoTabla();


    } else {
        //creo un nuevo objeto de producto
        const nuevoProducto = {
            cod: nuevoCod,
            producto: nuevoProd,
            detalle: nuevoDet,
            cantidad: nuevaCanti
        };

        // agrego al array el nuevo producto
        productos.push(nuevoProducto);

        // limpio los campos despues de cargarlo
        COD.value = "";
        PROD.value = "";
        DET.value = "";
        CANT.value = "";

        // actualizo la tabla 
        CompletoTabla();

    }
}

function editarProducto(index) {
    console.log("producto antes de editar: ", productos[index]);
    //indice de producto seleccionado
    const productoSeleccionado = productos[index];
    // selecciono los campos
    const editCod = document.getElementById("cod");
    const editProducto = document.getElementById("prod");
    const editDetalle = document.getElementById("det");
    const editCantidad = document.getElementById("cant");
    // lleno los campos del producto seleccionado 
    //pongo que el codigo no lo pueda editar 
    editCod.disabled = true;
    editCod.value = productoSeleccionado.cod;
    // editProducto.value = prompt("Nombre de Producto");
    // editDetalle.value = prompt("Detalle de Producto");
    // editCantidad.value = prompt("Cantidad de Producto");
    //agregado para cumplir con la consigna lineas 143-144-145
    // let msj = "Producto:  " + editProducto.value + "  Detalle:  " + editDetalle.value + "  Cantidad:  " + editCantidad.value;
    // alert(msj);
    agregarProducto();
    editCod.value = productoSeleccionado.cod;
    editProducto.value = productoSeleccionado.producto;
    editDetalle.value = productoSeleccionado.detalle;
    editCantidad.value = productoSeleccionado.cantidad;
}


function borrarProducto(index) {
    console.log("el producto eliminado es: ", productos[index])
    //indice de producto seleccionado
    productos.splice(index, 1);
    // actualizo la tabla 
    CompletoTabla();
}