// Importar NextAuth, Resend provider y el adaptador de MongoDB
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../libs/mongo";

// Importamos el proveedor de autenticación con Google
import Google from "next-auth/providers/google";
import connectMongo from "@/libs/mongoose"; // Conexión a MongoDB
import User from "@/models/User"; // Modelo de usuario

// Configuración de NextAuth con el proveedor Resend y el adaptador MongoDB
const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "noreply@castlesbuy.shop",
      name: "Email",
    }),
    Google({
      clientId: process.env.GOOGLE_ID, // Clave del cliente de Google
      clientSecret: process.env.GOOGLE_SECRET, // Secreto del cliente de Google
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,

  // 🔄 Callback para modificar los datos de la sesión antes de enviarlos al frontend
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.emailVerified = user.emailVerified || null; // Asegura que el campo esté presente
      }
      return session;
    },
  },

  // 🔥 Evento para actualizar el usuario cuando inicia sesión
  events: {
    async signIn({ user }) {
      if (user) {
        await connectMongo();
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser && !existingUser.emailVerified) {
          existingUser.emailVerified = new Date(); // ✅ Marca el correo como verificado
          await existingUser.save();
          console.log(`✅ Correo verificado para: ${user.email}`);
        }
      }
    },
  },
};

// Exportar los controladores de autenticación
export const { handlers, signIn, signOut, auth } = NextAuth(config);

