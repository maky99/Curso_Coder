menu = [];

function cargar() {
    fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => cargo(data))
        .catch((error) => console.log(error));
}
const cargo = (data) => {
    let seg = false;
    let paisesAgregados = [];
    while (menu.length < 40) {
        let busca = Math.floor(Math.random() * data.length);
        let nombre = data[busca].name.common;
        let capital = data[busca].capital[0];
        let bandera = data[busca].flags.png;
        if (!paisesAgregados.includes(nombre)) {
            menu.push({
                nombre: nombre,
                capital: capital,
                bandera: bandera
            });
            paisesAgregados.push(nombre);
        }
    }
    seg = true;
    if (seg) {
        let pedro = document.getElementById("resp");
        pedro.className = "d-block";
    }
    console.log(menu);
}
opciones = [];
vuelta = 0;
function cargoOpciones(tipoDeJuego) {
    opciones.length = 0;
    for (let i = 0; i < 3; i++) {
        let carga = Math.floor(Math.random() * (30 - 1) + 10);
        if (tipoDeJuego == "nombre") {
            let element = menu[carga].nombre;
            opciones.push(element);
        }
        else if (tipoDeJuego == "capital") {
            let element = menu[carga].capital;
            opciones.push(element);
        }
    }
    if (tipoDeJuego == "nombre") {
        opciones.push(menu[vuelta].nombre)
    } else if (tipoDeJuego == "capital") {
        opciones.push(menu[vuelta].capital)
    }
    muestraOpciones();
}

function mesclar(opciones) {
    for (let i = opciones.length - 1; i > 0; i--) {
        let nuevoLugar = Math.floor(Math.random() * (i + 1));
        let temporal = opciones[i];
        opciones[i] = opciones[nuevoLugar];
        opciones[nuevoLugar] = temporal;
    }
}

function muestraOpciones() {
    mesclar(opciones);
    if (tipoDeJuego == "nombre") {
        document.getElementById("arribaBandera").textContent = "¿A que pais corresponde";
    } else {
        document.getElementById("arribaBandera").textContent = "¿Cual es la " + tipoDeJuego + "la Bandera?";
    }
    document.getElementById("opcion-1").innerHTML = opciones[0];
    document.getElementById("opcion-2").innerHTML = opciones[1];
    document.getElementById("opcion-3").innerHTML = opciones[2];
    document.getElementById("opcion-4").innerHTML = opciones[3];
}

function muestraBandera(indice) {
    let bande = document.getElementById("imagen");
    while (bande.firstChild) {
        bande.removeChild(bande.firstChild);
    }
    let imgFlag = document.createElement("img");
    imgFlag.src = menu[indice].bandera;
    bande.appendChild(imgFlag);
}
function jugar() {
    tipoDeJuego = document.getElementById("miSelect").value;
    btnplay = document.getElementById("btnPlay");
    btnplay.className = "d-none";
    resp = document.getElementById("resp");
    resp.className = "d-none";
    pregJueg = document.getElementById("pregJueg");
    pregJueg.className = "d-block";
    tiempoRestante = tiempoTotal;

    let i = 0;
    puntaje = 0;
    muestraBandera(i);
    cargoOpciones(tipoDeJuego);
    vuelta = 0;
    actulizar();
}
var tiempoTotal = 60;
var tiempoRestante = tiempoTotal;
const tiemposRespuesta = [];
var puntaje = 0;
var nomb = "";
var cronometro;

function actulizar() {
    document.getElementById("tiem").innerHTML = tiempoRestante + " segundos";
    if (tiempoRestante <= 0 || vuelta == 10) {
        Swal.fire({
            title: 'Se termino el Tiempo',
            text: '',
            icon: 'error',
            confirmButtonText: 'Continuar'
        });
        finalizarJuego();
    } else {
        tiempoRestante--;
        cronometro = setTimeout(actulizar, 1000);
    }
}
function finalizarJuego() {
    const sumTiempos = tiemposRespuesta.reduce((total, tiempo) => total + tiempo, 0);
    const promedioTiempos = sumTiempos / tiemposRespuesta.length;
    Swal.fire({
        title: 'Te quedaste sin tiempo',
        text: '',
        icon: 'error',
        confirmButtonText: 'Fin'
    });
    mostrarResumen(nomb, vuelta, promedioTiempos, puntaje);
    pregJueg.className = "d-none";
    btnPlay.className = "d-flex";
    resp.className = "d-flex";
    tabla();
}
function cargarPregunta(vuelta) {
    muestraBandera(vuelta);
    cargoOpciones(tipoDeJuego);
    if (vuelta >= 10) {
        const sumTiempos = tiemposRespuesta.reduce((total, tiempo) => total + tiempo, 0);
        const promedioTiempos = sumTiempos / tiemposRespuesta.length;
        clearTimeout(cronometro);
        carTa(nomb, puntaje, tiempoTotal - tiempoRestante);
        mostrarResumen(nomb, vuelta, promedioTiempos, puntaje);
        pregJueg.className = "d-none";
        titulo.className = "d-flex";
        btnplay.className = "d-flex"
        resp.className = "d-block";
        tabla();
        return;
    }
}

async function seleccionarOpción(index) {
    let selecciono = opciones[index];
    if (tipoDeJuego == "nombre") {
        if (selecciono == menu[vuelta].nombre) {
            Swal.fire({
                title: 'Vamos!',
                text: 'Seguí así',
                icon: 'success',
                confirmButtonText: 'Continuar'
            });
            puntaje++;
            tiemposRespuesta.push(tiempoTotal - tiempoRestante);
        } else {
            Swal.fire({
                title: 'Correcta : ' + menu[vuelta].nombre,
                text: 'Vamos que vos sabes !!!',
                icon: 'error',
                confirmButtonText: 'Continuar'
            });
        }
    } else {
        if (selecciono == menu[vuelta].capital) {
            Swal.fire({
                title: 'Vamos!',
                text: 'Seguí así',
                icon: 'success',
                confirmButtonText: 'Continuar'
            });
            puntaje++;
            tiemposRespuesta.push(tiempoTotal - tiempoRestante);
        } else {
            Swal.fire({
                title: 'Correcta : ' + menu[vuelta].capital,
                text: 'Vamos que vos sabes !!!',
                icon: 'error',
                confirmButtonText: 'Continuar'
            });
        }
    }
    vuelta++;
    cargarPregunta(vuelta);
}
function tabla() {
    fetch("http://localhost:4000/posiciones")
        .then((res) => res.json())
        .then((data) => carTabla(data))
        .catch((error) => console.log(error));
}

const carTabla = (data) => {
    const armaTabla = document.getElementById("posiciones");
    const paraTab = JSON.parse(data);
    while (armaTabla.rows.length > 1) {
        armaTabla.deleteRow(1);
    }
    paraTab.sort((a, b) => {
        if (b.puntos === a.puntos) {
            return a.tiempo - b.tiempo;
        }
        return b.puntos - a.puntos;
    });
    var mostar = document.getElementById("mostar");
    mostar.className = "flex mx-4";
    let lugar = 0;
    paraTab.forEach(jugador => {
        if (lugar < 20) {
            ++lugar;
            const fila = armaTabla.insertRow();
            const celdaLugar = fila.insertCell(0);
            const celdaJugador = fila.insertCell(1);
            const celdaPuntos = fila.insertCell(2);
            const celdaTiempo = fila.insertCell(3);
            celdaLugar.textContent = lugar;
            celdaJugador.textContent = jugador.nombre;
            celdaPuntos.textContent = jugador.puntos;
            celdaTiempo.textContent = jugador.tiempo;
        }
    });
}

function nombreJugador() {
    var cuerpo = document.getElementById("cuerpo");

    nomb = document.getElementById("nombre").value;
    let correcto = true;
    if (nomb == "" || nomb == " " || nomb == "  " || nomb == "   ") {
        nomb = document.getElementById("nombre").focus();
    } else {
        if (correcto) {
            boton.disabled = false;
            document.getElementById("resultado").textContent = "Vamos a jugar: " + nomb;
            document.getElementById("tablaLlena").textContent = "Tu nombre tiene que ingresar en la tabla de posiciones !!! ";
            cuerpo.className = "d-flex";
            titulo.className = "d-flex"
            tabla();
        }
    }
}
function cargarTabla(nombre, puntos, tiempo) {
    TopJugadores.push({
        nombre: nombre,
        puntos: puntos,
        tiempo: tiempo,
    });
    llenarr();
}

const carTa = (nomb, pun, tie) => {
    const url = "http://localhost:4000/posiciones";
    const datos = {
        nombre: nomb,
        puntos: pun,
        tiempo: tie,
    };
    const opciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    };
    fetch(url, opciones)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo realizar la solicitud POST.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Datos de respuesta:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

function mostrarResumen(nombreJugador, preguntasRespondidas, tiempoPromedio, puntos) {
    Swal.fire({
        title: 'Resumen del juego',
        html: `
            <p><strong>Jugador:</strong> ${nombreJugador}</p>
            <p><strong>Preguntas Respondidas:</strong> ${preguntasRespondidas}</p>
            <p><strong>Tiempo Promedio:</strong> ${tiempoPromedio.toFixed(2)} segundos</p>
            <p><strong>Puntos:</strong> ${puntos}</p>
        `,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}
