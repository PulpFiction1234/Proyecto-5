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

  res.json(req.user);
});

app.use('/api/admin/calendario', require('./routes/admin/calendario'));

app.use("/api/signup/signupProfecionales", require("./routes/signup/signupProfecionales"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/logout"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/create-orders", require ("./routes/createOrders"))




app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
