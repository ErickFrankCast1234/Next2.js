// 📦 Importaciones necesarias
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../libs/mongo";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

// ⚙️ Configuración de NextAuth
const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "noreply@castlesbuy.shop",
      name: "Email",
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,

  // ✅ Para evitar conflicto entre proveedores con el mismo correo
  allowDangerousEmailAccountLinking: true,

  // 🔄 Callbacks
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.emailVerified = user?.emailVerified || null;
      }
      return session;
    },

    async signIn({ user }) {
      try {
        await connectMongo();

        const dbUser = await User.findOne({ email: user.email });

        // Si existe pero aún no está marcado como verificado
        if (dbUser && !dbUser.emailVerified) {
          dbUser.emailVerified = new Date();
          await dbUser.save();
          console.log(`✅ Correo verificado para: ${user.email}`);
        }

        return true; // Permitir login
      } catch (error) {
        console.error("❌ Error en signIn callback:", error.message);
        return false;
      }
    },
  },
};

// 🚀 Exportar controladores
export const { handlers, signIn, signOut, auth } = NextAuth(config);


