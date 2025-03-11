"use client";

// Importa el componente Link de Next.js para la navegación interna sin recargar la página
import Link from "next/link";

// Importa la función signIn de NextAuth para el manejo de la autenticación
import { signIn } from "next-auth/react";

// Define el componente ButtonLogin que recibe las props 'session' y 'extraStyle'
const ButtonLogin = ({ session, extraStyle }) => {
    
    // Define la URL de redirección al dashboard
    const dashboardUrl = "/dashboard";

    // Si la sesión está activa, muestra un enlace al dashboard con un mensaje de bienvenida
    if (session) {
        return (
            <Link
                href={dashboardUrl} // Enlace al dashboard
                className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
            >
                {/* Muestra el nombre del usuario o "friend" si no hay nombre disponible */}
                Welcome back {session.user.name || "friend"}
            </Link>
        );
    }

    // Si no hay sesión activa, muestra un botón para iniciar sesión
    return (
        <button
            className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
            onClick={() => {
                // Llama a la función signIn para autenticar al usuario
                // undefined indica el proveedor de autenticación predeterminado
                // 'callbackUrl' redirige al dashboard después de iniciar sesión
                signIn(undefined, { callbackUrl: dashboardUrl });
            }}
        >
            Get started
        </button>
    );
};

// Exporta el componente para ser utilizado en otras partes de la aplicación
export default ButtonLogin;

