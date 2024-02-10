const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("Conectado a la base de datos");
}

app.use("/api/signup/signupProfecionales", require("./routes/signup/signupProfecionales"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/logout"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/posts", authenticateToken, require("./routes/posts"));
app.use("/api/user", authenticateToken, require("./routes/user"));
app.use("/api/calendario", authenticateToken, require("./routes/calendario"));



app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;