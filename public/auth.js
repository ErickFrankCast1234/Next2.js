// auth.js

// Importar NextAuth y el adaptador de MongoDB
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

// Importar la promesa del cliente de MongoDB
import clientPromise from "../libs/mongo";


// Configuración de NextAuth
const config = {
  providers: [],
  adapter: MongoDBAdapter(clientPromise),
};

// Exportar los controladores de autenticación
export const { handlers, signIn, signOut, auth } = NextAuth(config);

