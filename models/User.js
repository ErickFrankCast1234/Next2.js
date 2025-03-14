// User.js (Modelo de Mongoose usando CommonJS)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  // 🔐 Indica si el usuario tiene acceso a ciertas funciones o permisos
  hasAccess: {
    type: Boolean, // Valor verdadero o falso
    default: false, // Por defecto, no tiene acceso
  },

  // 🆔 Identificador del cliente asociado al usuario (si aplica)
  customerId: {
    type: String, // Almacena un ID como cadena de texto
  },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
