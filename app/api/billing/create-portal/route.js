// Importamos las dependencias necesarias
import { NextResponse } from "next/server"; // Para manejar respuestas HTTP en Next.js
import { auth } from "@/public/auth"; // Middleware de autenticación (Asegura que la ruta es correcta)
import connectMongo from "@/libs/mongoose"; // Conexión a MongoDB
import User from "@/models/User"; // Modelo de usuario en la base de datos
import Stripe from "stripe"; // Importamos Stripe para manejar pagos

// Definimos una función asincrónica para manejar la petición POST
export async function POST(req) {
  try {
    console.log("🔹 Recibiendo solicitud POST en /api/billing/create-portal");

    // Extraemos el cuerpo de la solicitud
    const body = await req.json();
    console.log("📩 Body recibido:", body);

    // Verificamos que la URL de retorno esté presente en la solicitud
    if (!body.returnUrl) {
      console.error("❌ Falta returnUrl en la solicitud");
      return NextResponse.json(
        { error: "Return URL is required" },
        { status: 400 }
      );
    }

    // Obtenemos la sesión del usuario autenticado
    let session;
    try {
      session = await auth();
      console.log("✅ Sesión de usuario obtenida:", session);
    } catch (error) {
      console.error("❌ Error obteniendo sesión:", error);
      return NextResponse.json(
        { error: "Error fetching user session" },
        { status: 500 }
      );
    }

    // Conectamos a la base de datos MongoDB
    try {
      await connectMongo();
      console.log("✅ Conectado a MongoDB");
    } catch (error) {
      console.error("❌ Error conectando a MongoDB:", error);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Buscamos al usuario en la base de datos con el ID de la sesión
    let user;
    try {
      user = await User.findById(session.user.id);

      if (!user) {
        console.error("❌ Usuario no encontrado en la base de datos");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log("✅ Usuario encontrado:", user);
    } catch (error) {
      console.error("❌ Error buscando usuario en la base de datos:", error);
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 }
      );
    }

    // ✅ Validamos que el usuario tenga un `customerId` en Stripe
    if (!user.customerId) {
      console.error("❌ Error: El usuario no tiene un customerId en Stripe");
      return NextResponse.json(
        { error: "User is not linked to a Stripe customer" },
        { status: 400 }
      );
    }

    // ✅ Validamos que `STRIPE_SECRET_KEY` esté configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ Error: STRIPE_SECRET_KEY no está configurado");
      return NextResponse.json(
        { error: "Stripe secret key missing" },
        { status: 500 }
      );
    }

    // ✅ Inicializamos Stripe con la clave secreta
    let stripe;
    try {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      console.log("✅ Instancia de Stripe creada");
    } catch (error) {
      console.error("❌ Error creando instancia de Stripe:", error);
      return NextResponse.json(
        { error: "Stripe initialization failed" },
        { status: 500 }
      );
    }

    // ✅ Creamos una sesión del portal de facturación en Stripe
    try {
      const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
        customer: user.customerId, // Identificador del cliente en Stripe
        return_url: body.returnUrl, // URL a la que se redirige después de gestionar la suscripción
      });

      console.log("✅ Sesión de facturación creada en Stripe:", stripeCustomerPortal);

      // Retornamos la URL generada por Stripe para que el usuario gestione su suscripción
      return NextResponse.json({ url: stripeCustomerPortal.url });

    } catch (error) {
      console.error("❌ Error creando sesión de facturación en Stripe:", error.raw || error);

      return NextResponse.json(
        { 
          error: "Failed to create Stripe billing session", 
          stripeError: error.raw || error 
        },
        { status: 500 }
      );
    }

  } catch (e) {
    // Capturamos errores generales y devolvemos una respuesta con código 500
    console.error("❌ Error inesperado en la API:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
