function seleccionar(elemento) {
        document.querySelectorAll('.opcion').forEach(function(o) {
        o.classList.remove('activo');
    });

    elemento.classList.add('activo');
}
function continuar() {
    
    var seleccionado = document.querySelector('.opcion.activo');

    // si no hay ninguna seleccionada, avisa
    if (seleccionado == null) {
        alert('Selecciona quién se va a registrar');
        return;
    }

    // según el texto del seleccionado, va a una página
    var texto = seleccionado.textContent;

    if (texto == 'Campesino') {
        window.location.href = 'registroCampesino.html';
    } else if (texto == 'Administrador') {
        window.location.href = 'registroAdmin.html';
    }

}
var btnCampesino = document.getElementById('btnRegistrar');
if (btnCampesino) {
    btnCampesino.addEventListener('click', function() {    
        var datos = {
        cedula: document.getElementById('cedula').value,
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        direccion: document.getElementById('direccion').value,
        municipio: document.getElementById('municipio').value,
        contraseña: document.getElementById('contraseña').value
    };

    fetch('http://localhost:3000/api/registro/campesino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            window.location.href = '../pagina/index.html';
        }
    });
});
}
//evento de registro pal admin
var btnAdmin = document.getElementById('btnRegistrarAdmin');
if (btnAdmin) {
    btnAdmin.addEventListener('click', function() {    
        var datos = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        contraseña: document.getElementById('contraseña').value
    };
    fetch('http://localhost:3000/api/registro/admin',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)

    })
    .then(function(res){ return res.json(); })
    .then(function(data){
        if (data.error){
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            window.location.href = '../pagina/index.html';
        }
    });
    });
}
//boton de inicio de sesion
var btnLogin = document.getElementById('btnLogin');
if(btnLogin){
    btnLogin.addEventListener('click', function(){
        var usuario = document.getElementById('loginUser').value;
        var contraseña = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/login',{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({usuario: usuario, contraseña: contraseña})
        })
        .then(function(res){return res.json();})
        .then(function(data){
            if(data.error){
                alert('Error: '+data.error);
            }else if(data.rol =='campesino'){
                window.location.href='../pagina/campesino.html';
            }else if(data.rol == 'admin'){
                window.location.href = '../pagina/admin.html';
            }else if(data.rol == 'superadmin'){
                window.location.href = '../pagina/superadmin.html';
            }
        });
    });
}
//click del menu del administrador
function mostrarSeccion(seccion){
    document.querySelectorAll('.main > div').forEach(function(div){
        div.style.display = 'none';
    });
    document.getElementById(seccion).style.display = 'block';
}
//conectar las catarts de el admin 
function cargarResumen(){
    fetch('http://localhost:3000/api/admin/resumen')
    .then(function(res){return res.json();})
    .then(function(data){
        document.getElementById('totalProductos').textContent=data.productos;
        document.getElementById('totalPedidos').textContent=data.pedidos;
        document.getElementById('totalProveedores').textContent=data.proveedores;
        document.getElementById('stockBajo').textContent=data.stockBajo;
    });
}
cargarResumen();
//recibir datos del server pa llenar las tablas
function cargarPedidosRecientes(){
    fetch('http://localhost:3000/api/admin/pedidos/recientes')
    .then(function(res){return res.json();})
    .then(function(data){
        var tabla=document.getElementById('tablaPedidos');
        tabla.innerHTML='';
        data.forEach(function(pedido){
            tabla.innerHTML+='<tr>'+
            '<td>'+pedido.id_pedido+'</td>'+
            '<td>'+pedido.nombre_completo+'</td>'+
            '<td>'+pedido.estado+'</td>'+
            '<td>'+pedido.estado_pago+'</td>'+
            '</tr>';
        });
    });
}
cargarPedidosRecientes();
// cargar categorias y proveedores en los selects
function cargarSelects() {
    var selectCategoria = document.getElementById('categoriaProducto');
    var selectProveedor = document.getElementById('proveedorProducto');
    if (!selectCategoria || !selectProveedor) return;

    fetch('http://localhost:3000/api/admin/categorias')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        data.forEach(function(cat) {
            selectCategoria.innerHTML += '<option value="' + cat.id_categoria + '">' + cat.nombre + '</option>';
        });
    });

    fetch('http://localhost:3000/api/admin/proveedores')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        data.forEach(function(prov) {
            selectProveedor.innerHTML += '<option value="' + prov.id_proveedor + '">' + prov.razon_social + '</option>';
        });
    });
}
cargarSelects();

// listar productos
function cargarProductos() {
    var tabla = document.getElementById('tablaProductos');
    if (!tabla) return;

    fetch('http://localhost:3000/api/admin/productos')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        tabla.innerHTML = '';
        data.forEach(function(p) {
            tabla.innerHTML += '<tr>' +
                '<td>' + p.id_producto + '</td>' +
                '<td>' + p.nombre + '</td>' +
                '<td>' + p.precio_actual + '</td>' +
                '<td>' + p.unidad_medida + '</td>' +
                '<td>' + p.categoria + '</td>' +
                '<td>' + p.proveedor + '</td>' +
            '</tr>';
        });
    });
}
cargarProductos();

// agregar producto
var btnAgregarProducto = document.getElementById('btnAgregarProducto');
if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener('click', function() {
        var datos = {
            nombre: document.getElementById('nombreProducto').value,
            precio: document.getElementById('precioProducto').value,
            unidad: document.getElementById('unidadProducto').value,
            cantMin: document.getElementById('cantMinProducto').value,
            id_categoria: document.getElementById('categoriaProducto').value,
            id_proveedor: document.getElementById('proveedorProducto').value
        };

        fetch('http://localhost:3000/api/admin/producto', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if(data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(data.mensaje);
                cargarProductos();
            }
        });
    });
}
// listar proveedores
function cargarProveedores() {
    var tabla = document.getElementById('tablaProveedores');
    if (!tabla) return;

    fetch('http://localhost:3000/api/admin/proveedores/lista')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        tabla.innerHTML = '';
        data.forEach(function(p) {
            tabla.innerHTML += '<tr>' +
                '<td>' + p.id_proveedor + '</td>' +
                '<td>' + p.razon_social + '</td>' +
                '<td>' + p.nit_rut + '</td>' +
                '<td>' + p.telefono + '</td>' +
                '<td>' + p.estado + '</td>' +
                '<td><button onclick="cambiarEstado(' + p.id_proveedor + ', \'' + p.estado + '\')">Activar/Desactivar</button></td>' +
            '</tr>';
        });
    });
}
cargarProveedores();

// cambiar estado proveedor
function cambiarEstado(id, estadoActual) {
    var nuevoEstado = estadoActual == 'activo' ? 'inactivo' : 'activo';

    fetch('http://localhost:3000/api/admin/proveedor/estado', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_proveedor: id, estado: nuevoEstado})
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            cargarProveedores();
        }
    });
}

// agregar proveedor
var btnAgregarProveedor = document.getElementById('btnAgregarProveedor');
if (btnAgregarProveedor) {
    btnAgregarProveedor.addEventListener('click', function() {
        var datos = {
            razonSocial: document.getElementById('razonSocial').value,
            nitRut: document.getElementById('nitRut').value,
            telefono: document.getElementById('telefonoProveedor').value,
            email: document.getElementById('emailProveedor').value,
            fechaContrato: document.getElementById('fechaContrato').value,
            id_municipio: document.getElementById('municipioProveedor').value
        };

        fetch('http://localhost:3000/api/admin/proveedor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if(data.error) {
                alert('Error: ' + data.error);
            } else {
                alert(data.mensaje);
                cargarProveedores();
            }
        });
    });
}
// listar pedidos
function cargarPedidos() {
    var tabla = document.getElementById('tablaPedidosAdmin');
    if (!tabla) return;

    fetch('http://localhost:3000/api/admin/pedidos')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        tabla.innerHTML = '';
        data.forEach(function(p) {
            tabla.innerHTML += '<tr>' +
                '<td>' + p.id_pedido + '</td>' +
                '<td>' + p.nombre_completo + '</td>' +
                '<td>' + p.direccion_entrega + '</td>' +
                '<td>' + p.estado + '</td>' +
                '<td>' + p.estado_pago + '</td>' +
                '<td>' + p.fecha_pedido + '</td>' +
                '<td><select onchange="cambiarEstadoPedido(' + p.id_pedido + ', this.value)">' +
                    '<option value="pendiente" ' + (p.estado == "pendiente" ? "selected" : "") + '>Pendiente</option>' +
                    '<option value="confirmado" ' + (p.estado == "confirmado" ? "selected" : "") + '>Confirmado</option>' +
                    '<option value="en_camino" ' + (p.estado == "en_camino" ? "selected" : "") + '>En camino</option>' +
                    '<option value="entregado" ' + (p.estado == "entregado" ? "selected" : "") + '>Entregado</option>' +
                '</select></td>' +
            '</tr>';
        });
    });
}
cargarPedidos();

// cambiar estado pedido
function cambiarEstadoPedido(id, estado) {
    fetch('http://localhost:3000/api/admin/pedido/estado', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_pedido: id, estado: estado})
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            cargarPedidos();
            cargarResumen();
        }
    });
}
// listar inventario
function cargarInventario() {
    var tabla = document.getElementById('tablaInventario');
    if (!tabla) return;

    fetch('http://localhost:3000/api/admin/inventario')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        tabla.innerHTML = '';
        data.forEach(function(p) {
            tabla.innerHTML += '<tr>' +
                '<td>' + p.nombre + '</td>' +
                '<td>' + p.stock + '</td>' +
                '<td>' + p.stock_minimo + '</td>' +
                '<td>' +
                    '<input type="number" id="stock_' + p.id_producto + '" value="' + p.stock + '" min="0">' +
                    '<button onclick="actualizarStock(' + p.id_producto + ', ' + p.id_bodega + ')">Actualizar</button>' +
                '</td>' +
            '</tr>';
        });
    });
}
cargarInventario();

// actualizar stock
function actualizarStock(id_producto, id_bodega) {
    var nuevoStock = document.getElementById('stock_' + id_producto).value;

    fetch('http://localhost:3000/api/admin/inventario/actualizar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_producto: id_producto, id_bodega: id_bodega, stock: nuevoStock})
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            cargarInventario();
        }
    });
}
// listar municipios
function cargarMunicipios() {
    var tabla = document.getElementById('tablaMunicipios');
    if (!tabla) return;

    fetch('http://localhost:3000/api/admin/municipios')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        tabla.innerHTML = '';
        data.forEach(function(m) {
            tabla.innerHTML += '<tr>' +
                '<td>' + m.id_municipio + '</td>' +
                '<td>' + m.nombre + '</td>' +
                '<td>' + m.departamento + '</td>' +
                '<td>' + (m.habilitado ? 'Habilitado' : 'Deshabilitado') + '</td>' +
                '<td><button onclick="cambiarEstadoMunicipio(' + m.id_municipio + ', ' + m.habilitado + ')">' +
                    (m.habilitado ? 'Deshabilitar' : 'Habilitar') +
                '</button></td>' +
            '</tr>';
        });
    });
}
cargarMunicipios();

// habilitar o deshabilitar municipio
function cambiarEstadoMunicipio(id, habilitadoActual) {
    var nuevoEstado = habilitadoActual ? 0 : 1;

    fetch('http://localhost:3000/api/admin/municipio/estado', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_municipio: id, habilitado: nuevoEstado})
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        if(data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(data.mensaje);
            cargarMunicipios();
        }
    });
}
// query runner
var btnEjecutar = document.getElementById('btnEjecutar');
if (btnEjecutar) {
    btnEjecutar.addEventListener('click', function() {
        var query = document.getElementById('queryInput').value;

        fetch('http://localhost:3000/api/superadmin/query', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query: query})
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var resultado = document.getElementById('queryResultado');

            if(data.error) {
                resultado.innerHTML = '<p style="color:red">Error: ' + data.error + '</p>';
                return;
            }

            if(data.resultado.length == 0) {
                resultado.innerHTML = '<p>La consulta no devolvió resultados</p>';
                return;
            }

            // crea la tabla dinamicamente con las columnas que vengan
            var columnas = Object.keys(data.resultado[0]);
            var html = '<table><tr>';

            columnas.forEach(function(col) {
                html += '<th>' + col + '</th>';
            });
            html += '</tr>';

            data.resultado.forEach(function(fila) {
                html += '<tr>';
                columnas.forEach(function(col) {
                    html += '<td>' + fila[col] + '</td>';
                });
                html += '</tr>';
            });

            html += '</table>';
            resultado.innerHTML = html;
        });
    });
}