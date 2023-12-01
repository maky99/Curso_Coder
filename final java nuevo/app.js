const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
var cors = require('cors')
app.use(cors())


const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webii'
});

app.listen('4000', function () {
    console.log("Servidor en linea");
});


conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("Conexion exitosa a la base de datos!");
    }
});

const verTabla = (callback) => {
    const consultaSQL = 'SELECT * FROM posiciones';
    conexion.query(consultaSQL, (error, resultados) => {
        if (error) {
            console.error("Error al consultar la base de datos:", error);
            callback(error, null);
        } else {
            const resulJSON = JSON.stringify(resultados);
            callback(null, resulJSON);
        }
    });
};

app.get("/posiciones", (req, res) => {
    verTabla((error, resultadosJSON) => {
        if (error) {
            res.status(500).json({ error: "Error al obtener los datos" });
        } else {
            res.json(resultadosJSON);
        }
    });
});

app.post('/posiciones', (req, res) => {
    const { nombre, puntos, tiempo } = req.body;

    const sql = 'INSERT INTO posiciones (nombre, puntos, tiempo) VALUES (?, ?, ?)';
    conexion.query(sql, [nombre, puntos, tiempo], (error, result) => {
        if (error) {
            console.error("Error al insertar datos en la base de datos:", error);
            res.status(500).json({ error: "Error al insertar datos en la base de datos" });
        } else {
            res.status(200).json({ mensaje: "Datos insertados con éxito" });
        }
    });
});
