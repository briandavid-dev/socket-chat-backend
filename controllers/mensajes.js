const Mensaje = require("../models/mensaje");

module.exports.obtenerChat = async (req, res) => {
  const uid = req.uid;
  const mensajesDe = req.params.de;

  const last30 = await Mensaje.find({
    $or: [
      { de: uid, para: mensajesDe },
      { de: mensajesDe, para: uid },
    ],
  })
    .sort({ createdAt: "asc" })
    .limit(30);

  res.json({ hola: true, mensajes: last30 });
};
