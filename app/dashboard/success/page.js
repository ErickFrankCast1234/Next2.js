// Archivo: page.js

// Importamos el componente Link de Next.js para la navegación
import Link from "next/link";

// Definimos el componente de la página de éxito de compra
export default async function SuccessPage() {
  return (
    // Contenedor principal de la página con clases de TailwindCSS para diseño responsivo
    <main className="min-h-screen flex flex-col justify-center items-center gap-8">
      {/* Mensaje de agradecimiento por la compra */}
      <h1 className="text-xl font-bold">Thanks for your purchase ✅</h1>
      
      {/* Enlace para redirigir al usuario al dashboard */}
      <Link href="/dashboard" className="btn btn-primary">
        Dashboard
      </Link>
    </main>
  );
}
