require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-cancellation-email", async (req, res) => {
  const data = req.body;
  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `"Reserva2" <${process.env.EMAIL_USER}>`,
    to: data.userEmail || data.email,
    subject: "Cancelación de Reserva",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cancelación de Reserva</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: black;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .logo {
            width: 150px;
            height: auto;
          }
          .content {
            padding: 30px;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          h2 {
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .service-info {
            background-color: #f9f9f9;
            border-left: 4px solid black;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 10px 10px 0;
          }
          .button {
            display: inline-block;
            background-color: black;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 25px;
            margin-top: 20px;
            font-weight: bold;
          }
          .ticket-icon {
            display: inline-block;
            margin-right: 5px;
            vertical-align: middle;
          }
          .cancellation-reason {
            background-color: #fff0f0;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <!-- Reemplaza esta URL con la ruta a tu imagen de logo -->
            <img src="https://i.ibb.co/wFDpyNXx/logo.png" alt="Reserva2" class="logo">
          </div>
          
          <div class="content">
            <h2>Cancelación de reserva</h2>
            <p>Hola ${data.userName || "Cliente"},</p>
            
            <p>Lamentamos informarte que tu reserva ha sido cancelada:</p>
            
            <div class="service-info">
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.date}</p>
            </div>
            
            <div class="cancellation-reason">
              <p><strong>Motivo de la cancelación:</strong><br>${
                data.cancellationReason
              }</p>
            </div>
            
            <p>Si deseas realizar una nueva reserva, puedes hacerlo a través de nuestra aplicación.</p>
            
            <center>
              <a href="#" class="button">
                <span class="ticket-icon">🎟️</span> Hacer nueva reserva
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p>© ${currentYear} Reserva2. Todos los derechos reservados.</p>
            <p>Si tienes alguna pregunta, contáctanos directamente en nuestra aplicación.</p>
          </div>
        </div>
      </body>
      </html>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ success: false, message: "Fallo el envío del correo", error });
  }
});

// 🟢 Esto permite acceso desde dispositivos en la misma red
app.listen(process.env.PORT, "0.0.0.0", () =>
  console.log(`Servidor corriendo en http://0.0.0.0:${process.env.PORT}`)
);
