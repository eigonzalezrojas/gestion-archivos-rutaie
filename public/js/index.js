document.getElementById('menu-button').addEventListener('click', function() {
    const navbar = document.getElementById('navbar-sticky');
    navbar.classList.toggle('hidden');
});

document.querySelectorAll('.barra-lateral a').forEach(el => {
    el.addEventListener('mouseover', function() {
        this.classList.add('text-blue-500'); // Cambiar color con TailwindCSS
    });
    el.addEventListener('mouseout', function() {
        this.classList.remove('text-blue-500');
    });
});
