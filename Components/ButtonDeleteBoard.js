"use client"; // Indica que este componente se ejecuta en el cliente

// Importaciones necesarias
import { toast } from "react-hot-toast"; // Biblioteca para mostrar notificaciones
import axios from "axios"; // Cliente HTTP para hacer peticiones a la API
import { useRouter } from "next/navigation"; // Hook para redireccionar entre páginas

// Componente para eliminar un board
const ButtonDeletePost= ({ boardId }) => {
  const router = useRouter(); // Inicializa el router de Next.js

  // Función asincrónica para manejar la eliminación del board
  const handleDeleteBoard = async () => {
    try {
      // Muestra una confirmación antes de eliminar el board
      const isUserSure = window.confirm("Are you sure you want to delete this board?");

      // Si el usuario confirma la eliminación
      if (isUserSure) {
        // Realiza la petición DELETE a la API pasando el boardId
        await axios.delete(`/api/board?boardId=${boardId}`);

        // Muestra un mensaje de éxito con toast
        toast.success("Board deleted!");

        // Redirecciona al usuario al dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      // Manejo de errores en caso de fallo en la eliminación del board
      const errorMessage = 
        error.response?.data?.error || // Obtiene el mensaje de error de la respuesta de la API
        error.message || // Obtiene el mensaje de error por defecto
        "Something went wrong"; // Mensaje genérico si no hay más detalles

      toast.error(errorMessage); // Muestra el mensaje de error con toast
    }
  };

  return (
    <button className="btn btn-ghost" onClick={handleDeleteBoard}>
      {/* Icono SVG para el botón */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.75H2.75a.75.75 0 0 0 0 1.5H3v9.25A2.75 2.75 0 0 0 5.75 18h8.5A2.75 2.75 0 0 0 17 15.25V6h.25a.75.75 0 0 0 0-1.5H14v-.75A2.75 2.75 0 0 0 11.25 1h-2.5Zm4.75 3.75V4a1.25 1.25 0 0 0-1.25-1.25h-2.5A1.25 1.25 0 0 0 8.75 4v.75h4.75ZM5.5 6.75a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Zm4 0a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Zm4 .75a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z"
          clipRule="evenodd"
        />
      </svg>
      Delete
    </button>
  );
};

export default ButtonDeletePost; // Exporta el componente para ser usado en otros archivos

