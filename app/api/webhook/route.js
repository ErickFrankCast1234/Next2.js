// Archivo: route.js (Manejador de Webhooks de Stripe)

// Importamos las dependencias necesarias
import { headers } from "next/headers"; // Para obtener las cabeceras de la solicitud
import Stripe from "stripe"; // SDK de Stripe
import connectMongo from "@/libs/mongoose"; // Conexión a la base de datos
import User from "@/models/User"; // Modelo de usuario en MongoDB
import { NextResponse } from "next/server"; // Para manejar respuestas HTTP en Next.js

// Definimos la función asincrónica para manejar las solicitudes POST (webhooks)
export async function POST(req) {
  try {
    // Creamos una nueva instancia de Stripe con la clave de API
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    // Extraemos el cuerpo de la solicitud en texto plano
    const body = await req.text();

    // Extraemos la firma de la cabecera del webhook
    const signature = headers().get("stripe-signature");

    // Se obtiene el secreto del webhook desde las variables de entorno
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verificamos y construimos el evento del webhook de Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Extraemos el tipo de evento y sus datos
    const { data, type } = event;

    await connectMongo(); // Conectamos a la base de datos MongoDB

    // ✅ **Cuando la suscripción se completa, damos acceso**
    if (type === "checkout.session.completed") {
      console.log("✅ Suscripción completada. Otorgando acceso...");

      // Buscamos al usuario en la base de datos utilizando el ID de referencia de Stripe
      const user = await User.findById(data.object.client_reference_id);

      // Si el usuario existe, le otorgamos acceso al producto
      if (user) {
        user.hasAccess = true; // Marcamos que el usuario tiene acceso
        user.customerId = data.object.customer; // Guardamos el ID del cliente de Stripe
        await user.save(); // Guardamos los cambios en la base de datos
        console.log("✅ Acceso otorgado a:", user.email);
      } else {
        console.error("❌ Usuario no encontrado en la base de datos.");
      }
    }

    // ❌ **Cuando la suscripción se cancela, revocamos acceso**
    else if (type === "customer.subscription.deleted") {
      console.log("❌ Suscripción cancelada. Revocando acceso...");

      // Buscamos al usuario por el ID de cliente de Stripe
      const user = await User.findOne({ customerId: data.object.customer });

      // Si el usuario existe, le revocamos el acceso
      if (user) {
        user.hasAccess = false; // Revocamos acceso
        await user.save(); // Guardamos los cambios
        console.log("✅ Acceso revocado a:", user.email);
      } else {
        console.error("❌ No se encontró el usuario con ese Customer ID.");
      }
    }
  } catch (e) {
    // Capturamos y mostramos cualquier error en consola
    console.error("Stripe error: " + e.message);
  }

  // Retornamos una respuesta vacía con código 200 para confirmar la recepción del webhook
  return NextResponse.json({});
}
