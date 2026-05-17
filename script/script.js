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
        window.location.href = 'registro_admin.html';
    }

}
document.getElementById('btnRegistrar').addEventListener('click', function() {
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