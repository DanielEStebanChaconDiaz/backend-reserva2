require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-cancellation-email', async (req, res) => {
  const data = req.body;

  const mailOptions = {
    from: `"Reserva2" <${process.env.EMAIL_USER}>`,
    to: data.userEmail || data.email,
    subject: 'Cancelación de Reserva',
    html: `
      <h2>Cancelación de reserva</h2>
      <p>Hola ${data.userName || 'Cliente'},</p>
      <p>Tu reserva del servicio <strong>${data.serviceName}</strong> para el <strong>${data.date}</strong> ha sido cancelada.</p>
      <p>Motivo: ${data.cancellationReason}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, message: 'Fallo el envío del correo', error });
  }
});

// 🟢 Esto permite acceso desde dispositivos en la misma red
app.listen(process.env.PORT, '0.0.0.0', () =>
  console.log(`Servidor corriendo en http://0.0.0.0:${process.env.PORT}`)
);