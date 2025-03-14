"use client"; // Indica que este es un componente de cliente en Next.js

// Importamos las dependencias necesarias
import axios from "axios"; // Para realizar solicitudes HTTP
import { useState } from "react"; // Hook de React para manejar el estado
import toast from "react-hot-toast"; // Para mostrar notificaciones emergentes

// Definimos el componente ButtonPortal
const ButtonPortal = () => {
  // Definimos un estado isLoading para manejar el estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Función asincrónica para manejar la apertura del portal de facturación
  const handleBilling = async () => {
    // Si ya está cargando, evitamos que se ejecute nuevamente
    if (isLoading) return;

    setIsLoading(true); // Activamos el estado de carga

    try {
      // Hacemos una solicitud POST a la API para obtener la URL del portal de facturación
      const response = await axios.post("/api/billing/create-portal", {
        returnUrl: window.location.href, // Pasamos la URL actual para redirigir después del pago
      });

      // Extraemos la URL del portal desde la respuesta de la API
      const portalUrl = response.data.url;

      // Redirigimos al usuario al portal de facturación en una nueva pestaña
      window.open(portalUrl, "_blank");

    } catch (error) {
      // Manejamos errores y mostramos una notificación al usuario
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      toast.error(errorMessage); // Mostramos el mensaje de error
    } finally {
      // Desactivamos el estado de carga en cualquier caso (éxito o error)
      setIsLoading(false);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleBilling} disabled={isLoading}>
      {/* Mostramos un spinner de carga si isLoading es verdadero */}
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Billing Portal"
      )}
    </button>
  );
};

// Exportamos el componente ButtonPortal
export default ButtonPortal;
