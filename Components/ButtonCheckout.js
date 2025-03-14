// Archivo: ButtonCheckout.js

"use client"; // Asegura que este componente se ejecute en el cliente

// Importamos las dependencias necesarias
import axios from "axios"; // Para hacer solicitudes HTTP
import { useState } from "react"; // Para manejar el estado en React
import toast from "react-hot-toast"; // Para mostrar notificaciones al usuario

// Definimos el componente ButtonCheckout
const ButtonCheckout = () => {
  // Estado para manejar el estado de carga del botón
  const [isLoading, setIsLoading] = useState(false);

  // Función asincrónica que maneja el flujo de suscripción al hacer clic en el botón
  const handleSubscribe = async () => {
    if (isLoading) return; // Evita que se ejecute múltiples veces si ya está cargando

    setIsLoading(true); // Cambia el estado para indicar que el proceso está en curso

    try {
      // Realiza una solicitud POST a la API para crear la sesión de checkout en Stripe
      const response = await axios.post("/api/billing/create-checkout", {
        successUrl: window.location.href + "/success", // URL de éxito
        cancelUrl: window.location.href, // URL de cancelación
      });

      // Extrae la URL de checkout devuelta por la API
      const checkoutUrl = response.data.url;

      // Redirige al usuario a la URL de Stripe para completar el pago
      window.location.href = checkoutUrl;
    } catch (error) {
      // Manejo de errores: muestra un mensaje de error si algo falla
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      toast.error(errorMessage); // Muestra el error en una notificación
      setIsLoading(false); // Restaura el estado de carga
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleSubscribe} disabled={isLoading}>
      {/* Muestra un spinner si el estado de carga está activo */}
      {isLoading && <span className="loading loading-spinner loading-xs"></span>}
      Subscribe
    </button>
  );
};

export default ButtonCheckout; // Exportamos el componente para su uso en otras partes del proyecto
