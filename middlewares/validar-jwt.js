const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      res.json({
        ok: false,
        msg: "No hay token en la peticion",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = payload.uid;
    req.nombre = payload.nombre;
    req.email = payload.email;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no es valido",
    });
  }
};

module.exports = { validarJWT };
