//estas dos variables me sirven para saber que si mi data table esta inicializada ya que al momento de actualizar
// se necesita destruir la data table 

let dataTable;
let dataTableInicializada = false;
//creo el objeto de la configuracion de mi data table 
const dataTableOptions = {
    //scrollX: "2000px", esto es para ponerle una barra da desplazamiento por si es muy grande la tabla
    //lengthMenu: [5, 10, 15, 20, 100, 200, 500], configura la logitud de motrar
    columnDefs: [
        { className: "centrado", targets: [0, 1, 2, 3, 4, 5, 6] },
        //para que una columna no sea ordenable le desactivo
        //configuro como quiero que este el texto en las columnas y con "targets" le 
        //indico que columnas quiero que le aplique la clase 
        //indico que no quiero que las columnas 5 y 6 no sean ordenables 
        { orderable: false, targets: [5, 6] }
        // { searchable: false, targets: [1] } por si quiero que el buscador sea por una columna especifica
        //{ width: "50%", targets: [0] } por si quiero datle un valor especifico a una columna 
    ]
    ,
    //longitud de pagina seria la cantidad de registro que me muestre 
    pageLength: 4,
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
    dataTable = $("#datatable_users").DataTable(dataTableOptions);
    //ak infomo que mi data table inicializo
    dataTableInicializada = true;

}

//esta funcion solo lista los usuarios en una tabla comun
const listUser = async () => {
    try {
        //hace el llamado a la api
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        //recibe la respuesta y la transforma a jason
        const users = await response.json();
        //muestra por consola la respuesta 
        //console.log(data);
        //ak va a ir el contenido de la tabla 
        let content = ``;
        //uso un el foreach para recorer el array

        users.forEach((user, index) => {
            //interamos y vamos acumulando(lo mandamos al html) 
            content += `
            <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.address.city}</td>
            <td>${user.company.name}</td>
            <td><i class="fa-solid fa-check" style="color: green;"></i></td>
            <td>
                        <button class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
            </tr>`;
            //el icono es copiado de la pagina https://fontawesome.com/icons/check?f=classic&s=solid
        });
        //lo mando al html al contenido que estoy interando 
        tableBody_users.innerHTML = content;

    } catch (error) {
        alert(error);
    }
};
//funcion que que se carga al iniciar la pagina 
window.addEventListener("load", async () => {
    //funcion que llama al cargar 
    await initDataTable();
});