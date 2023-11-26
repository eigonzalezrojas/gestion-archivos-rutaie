document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // IDs formulario HTML
    var usuario = document.getElementById('username').value;
    var clave = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, clave }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirectUrl;
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});