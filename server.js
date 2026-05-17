const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// conexión a la base de datos
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // cámbiala por la tuya
    database: 'agrolink_db'
});

db.connect(function(err) {
    if (err) {
        console.log('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});
//ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
app.post('/api/registro/campesino', function(req, res) {
    var cedula = req.body.cedula;
    var nombre = req.body.nombre;
    var celular = req.body.telefono;
    var email = req.body.correo;
    var direccion = req.body.direccion;
    var id_municipio = req.body.municipio;
    var contraseña = req.body.contraseña;

    var sql = 'INSERT INTO CAMPESINO (cedula, nombre_completo, celular, email, direccion, id_municipio, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [cedula, nombre, celular, email, direccion, id_municipio, contraseña], function(err, result) {
        if (err) {
            res.json({ error: err.message });
            return;
        }
        res.json({ mensaje: 'Campesino registrado exitosamente' });
    });
});

app.listen(3000, function() {
    console.log('Servidor corriendo en puerto 3000');
});