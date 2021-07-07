const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El email ya existe",
      });
    }

    // guardar user en databse
    const usuario = new Usuario(req.body);

    // encriptar pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // generar JWT
    const token = await generarJWT(usuario.id, usuario.nombre, usuario.email);

    res.json({
      ok: true,
      token,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

const login = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // validar el password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password no es correcto",
      });
    }

    // generar JWT
    const token = await generarJWT(
      usuarioDB.id,
      usuarioDB.nombre,
      usuarioDB.email
    );

    res.status(200).json({
      ok: true,
      token,
      usuario: usuarioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

const renewToken = async (req, res = response) => {
  // generar JWT
  const token = await generarJWT(req.uid, req.nombre, req.email);

  // obtener el usuario por uid
  const usuario = await Usuario.findById(req.uid);

  res.json({
    ok: true,
    token,
    usuario,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
