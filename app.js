const express = require('express');
const app = express();
const path = require('path');
//start - Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
//end - Configuración para servir archivos estáticos


//start - Conexión a la base de datos
const mysql = require('mysql');
const port = 3000;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rutaie-utalca'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Conectado exitosamente a la base de datos.");
});
//end - Conexión a la base de datos


// Creación de contraseñas usuarios
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(bodyParser.json());



//start - página de inicio de sesión
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
//end - página de inicio de sesión


//start - Verificación credenciales acceso 
app.post('/', (req, res) => {
    const { usuario, clave } = req.body;
    db.query('SELECT * FROM usuarios WHERE rut = ?', [usuario], function(error, results, fields) {
        if (error) {
            res.status(500).send('Error en el servidor');
            return;
        }
        if (results.length > 0) {
            bcrypt.compare(clave, results[0].clave, function(err, result) {
                if (result) {
                  res.json({ success: true, redirectUrl: '/panel-admin' });
                } else {
                    res.json({ success: false, message: "Contraseña incorrecta" });
                }
            });
        } else {
            res.json({ success: false, message: "Usuario no encontrado" });
        }
    });
  });
//end - Verificación credenciales acceso


//start - Vista administrador
app.get('/panel-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'panel-admin.html'));
});
//end - Vista administrador


//start - Agregar nuevo usuario

//end - Agregar nuevo usuario


//start - Run app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
//end - Run app