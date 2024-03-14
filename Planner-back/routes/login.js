const express = require("express"); const User = require("../schema/user"); const { jsonResponse } = require("../lib/jsonResponse"); const getUserInfo = require("../lib/getUserInfo"); const router = express.Router();

router.post("/", async function (req, res, next) { const { email, password } = req.body;

try { let user = new User(); const userExists = await user.emailExists(email);

if (userExists) {
  user = await User.findOne({ email: email });

  const passwordCorrect = await user.isCorrectPassword(
    password,
    user.password
  );

  if (passwordCorrect) {
    const accessToken = user.createAccessToken({
      rol: user.rol,
    });
  
    const refreshToken = await user.createRefreshToken();
  
    console.log({ accessToken, refreshToken });
  
    return res.json(
      jsonResponse(200, {
        accessToken,
        refreshToken,
        user: getUserInfo(user),
      })
    );
  } else {
    // Mensaje de error genérico
    return res.status(401).json(
      jsonResponse(401, {
        error: "Correo o contraseña incorrecta",
      })
    );
  }
} else {
  // Mensaje de error genérico
  return res.status(401).json(
    jsonResponse(401, {
      error: "Correo o contraseña incorrecta",
    })
  );
}
} catch (err) { console.log(err); return res.status(500).json(jsonResponse(500, { mensaje: "Error del servidor" })) } });

module.exports = router;