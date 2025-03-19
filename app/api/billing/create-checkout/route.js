// Importamos las dependencias necesarias
import { NextResponse } from "next/server"; // Para manejar respuestas HTTP en Next.js
import { auth } from "@/public/auth"; // Middleware de autenticación (Asegura que la ruta es correcta)
import connectMongo from "@/libs/mongoose"; // Conexión a MongoDB
import User from "@/models/User"; // Modelo de usuario en la base de datos
import Stripe from "stripe"; // Importamos Stripe para manejar pagos

export async function POST(req) {
  try {
    console.log("🔹 Recibiendo solicitud POST en /api/billing/create-checkout");

    // 1️⃣ Extraer el cuerpo de la solicitud
    const body = await req.json();
    console.log("📩 Body recibido:", body);

    if (!body.successUrl || !body.cancelUrl) {
      console.error("❌ Falta successUrl o cancelUrl");
      return NextResponse.json({ error: "Missing success or cancel URLs" }, { status: 400 });
    }

    // 2️⃣ Obtener la sesión del usuario autenticado
    let session;
    try {
      session = await auth();
      console.log("✅ Sesión obtenida:", session);
    } catch (error) {
      console.error("❌ Error en `auth()`: ", error);
      return NextResponse.json({ error: "User session error" }, { status: 500 });
    }

    // 3️⃣ Conectar a MongoDB
    try {
      await connectMongo();
      console.log("✅ Conectado a MongoDB");
    } catch (error) {
      console.error("❌ Error conectando a MongoDB:", error);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // 4️⃣ Buscar usuario en MongoDB
    let user;
    try {
      user = await User.findById(session?.user?.id);
      if (!user) {
        console.error("❌ Usuario no encontrado en MongoDB");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      console.log("✅ Usuario encontrado:", user);
    } catch (error) {
      console.error("❌ Error buscando usuario en DB:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // 5️⃣ Validar variables de entorno necesarias
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY no está configurado");
      return NextResponse.json({ error: "Stripe secret key missing" }, { status: 500 });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error("❌ STRIPE_PRICE_ID no está configurado");
      return NextResponse.json({ error: "Stripe price ID missing" }, { status: 500 });
    }

    if (!user.email) {
      console.error("❌ Usuario no tiene email registrado");
      return NextResponse.json({ error: "User email required" }, { status: 400 });
    }

    // 6️⃣ Inicializar Stripe con la clave secreta
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("✅ Instancia de Stripe creada");

    // 7️⃣ Crear una sesión de pago en Stripe
    try {
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        success_url: body.successUrl,
        cancel_url: body.cancelUrl,
        customer_email: user.email,
        client_reference_id: user._id.toString(),
      });

      console.log("✅ Sesión de pago creada:", stripeCheckoutSession);
      return NextResponse.json({ url: stripeCheckoutSession.url });

    } catch (error) {
      console.error("❌ Error en `Stripe.checkout.sessions.create()`:", error);
      return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
    }

  } catch (e) {
    console.error("❌ Error inesperado:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
