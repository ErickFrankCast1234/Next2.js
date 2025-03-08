// auth.js

// Importar NextAuth, Resend provider y el adaptador de MongoDB
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../libs/mongo";

// Configuración de NextAuth con el proveedor Resend y el adaptador MongoDB
const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "noreply@castlesbuy.shop",
      name: "Email",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
};

// Exportar los controladores de autenticación
export const { handlers, signIn, signOut, auth } = NextAuth(config);
