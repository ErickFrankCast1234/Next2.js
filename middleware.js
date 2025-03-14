// Importa NextResponse desde "next/server" para manejar respuestas en middleware
import { NextResponse } from "next/server";

// Importa la funcionalidad de rate limiting (limitación de tasa de solicitudes) desde Upstash
import { RateLimit } from "@upstash/ratelimit";

// Importa la librería de Redis desde Upstash para gestionar almacenamiento en caché y límite de solicitudes
import { Redis } from "@upstash/redis";

// Crea una nueva instancia de Redis utilizando la URL del servicio y un token de autenticación
const redis = new Redis({
  url: "https://also-secret.upstash.io", // URL del servidor Redis
  token: "SECRET_AH_AH_AH", // Token de autenticación para acceder a Redis
});

// Configura el límite de solicitudes utilizando la instancia de Redis
const rateLimit = new RateLimit({
  redis: redis, // Usa Redis para almacenar información del límite de solicitudes
  limiter: RateLimit.slidingWindow(5, "60 s"), // Permite 5 solicitudes por cada 60 segundos
});

// Define la función middleware que manejará las solicitudes entrantes
export default async function middleware(request) {
  // Obtiene la dirección IP del usuario que hace la solicitud
  const ip = request.ip ?? "127.0.0.1"; // Usa la IP del usuario o una IP por defecto

  // Aplica la restricción de tasa usando la IP como identificador único
  const { success, pending, limit, reset, remaining } = await rateLimit.limit(ip);

  // Si la solicitud es válida y está dentro del límite permitido, la deja continuar
  if (success) {
    return NextResponse.next(); // Permite la continuación de la solicitud
  }

  // Si se excedió el límite de solicitudes, redirige al usuario a una página de bloqueo
  return NextResponse.redirect(new URL("/blocked", request.url));
}

// Define la configuración del middleware para que solo se aplique a ciertas rutas
export const config = {
  matcher: "/api/auth/signin/email", // Aplica la restricción solo a esta ruta específica
};
