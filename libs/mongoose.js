// CONEXIÓN A MONGODB Y CARGA DE MODELOS

import mongoose from "mongoose";

// Importar los modelos para asegurarse de que están registrados antes de usarlos
import User from "@/models/User";
import Board from "@/models/Board";

// Variable para rastrear el estado de conexión
let isConnected = false; // ⚠️ Previene múltiples conexiones innecesarias

const connectMongo = async () => {
    try {
        if (isConnected) {
            console.log("✅ Ya está conectado a MongoDB");
            return;
        }

        // Conectar con MongoDB usando la URI de las variables de entorno
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = db.connections[0].readyState === 1; // Verifica si la conexión está lista
        console.log("✅ Conectado a MongoDB");

    } catch (e) {
        console.error("❌ Mongoose Error: " + e.message);
        throw new Error("Error al conectar con MongoDB");
    }
};

// Exportar la función para usarla en toda la aplicación
export default connectMongo;

