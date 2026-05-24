const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '')));
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
//registro pál campesino
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
//registro de administrador
app.post('/api/registro/admin', function(req,res){
    var nombre = req.body.nombre;
    var email = req.body.correo;
    var contraseña = req.body.contraseña;

    var sql = 'INSERT INTO ADMINISTRADOR (nombre, email, password_hash) VALUES (?,?,?)';

    db.query(sql, [nombre, email, contraseña], function(err, result){
        if (err){
            res.json({error: err.message});
            return;
        }
        res.json({mensaje: 'Administrador registrado exitosamente'});
    });
});
//inicio de secion del campe, el admin y el proadmin
app.post('/api/login', function(req,res){
    var usuario = req.body.usuario;
    var contraseña = req.body.contraseña;

    var sqlCampesino = 'SELECT * FROM  CAMPESINO WHERE cedula = ? AND password_hash = ?';
    db.query(sqlCampesino, [usuario, contraseña], function(err, resultado){
        if(err){
            res.json({error: err.message});
            return;
        }

        if(resultado.length > 0){
            res.json({ rol: 'campesino' });
            return;
        } 

    var sqlAdmin = 'SELECT * FROM ADMINISTRADOR WHERE email = ? AND password_hash = ?';
    db.query(sqlAdmin, [usuario, contraseña], function(err, resultado){
        if(err){
            res.json({error: err.message});
            return;
        }
        if(resultado.length>0){
            res.json({rol: resultado[0].rol});
            return;
        }
        return res.json({error: 'Usuario o contraseña incorrectos'});
    });
});
});

app.listen(3000, function() {
    console.log('Servidor corriendo en puerto 3000');
    console.log('Abre: http://localhost:3000/pagina/index.html');
});