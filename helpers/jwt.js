const jwt = require("jsonwebtoken");

const generarJWT = (uid, nombre, email) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, nombre, email };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se epudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = (token = "") => {
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    return [true, uid];
  } catch (error) {
    return [false, null];
  }
};

module.exports = {
  generarJWT,
  comprobarJWT,
};
