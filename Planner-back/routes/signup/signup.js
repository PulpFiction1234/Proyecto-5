const express = require("express");
const User = require("../../schema/user");
const { jsonResponse } = require("../../lib/jsonResponse");
const router = express.Router();

router.post("/", async function (req, res, next) {
  const { name, lastname, birthdate, gender, email, phone, password } = req.body;

  if (!name || !lastname || !birthdate || !gender || !email || !phone || !password) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "Complete los campos",
      })
    );
  }

  try {
    const user = new User();
    const emailExists = await user.emailExists(email);

    if (emailExists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Correo en uso",
        })
      );
    } else {
      const user = new User({ name, lastname, birthdate, gender, email, phone, password });
      await user.save();

      res.json(
        jsonResponse(200, {
          message: "Usuario Creado",
        })
      );
    }
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al crear usuario",
      })
    );
  }
});

module.exports = router;