const nodemailer = require('nodemailer');
require('dotenv').config();


// Enviar correo - contacto
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, text) => {
  let mailOptions = {
      from: 'rutaie459@gmail.com',
      to: to,
      subject: subject,
      text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email enviado: ' + info.response);
      }
  });
};

module.exports = sendEmail;
