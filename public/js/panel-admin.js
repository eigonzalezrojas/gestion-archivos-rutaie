// Declaración global
let submitArchivoBtn;

document.addEventListener('DOMContentLoaded', function () {
    const seccionUsuarios = document.getElementById('seccionUsuarios');
    const seccionDocumentos = document.getElementById('seccionDocumentos');
    const seccionInicio = document.getElementById('seccionInicio');
    const navUsuarios = document.getElementById('navUsuarios');
    const navDocumentos = document.getElementById('navDocumentos');
    const formDocumentos = document.getElementById('uploadFormContainer');
    submitArchivoBtn = document.getElementById('submitArchivoBtn');

    // Deshabilitar inicialmente el botón de subir archivo
    if (submitArchivoBtn) {
        submitArchivoBtn.disabled = true;
    }

    // Ocultar todas las secciones excepto Inicio al cargar la página
    seccionUsuarios.style.display = 'none';
    seccionDocumentos.style.display = 'none';
    seccionInicio.style.display = 'block';
    formDocumentos.style.display = 'none';

    // Mostrar Usuarios al hacer clic en el enlace Usuarios
    linkUsuarios.addEventListener('click', function(event) {
        event.preventDefault();
        seccionUsuarios.style.display = 'block';
        seccionInicio.style.display = 'none';
        seccionDocumentos.style.display = 'none';
        navUsuarios.style.display = 'block';
        navDocumentos.style.display = 'none';
        formDocumentos.style.display = 'none';
        cargarUsuarios();
    });

    // Mostrar Documentos al hacer clic en el enlace Documentos
    linkDocumentos.addEventListener('click', function(event) {
        event.preventDefault();
        seccionDocumentos.style.display = 'block';
        seccionInicio.style.display = 'none';
        seccionUsuarios.style.display = 'none';
        navDocumentos.style.display = 'block';
        navUsuarios.style.display = 'none';
        formDocumentos.style.display = 'block';
        cargarArchivos();
    });

    // Añadir lógica para el enlace Inicio si es necesario
    linkInicio.addEventListener('click', function(event) {
        event.preventDefault();
        seccionInicio.style.display = 'block';
        seccionUsuarios.style.display = 'none';
        seccionDocumentos.style.display = 'none';
        navUsuarios.style.display = 'none';
        navDocumentos.style.display = 'none';
        formDocumentos.style.display = 'none';        
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
                <td>${usuario.rut}</td>
                <td>${usuario.matricula}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.carrera}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="abrirModalEdicion(${usuario.id})">Editar</button>
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


//Abrir modal editar usuario
let modalEditarUsuario = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
function abrirModalEdicion(idUsuario) {
    obtenerDatosUsuario(idUsuario, function(usuario) {
        document.getElementById('editarUsuarioId').value = idUsuario;
        document.getElementById('editUserRut').value = usuario.rut;
        document.getElementById('editUserMatricula').value = usuario.matricula;
        document.getElementById('editUserNombre').value = usuario.nombre;
        document.getElementById('editUsuarioCarrera').value = usuario.carrera;
        document.getElementById('editUsuarioCorreo').value = usuario.correo;
        document.getElementById('editUsuarioRol').value = usuario.rol;
        document.getElementById('editUsuarioClave').value = usuario.clave;

        // Abre el modal
        modalEditarUsuario.show();
    });
}


// Obtener datos usuario
function obtenerDatosUsuario(idUsuario, callback) {
    fetch(`/obtener-datos-usuario/${idUsuario}`)
    .then(response => response.json())
    .then(data => {
        callback(data);
    })
    .catch(error => console.error('Error:', error));
}


// Editar usuario
document.getElementById('formEditarUsuario').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const usuarioId = document.getElementById('editarUsuarioId').value;
    const usuarioRut = document.getElementById('editUserRut').value;
    const usuarioMatricula = document.getElementById('editUserMatricula').value;
    const usuarioNombre = document.getElementById('editUserNombre').value;
    const usuarioCarrera = document.getElementById('editUsuarioCarrera').value;
    const usuarioCorreo = document.getElementById('editUsuarioCorreo').value;
    const usuarioClave = document.getElementById('editUsuarioClave').value;
    const usuarioRol = document.getElementById('editUsuarioRol').value;    

    // Y luego en el objeto usuarioData, usa estas variables
    const usuarioData = {
        rut: usuarioRut,
        matricula: usuarioMatricula,
        nombre: usuarioNombre,
        carrera: usuarioCarrera,
        correo: usuarioCorreo,
        clave: usuarioClave,
        rol: usuarioRol
    };

    fetch(`/editar-usuario/${usuarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Respuesta del servidor no es OK');
        }
        return response.json();
    })
    .then(data => {        
        modalEditarUsuario.hide();        
        cargarUsuarios();
        Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario actualizado exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar el usuario',
            icon: 'error',
            confirmButtonText: 'OK'
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


// Tabla archivos
function cargarArchivos() {
    fetch('/obtener-archivos')
    .then(response => response.json())
    .then(archivos => {
        const tbody = document.getElementById('tablaArchivos').querySelector('tbody');
        tbody.innerHTML = '';
        archivos.forEach(archivo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${archivo.nombre}</td>
                <td>${archivo.usuarioNombre}</td>
                <td>${archivo.rut}</td>
                <td>${archivo.fecha_subida.split('T')[0]}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarArchivo(${archivo.id})">Eliminar</button>
                    <a href="${archivo.ruta}" class="btn btn-primary btn-sm" download="${archivo.nombre}">Descargar</a>                
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error:', error));
}


// Eliminar archivo
function eliminarArchivo(idArchivo) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/eliminar-archivo/${idArchivo}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire(
                    'Eliminado',
                    'El archivo ha sido eliminado con éxito.',
                    'success'
                );
                cargarArchivos();
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el archivo',
                    'error'
                );
            });
        }
    });
}


// Buscar usuario para vincular archivo
document.getElementById('buscarUsuarioBtn').addEventListener('click', function() {
    const rut = document.getElementById('rutUsuario').value;
    fetch('/buscar-usuario?rut=' + rut)
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('selectUsuario');
        select.style.display = 'block';
        select.innerHTML = '';

        if (data.length > 0) {
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id;
                option.textContent = usuario.nombre;
                select.appendChild(option);
            });
            // Habilitar el botón de subir archivo si se encuentran usuarios
            document.getElementById('submitArchivoBtn').disabled = false;

            // Mensaje Sweet Alert de éxito
            Swal.fire({
                title: 'Usuario encontrado',
                text: 'Selecciona un usuario de la lista.',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        } else {
            select.innerHTML = '<option>No se encontraron usuarios</option>';
            // Mantener el botón de subir archivo deshabilitado si no hay usuarios
            document.getElementById('submitArchivoBtn').disabled = true;

            // Mensaje Sweet Alert de error
            Swal.fire({
                title: 'Usuario no encontrado',
                text: 'No se encontraron usuarios con el RUT proporcionado.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('submitArchivoBtn').disabled = true;

        // Mensaje Sweet Alert de error
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al buscar el usuario.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
});


// Subir archivo
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);


    fetch('/subir-archivo', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: '¡Éxito!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        // Limpia el formulario
        event.target.reset();

        // Actualiza la lista de archivos si es necesario
        cargarArchivos();
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al subir el archivo',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
});
  

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



