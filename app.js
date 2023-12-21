const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

//start - Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//start - página de inicio de sesión
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/objetivo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'objetivo.html'));
});

app.get('/proposito', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'proposito.html'));
});

app.get('/nosotros', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'nosotros.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contacto.html'));
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
  cookie: { secure: false } //cambiar en caso de https
}));



app.post('/login', (req, res) => {
  const { rut, clave } = req.body;
  const query = 'SELECT * FROM Usuarios WHERE rut = ?';

  connection.query(query, [rut], async (error, results) => {
      if (error) {
          console.error('Error en la consulta:', error);
          return res.status(500).send('Error en el servidor');
      }
  
      if (results.length === 0) {
          return res.status(401).send('Usuario no encontrado.');
      }
  
      const usuario = results[0];
      const claveValida = await bcrypt.compare(clave, usuario.clave);
      
      if (!claveValida) {
          return res.status(401).send('Contraseña incorrecta.');
      }
  
      // Establecer la sesión del usuario aquí
      req.session.usuario = { id: usuario.id, rol: usuario.rol };        


      switch (usuario.rol) {
          case 'administrador':
              res.json({ success: true, redirectUrl: '/panel-admin' });
              break;
          default:
              res.json({ success: true, redirectUrl: '/panel-user' });
              break;
      }
  });
});

// Middleware para verificar si es administrador
function verificarEsAdministrador(req, res, next) {
  if (req.session.usuario && req.session.usuario.rol === 'administrador') {
      next();
  } else {
      res.status(403).send('Acceso denegado. Se requiere rol de administrador.');
  }
}

// Middleware para verificar si es usuario
function verificarEsUsuario(req, res, next) {
  if (req.session.usuario && req.session.usuario.rol === 'usuario') {
      next();
  } else {
      res.status(403).send('Acceso denegado. Se requiere rol de usuario.');
  }
}

// Rutas
app.get('/panel-admin', verificarEsAdministrador, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'panel-admin.html'));
});

app.get('/panel-user', verificarEsUsuario, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'panel-user.html'));
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


// Mostrar archivos panel-admin
app.get('/obtener-archivos', (req, res) => {
  const query = `
      SELECT archivos.id, archivos.ruta, archivos.nombre, archivos.fecha_subida, usuarios.rut, usuarios.nombre as usuarioNombre
      FROM archivos
      JOIN usuarios ON archivos.id_usuario = usuarios.id`;

  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error en la base de datos', error);
          return res.status(500).json({ message: 'Error interno del servidor.' });
      }
      res.json(results);
  });
});


// Configuración de Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads'); 
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

// Endpoint para subir archivos
app.post('/subir-archivo', upload.single('archivo'), (req, res) => {
  const usuarioId = req.body.usuarioId;
  const archivo = req.file;  

  if (!archivo) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  const nombreArchivo = archivo.filename;
  const rutaArchivo = archivo.path;
  const fechaActual = new Date();
  const fechaSubida = fechaActual.toISOString().split('T')[0];


  const query = 'INSERT INTO archivos (nombre, ruta, id_usuario, fecha_subida) VALUES (?, ?, ?, ?)';

  connection.query(query, [nombreArchivo, rutaArchivo, usuarioId, fechaSubida], (error, results) => {
    if (error) {
      console.error('Error al guardar el archivo en la base de datos', error);
      return res.status(500).send('Error al guardar el archivo.');
    }
    res.json({ message: 'Archivo subido con éxito' });
  });
});


// Endpoint para eliminar archivos
app.delete('/eliminar-archivo/:id', (req, res) => {
  const idArchivo = req.params.id;

  const query = 'DELETE FROM archivos WHERE id = ?';

  connection.query(query, [idArchivo], (error, results) => {
      if (error) {
          console.error('Error al eliminar el archivo en la base de datos', error);
          return res.status(500).send('Error al eliminar el archivo.');
      }

      res.json({ message: 'Archivo eliminado con éxito' });
  });
});


// Buscar usuario para vincular archivo
app.get('/buscar-usuario', (req, res) => {
  const rut = req.query.rut;
  const query = 'SELECT id, nombre FROM usuarios WHERE rut = ? AND rol = "usuario"';

  connection.query(query, [rut], (error, results) => {
      if (error) {
          console.error('Error en la base de datos', error);
          return res.status(500).json({ message: 'Error interno del servidor.' });
      }
      res.json(results);
  });
});


// Cargar archivos usuario
app.get('/obtener-archivos', (req, res) => {
  // Aquí deberás obtener el ID o RUT del usuario de la sesión o token
  const idUsuario = req.session.usuarioId; // Ajustar según tu lógica de autenticación

  const query = 'SELECT nombre, ruta, fecha FROM archivos WHERE id_usuario = ?';
  connection.query(query, [idUsuario], (error, results) => {
      if (error) {
          console.error('Error al obtener archivos:', error);
          return res.status(500).send('Error al obtener archivos');
      }

      res.json(results);
  });
});



//start - Run app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
