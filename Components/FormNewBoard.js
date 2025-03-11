// FormNewBoard.js - Componente para crear un nuevo tablero de retroalimentación

"use client"; // Indica que este componente es del lado del cliente

// Importar dependencias necesarias
import { useState } from "react"; // Hook para manejar el estado del componente
import { useRouter } from "next/navigation"; // Para navegar y refrescar rutas en Next.js
import axios from "axios"; // Biblioteca para hacer solicitudes HTTP
import toast from "react-hot-toast";

// Definir el componente FormNewBoard
const FormNewBoard = () => {
  const router = useRouter(); // Crear una instancia del enrutador de Next.js

  // Definir estados locales para el nombre del tablero y el estado de carga
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Manejar el evento de envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Si ya está cargando, no permitir múltiples solicitudes
    if (isLoading) return;

    setIsLoading(true); // Establecer el estado de carga a verdadero

    try {
      // Enviar la solicitud para crear un nuevo tablero
      const data = await axios.post("/api/board", { name });

      setName(""); // Reiniciar el campo del nombre del tablero

      router.refresh(); // Refrescar la página para mostrar los nuevos tableros
    } catch (error) {
      // Obtener el mensaje de error de la respuesta de la API o usar un mensaje genérico
      const errorMessage =
        error.response?.data?.error || // Mensaje de error específico de la respuesta de la API
        error.message || // Mensaje de error estándar de JavaScript
        "Something went wrong"; // Mensaje predeterminado si no se obtiene otro

      // Mostrar el mensaje de error con una notificación emergente (toast)
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Restablecer el estado de carga
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new feedback board</p>

      {/* Campo de entrada para el nombre del tablero */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Board name</span>
        </div>

        <input
          required // Campo obligatorio
          type="text"
          placeholder="Future Unicorn Inc. 🦄"
          className="input input-bordered w-full"
          value={name}
          onChange={(event) => setName(event.target.value)} // Actualizar el estado con el valor ingresado
        />
      </label>

      {/* Botón de envío con un spinner de carga */}
      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={isLoading} // Desactivar el botón mientras se carga
      >
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        Create Board
      </button>
    </form>
  );
};

// Exportar el componente como predeterminado
export default FormNewBoard;
