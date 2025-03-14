// Importamos mongoose, que nos permite interactuar con MongoDB
import mongoose from "mongoose";

// Definimos el esquema de la colección "Post"
const postSchema = new mongoose.Schema(
  {
    // Título del post, debe ser un string obligatorio con un máximo de 100 caracteres
    title: {
      type: String, // Tipo de dato: String
      required: true, // Es obligatorio
      trim: true, // Elimina espacios en blanco al inicio y al final
      maxLength: 100, // Máximo de 100 caracteres
    },

    // Descripción del post, un string obligatorio con un máximo de 1000 caracteres
    description: {
      type: String, // Tipo de dato: String
      trim: true, // Elimina espacios en blanco al inicio y al final
      maxLength: 1000, // Máximo de 1000 caracteres
    },

    // ID del tablero al que pertenece el post (relación con la colección "Board")
    boardId: {
      type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
      required: true, // Es obligatorio
      ref: "Board", // Referencia a la colección "Board"
    },

    // ID del usuario que creó el post (relación con la colección "User")
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId de MongoDB
      ref: "User", // Referencia a la colección "User"
    },

    // Contador de votos, inicia en 0 por defecto
    votesCounter: {
      type: Number, // Tipo de dato: Número
      default: 0, // Valor por defecto: 0
    },
  },

  {
    // Agrega automáticamente "createdAt" y "updatedAt" para rastrear cuándo se creó y actualizó un post
    timestamps: true,
  }
);

// Exportamos el modelo "Post"
// Si el modelo "Post" ya está definido en mongoose, lo reutilizamos, sino lo creamos con el esquema definido
export default mongoose.models.Post || mongoose.model("Post", postSchema);
