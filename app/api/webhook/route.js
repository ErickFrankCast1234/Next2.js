import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("🚨 Error verificando webhook:", err.message);
      return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
    }

    console.log("📩 Evento recibido:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_email;
      const customerId = session.customer; // 🔹 ID del cliente en Stripe

      console.log("✅ Sesión completada. Asignando Customer ID...");
      console.log("📄 Datos de la sesión:", session);

      if (!customerEmail || !customerId) {
        console.error("❌ No se encontró email o customerId en la sesión.");
        return NextResponse.json({ error: "Missing email or customerId" }, { status: 400 });
      }

      await connectMongo();
      const user = await User.findOne({ email: customerEmail });

      if (user) {
        user.hasAccess = true; // 🟢 Se otorga acceso después del pago
        user.customerId = customerId; // 🔹 Guardamos el customerId de Stripe
        await user.save();

        console.log(`✅ Usuario ${customerEmail} ahora tiene acceso y su customerId es ${customerId}`);
      } else {
        console.error(`❌ Usuario con email ${customerEmail} no encontrado en la base de datos.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error en el webhook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
