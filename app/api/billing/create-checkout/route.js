// Importamos las dependencias necesarias
import { NextResponse } from "next/server"; // Para manejar respuestas HTTP en Next.js
import { auth } from "@/public/auth"; // Middleware de autenticación (Asegura que la ruta es correcta)
import connectMongo from "@/libs/mongoose"; // Conexión a MongoDB
import User from "@/models/User"; // Modelo de usuario en la base de datos
import Stripe from "stripe"; // Importamos Stripe para manejar pagos

// Definimos una función asincrónica para manejar la petición POST
export async function POST(req) {
  try {
    console.log("🔹 Recibiendo solicitud POST en /api/billing/create-checkout");

    // Extraemos el cuerpo de la solicitud
    const body = await req.json();
    console.log("📩 Body recibido:", body);

    // Validamos que los campos successUrl y cancelUrl estén presentes
    if (!body.successUrl || !body.cancelUrl) {
      console.error("❌ Error: Falta successUrl o cancelUrl");
      return NextResponse.json(
        { error: "Success and cancel URLs are required" },
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
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.log("✅ Usuario encontrado:", user);
    } catch (error) {
      console.error("❌ Error buscando usuario en la base de datos:", error);
      return NextResponse.json(
        { error: "Error fetching user data" },
        { status: 500 }
      );
    }

    // Creamos una nueva instancia de Stripe con la clave de API
    let stripe;
    try {
      stripe = new Stripe(process.env.STRIPE_API_KEY);
      console.log("✅ Instancia de Stripe creada");
    } catch (error) {
      console.error("❌ Error creando instancia de Stripe:", error);
      return NextResponse.json(
        { error: "Stripe initialization failed" },
        { status: 500 }
      );
    }

    // Creamos una nueva sesión de pago en Stripe
    try {
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"], // Agrega tarjetas como método de pago
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: body.successUrl,
        cancel_url: body.cancelUrl,
        customer_email: user.email,
        client_reference_id: user._id.toString(),
      });
      

      console.log("✅ Sesión de pago creada en Stripe:", stripeCheckoutSession);

      // Retornamos la URL de la sesión de pago de Stripe
      return NextResponse.json({ url: stripeCheckoutSession.url });
    } catch (error) {
      console.error("❌ Error creando sesión de pago en Stripe:", error);
      return NextResponse.json(
        { error: "Failed to create Stripe checkout session" },
        { status: 500 }
      );
    }
  } catch (e) {
    // Capturamos errores generales y devolvemos una respuesta con código 500
    console.error("❌ Error inesperado en la API:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
