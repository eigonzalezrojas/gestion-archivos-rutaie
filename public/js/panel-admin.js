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

// Cargar Usuarios Tabla
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
                    <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
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

// Crear usuario
document.addEventListener('DOMContentLoaded', function () {
    const formCrearUsuario = document.getElementById('formCrearUsuario');
    let modal = new bootstrap.Modal(document.getElementById('modalCrearUsuario'));
    
    formCrearUsuario.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuarioData = {
            rut: document.getElementById('usuarioRut').value,
            matricula: document.getElementById('usuarioMatricula').value,
            nombre: document.getElementById('usuarioNombre').value,
            carrera: document.getElementById('usuarioCarrera').value,
            correo: document.getElementById('usuarioEmail').value,
            clave: document.getElementById('usuarioClave').value,
            rol: document.getElementById('usuarioRol').value
        };

        fetch('/crear-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioData)
        })
        .then(response => response.json())
        .then(data => {
            // Cerrar el modal            
            modal.hide();            
        
            // Actualizar la lista de usuarios
            cargarUsuarios();
        
            // Mostrar mensaje de éxito
            Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario creado exitosamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Mostrar mensaje de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al crear el usuario',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
});


// ELiminar usuario
function eliminarUsuario(idUsuario) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/eliminar-usuario/${idUsuario}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                );
                cargarUsuarios(); // Recargar la lista de usuarios
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el usuario',
                    'error'
                );
            });
        }
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



