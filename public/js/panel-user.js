document.addEventListener('DOMContentLoaded', function () {
    cargarArchivos();

    function cargarArchivos() {
        fetch('/ruta-para-obtener-archivos') // Cambiar por la ruta real de tu API
            .then(response => response.json())
            .then(data => mostrarArchivos(data))
            .catch(error => console.error('Error:', error));
    }

    function mostrarArchivos(archivos) {
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = ''; // Limpiar la tabla actual

        archivos.forEach(archivo => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${archivo.nombre}</td>
                <td>${archivo.fecha}</td>
                <td><button class="btn btn-primary" onclick="descargarArchivo('${archivo.ruta}')">Descargar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.descargarArchivo = function(ruta) {
        // Implementar lógica de descarga
        Swal.fire(
            'Descargado!',
            'Tu archivo ha sido descargado.',
            'success'
        );
    };
});

// Cerrar sesion
document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();

    fetch('/cerrar-sesion', { method: 'POST' })
    .then(response => {
        if(response.ok) {
            window.location.href = 'login.html';
        }
    })
    .catch(error => console.error('Error:', error));
});
