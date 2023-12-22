document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            to: 'catalina.letelier@utalca.cl',
            subject: 'Formulario sitio web',
            text: `Nombre: ${document.getElementById('name').value}, 
                   Email: ${document.getElementById('email').value}, 
                   Mensaje: ${document.getElementById('message').value}`
        };

        fetch('/send-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.text())
        .then(data => {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu mensaje ha sido enviado.',
                icon: 'success'
            }).then(() => {
                contactForm.reset();
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar tu mensaje.',
                icon: 'error'
            });
        });
    });
});
