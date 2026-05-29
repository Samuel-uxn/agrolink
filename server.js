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
    password: '123456', 
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
//datos para llenar las tablas de Pedido
//y productos en admin
app.get('/api/admin/resumen', function(req,res){
    var resumen={};

    db.query('SELECT COUNT(*) AS total FROM PRODUCTO WHERE activo = 1', function(err,resultado){
        resumen.productos = resultado[0].total;
    
    db.query("SELECT COUNT(*) AS total FROM PEDIDO_INDIVIDUAL WHERE estado = 'pendiente'", function(err, resultado){
        resumen.pedidos=resultado[0].total;

        db.query("SELECT COUNT(*) AS total FROM PROVEEDOR WHERE estado = 'activo'", function(err, resultado){
            resumen.proveedores=resultado[0].total;
            
            db.query('SELECT COUNT(*) AS total FROM INVENTARIO_BODEGA WHERE stock < stock_minimo', function(err,resultado){
                resumen.stockBajo=resultado[0].total;

                res.json(resumen);
            });
        });
    });
    });
        
});
//ahora si las tablas de productos y pedidos en el admin
app.get('/api/admin/pedidos/recientes', function(req, res){
    var sql = 'SELECT PI.id_pedido, C.nombre_completo, PI.estado, PI.estado_pago FROM PEDIDO_INDIVIDUAL PI JOIN CAMPESINO C ON PI.cedula_campesino = C.cedula ORDER BY PI.fecha_pedido DESC LIMIT 5';

    db.query(sql, function(err, resultado){
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});// cargar categorias y proveedores para los selects
app.get('/api/admin/categorias', function(req, res) {
    db.query('SELECT * FROM CATEGORIA_PRODUCTO', function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

app.get('/api/admin/proveedores', function(req, res) {
    db.query('SELECT * FROM PROVEEDOR WHERE estado = "activo"', function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// agregar producto
app.post('/api/admin/producto', function(req, res) {
    var nombre = req.body.nombre;
    var precio = req.body.precio;
    var unidad = req.body.unidad;
    var cantMin = req.body.cantMin;
    var id_categoria = req.body.id_categoria;
    var id_proveedor = req.body.id_proveedor;

    var sql = 'INSERT INTO PRODUCTO (nombre, precio_actual, unidad_medida, cantidad_min_compra, id_categoria, id_proveedor) VALUES (?,?,?,?,?,?)';
    db.query(sql, [nombre, precio, unidad, cantMin, id_categoria, id_proveedor], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Producto agregado exitosamente'});
    });
});

// listar productos
app.get('/api/admin/productos', function(req, res) {
    var sql = 'SELECT P.id_producto, P.nombre, P.precio_actual, P.unidad_medida, C.nombre as categoria, PR.razon_social as proveedor FROM PRODUCTO P JOIN CATEGORIA_PRODUCTO C ON P.id_categoria = C.id_categoria JOIN PROVEEDOR PR ON P.id_proveedor = PR.id_proveedor';
    db.query(sql, function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// agregar proveedor
app.post('/api/admin/proveedor', function(req, res) {
    var razonSocial = req.body.razonSocial;
    var nitRut = req.body.nitRut;
    var telefono = req.body.telefono;
    var email = req.body.email;
    var fechaContrato = req.body.fechaContrato;
    var id_municipio = req.body.id_municipio;

    var sql = 'INSERT INTO PROVEEDOR (razon_social, nit_rut, telefono, email, fecha_contrato, id_municipio) VALUES (?,?,?,?,?,?)';
    db.query(sql, [razonSocial, nitRut, telefono, email, fechaContrato, id_municipio], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Proveedor agregado exitosamente'});
    });
});

// listar proveedores
app.get('/api/admin/proveedores/lista', function(req, res) {
    db.query('SELECT * FROM PROVEEDOR', function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// activar o desactivar proveedor
app.post('/api/admin/proveedor/estado', function(req, res) {
    var id_proveedor = req.body.id_proveedor;
    var estado = req.body.estado;

    db.query('UPDATE PROVEEDOR SET estado = ? WHERE id_proveedor = ?', [estado, id_proveedor], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Estado actualizado'});
    });
});

// listar todos los pedidos
app.get('/api/admin/pedidos', function(req, res) {
    var sql = 'SELECT PI.id_pedido, C.nombre_completo, PI.direccion_entrega, PI.estado, PI.estado_pago, PI.fecha_pedido FROM PEDIDO_INDIVIDUAL PI JOIN CAMPESINO C ON PI.cedula_campesino = C.cedula ORDER BY PI.fecha_pedido DESC';
    db.query(sql, function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// cambiar estado del pedido
app.post('/api/admin/pedido/estado', function(req, res) {
    var id_pedido = req.body.id_pedido;
    var nuevoEstado = req.body.estado;

    db.query('UPDATE PEDIDO_INDIVIDUAL SET estado = ? WHERE id_pedido = ?', [nuevoEstado, id_pedido], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Estado del pedido actualizado'});
    });
});
// listar inventario
app.get('/api/admin/inventario', function(req, res) {
    var sql = 'SELECT P.nombre, IB.stock, IB.stock_minimo, IB.id_producto, IB.id_bodega FROM INVENTARIO_BODEGA IB JOIN PRODUCTO P ON IB.id_producto = P.id_producto';
    db.query(sql, function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// actualizar stock
app.post('/api/admin/inventario/actualizar', function(req, res) {
    var id_producto = req.body.id_producto;
    var id_bodega = req.body.id_bodega;
    var nuevoStock = req.body.stock;

    db.query('UPDATE INVENTARIO_BODEGA SET stock = ? WHERE id_producto = ? AND id_bodega = ?', [nuevoStock, id_producto, id_bodega], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Stock actualizado'});
    });
});
// listar municipios
app.get('/api/admin/municipios', function(req, res) {
    var sql = 'SELECT M.id_municipio, M.nombre, D.nombre as departamento, M.habilitado FROM MUNICIPIO M JOIN DEPARTAMENTO D ON M.id_departamento = D.id_departamento';
    db.query(sql, function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json(resultado);
    });
});

// habilitar o deshabilitar municipio
app.post('/api/admin/municipio/estado', function(req, res) {
    var id_municipio = req.body.id_municipio;
    var habilitado = req.body.habilitado;

    db.query('UPDATE MUNICIPIO SET habilitado = ? WHERE id_municipio = ?', [habilitado, id_municipio], function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({mensaje: 'Municipio actualizado'});
    });
});
// query runner del superadmin
app.post('/api/superadmin/query', function(req, res) {
    var query = req.body.query;

    db.query(query, function(err, resultado) {
        if(err) return res.json({error: err.message});
        res.json({resultado: resultado});
    });
});
app.listen(3000, function() {
    console.log('Servidor corriendo en puerto 3000');
    console.log('Abre: http://localhost:3000/pagina/index.html');
});
