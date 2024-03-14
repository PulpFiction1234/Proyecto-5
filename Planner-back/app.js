const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
require("dotenv").config();

process.env.TZ = 'America/Santiago';

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("Conectado a la base de datos");
}

app.get("/api/user", authenticateToken, (req, res) => {
  // El middleware authenticateToken ya habrá adjuntado los datos del usuario a req.user
  // Por lo tanto, puedes devolver los datos del usuario como respuesta
  res.json(req.user);
});
// Rutas para la gestión de horarios por parte de los administradores
app.use('/api/admin/calendario', require('./routes/admin/calendario'));
// Rutas para la visualización y reserva de horarios por parte de los pacientes
app.use("/api/patient/reservation", require('./routes/patient/reservation'));

// Rutas para la autenticación y gestión de sesiones de profesionales
app.use("/api/signup/signupProfecionales", require("./routes/signup/signupProfecionales"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/logout"));
app.use("/api/refresh-token", require("./routes/refreshToken"));





app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
