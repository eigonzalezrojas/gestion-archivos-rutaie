//Crear contraseña segura del administrador

const bcrypt = require('bcrypt');

const contraseña = "conejo123";
const saltRounds = 10;

bcrypt.hash(contraseña, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Hash de la contraseña:", hash);
});