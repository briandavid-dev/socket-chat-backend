const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB online");
  } catch (error) {
    console.log(`error`, error);
    throw new Error("Error en la base de datos - show logs");
  }
};

module.exports = { dbConnection };
