document.addEventListener('DOMContentLoaded', (event) => {
    let load = 0;
    let interval = setInterval(() => {
      load++;
      document.getElementById('loader-text').textContent = `${load}%`;
      if (load >= 100) {
        clearInterval(interval);
        document.getElementById('loader-wrapper').style.display = 'none';
      }
    }, 20);
  
    document.getElementById('menu-button').addEventListener('click', function() {
      const navbar = document.getElementById('navbar-sticky');
      navbar.classList.toggle('hidden');
    });
  });
  