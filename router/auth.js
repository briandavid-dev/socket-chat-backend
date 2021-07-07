/* 
  path: api/login
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

// crear nuevos usuarios
router.post(
  "/new",
  [
    check("nombre", "El nombre es requerido").isString(),
    check("password", "El password es requerido").not().isEmpty(),
    check("email", "El email es requerido").isEmail(),
    validarCampos,
  ],
  crearUsuario
);

// login
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

// revalidar token
router.get("/renew", validarJWT, renewToken);

module.exports = router;
