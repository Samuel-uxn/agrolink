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
