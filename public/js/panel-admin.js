document.addEventListener('DOMContentLoaded', function () {
    const linkUsuarios = document.getElementById('linkUsuarios');
    const seccionUsuarios = document.getElementById('seccionUsuarios');
    const navUsuarios = document.getElementById('navUsuarios');
    const navDocumentos = document.getElementById('navDocumentos');

    linkUsuarios.addEventListener('click', function(event) {
        event.preventDefault();
        seccionUsuarios.style.display = 'block';
        navUsuarios.style.display = 'block';
        navDocumentos.style.display = 'none';
        cargarUsuarios();
    });
});

function cargarUsuarios() {
    fetch('/obtener-usuarios')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(usuarios => {
        const tbody = document.getElementById('tablaUsuarios');
        tbody.innerHTML = '';
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.rut}</td>
                <td>${usuario.matricula}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.carrera}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="btn btn-primary btn-sm">Editar</button>
                    <button class="btn btn-danger btn-sm">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar usuarios');
    });
}

// Cerrar sesion
document.getElementById('cerrarSesion').addEventListener('click', function(event) {
    event.preventDefault();

    fetch('/cerrar-sesion', { method: 'POST' })
    .then(response => {
        if(response.ok) {
            window.location.href = 'login.html';
        }
    })
    .catch(error => console.error('Error:', error));
});



