const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//Conexión a la base de datos
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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
