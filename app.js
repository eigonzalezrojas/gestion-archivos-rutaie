const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

//start - Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//start - página de inicio de sesión
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const saltRounds = 10;

const session = require('express-session');


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


//Control de sesion navegador web - cookies
app.use(session({
  secret: 'rutaie23#', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


//start - Verificación credenciales acceso 
app.post('/login', (req, res) => {
  const { rut, clave } = req.body;
  const query = 'SELECT clave, rol FROM usuarios WHERE rut = ?';

  connection.query(query, [rut], async (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(401).send('Usuario no encontrado.');
    }

    const usuario = results[0];

    const claveValida = await bcrypt.compare(clave, usuario.clave);
    
    if (!claveValida) {
      return res.status(401).send('Contraseña incorrecta.');
    }

    if (usuario.rol === 'administrador') {
      res.json({ success: true, redirectUrl: 'panel-admin.html' });
    } else{
      return res.status(403).send('Acceso denegado. Se requiere rol de administrador.');
    }
  });
});


//start - Vista administrador
app.get('/panel-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'panel-admin.html'));
});


//start - cargar usuarios dashboard
app.get('/obtener-usuarios', (req, res) => {
  // Asumiendo que tienes una conexión a la base de datos configurada
  const query = "SELECT * FROM usuarios";
  connection.query(query, (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error al consultar la base de datos' });
      }
      res.json(results);
  });
});


// start Cerrar sesion
app.post('/cerrar-sesion', (req, res) => {
  if (req.session) {
      req.session.destroy((error) => {
          if (error) {
              return res.status(500).send('No se pudo cerrar la sesión');
          }
          res.send('Sesión cerrada');
      });
  } else {
      res.status(400).send('Sesión no iniciada');
  }
});


// Crear Usuario
app.post('/crear-usuario', (req, res) => {
  const { rut, matricula, clave, nombre, carrera, correo, rol } = req.body;

  bcrypt.hash(clave, saltRounds, (err, hash) => {
      if (err) {
          return res.status(500).send('Error al encriptar la contraseña');
      }

      const query = "INSERT INTO usuarios (rut, matricula, clave, nombre, carrera, correo, rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
      
      connection.query(query, [rut, matricula, hash, nombre, carrera, correo, rol], (error, results) => {
          if (error) {
              // Envía un mensaje de error si hay un problema con la consulta SQL
              return res.status(500).json({ message: 'Error al insertar en la base de datos', error: error });
          }
          // Envía una respuesta exitosa si el usuario se ha creado correctamente
          res.json({ message: 'Usuario creado con éxito', id: results.insertId });
      });
  });
});


// Editar usuario
app.put('/editar-usuario/:id', (req, res) => {
  const idUsuario = req.params.id;
  const { rut, matricula, clave, nombre, carrera, correo, rol } = req.body;

  bcrypt.hash(clave, saltRounds, (err, hash) => {
      if (err) {
          return res.status(500).send('Error al encriptar la contraseña');
      }

      const query = "UPDATE usuarios SET rut = ?, matricula = ?, clave = ?, nombre = ?, carrera = ?, correo = ?, rol = ? WHERE id = ?";
      
      connection.query(query, [rut, matricula, hash, nombre, carrera, correo, rol, idUsuario], (error, results) => {
          if (error) {
              return res.status(500).json({ message: 'Error al actualizar el usuario', error: error });
          }
          res.json({ message: 'Usuario actualizado con éxito', id: idUsuario });
      });
  });
});



// Obtner info modal usuario
app.get('/obtener-datos-usuario/:id', (req, res) => {
  const idUsuario = req.params.id;

  const query = 'SELECT * FROM usuarios WHERE id = ?';

  connection.query(query, [idUsuario], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error al obtener los datos del usuario', error: error });
      }

      if (results.length > 0) {
          res.json(results[0]);
      } else {
          res.status(404).send('Usuario no encontrado');
      }
  });
});


// Eliminar Usuario
app.delete('/eliminar-usuario/:id', (req, res) => {
  const idUsuario = req.params.id;
  const query = "DELETE FROM usuarios WHERE id = ?";

  connection.query(query, [idUsuario], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error al eliminar el usuario', error: error });
      }
      res.json({ message: 'Usuario eliminado con éxito' });
  });
});





//start - Run app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
