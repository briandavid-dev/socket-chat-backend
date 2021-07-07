const {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje,
} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("socket no identificado");
        return socket.disconnect();
      }

      await usuarioConectado(uid);

      // Unir al usuario a una sala de socket.io
      socket.join(uid);

      // TODO: validar el JWT
      // si el token no es válido, desconectar
      //
      // TODO: saber que usuario está activo mediante el UID
      //
      // TODO: Emitir todos los usuarios conectados
      this.io.emit("lista-usuarios", await getUsuarios());

      // TODO: Socket join, uid
      //
      // TODO: Escuchar cuando el cliete manda un mensaje
      socket.on("mensaje-personal", async (payload) => {
        const mensaje = await grabarMensaje(payload);
        this.io.to(payload.para).emit("mensaje-personal", mensaje);
        this.io.to(payload.de).emit("mensaje-personal", mensaje);
      });

      // TODO: Disconnect
      // Marcar en la DB qie el user se desconecto
      // TODO: Emitir todos los usuarios conectados
      socket.on("disconnect", async () => {
        await usuarioDesconectado(uid);

        this.io.emit("lista-usuarios", await getUsuarios());
      });
    });
  }
}

module.exports = Sockets;
