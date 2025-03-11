// Importa la función auth desde el módulo de autenticación personalizado "@/auth"
import { auth } from "@/public/auth";

// Importa la función redirect desde el módulo de navegación de Next.js
import { redirect } from "next/navigation";

// Define una función asíncrona LayoutPrivate que recibe el prop 'children'
export default async function LayoutPrivate({ children }) {
    
    // Llama a la función auth para obtener la sesión del usuario autenticado
    const session = await auth();

    // Si no hay sesión activa, redirige al usuario a la página de inicio
    if (!session) {
        redirect("/");
    }

    // Si la sesión es válida, renderiza los componentes secundarios (children)
    return children;
}
