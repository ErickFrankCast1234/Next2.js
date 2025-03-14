"use client"; // Habilita el uso de hooks en un componente de cliente en Next.js

// Importamos los módulos necesarios
import { useState } from "react"; // Hook para manejar el estado en React
import { toast } from "react-hot-toast"; // Librería para mostrar notificaciones
import axios from "axios"; // Cliente HTTP para hacer peticiones a la API
import { useRouter } from "next/navigation"; // Hook para manejar la navegación en Next.js

// Definimos el componente funcional ButtonDeletePost, que recibe un postId como prop
const ButtonDeletePost = ({ postId }) => {
  // Hook para manejar la navegación
  const router = useRouter();

  // Hook de estado para controlar la carga mientras se elimina un post
  const [isLoading, setIsLoading] = useState(false);

  // Función asíncrona para manejar la eliminación del post
  const handleDeletePost = async () => {
    try {
      // Confirmación del usuario antes de eliminar
      const isUserSure = window.confirm("Are you sure you want to delete this post?");

      // Si el usuario cancela o ya hay una petición en curso, no hacemos nada
      if (!isUserSure || isLoading) return;

      // Activamos el estado de carga
      setIsLoading(true);

      // Petición DELETE a la API con el postId
      await axios.delete(`/api/post?postId=${postId}`);

      // Notificación de éxito
      toast.success("Post deleted!");

      // Refrescamos la página para actualizar la lista de posts
      router.refresh();
    } catch (error) {
      // Capturamos el error y mostramos un mensaje
      const errorMessage = error.response?.data?.error || error.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      // Desactivamos el estado de carga al finalizar la operación
      setIsLoading(false);
    }
  };

  return (
    // Botón para eliminar el post, con estilos y función de eliminación
    <button className="btn btn-ghost" onClick={handleDeletePost} disabled={isLoading}>
      {/* Si el post se está eliminando, mostramos un spinner */}
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        // Ícono de eliminación si no está cargando
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path
            fillRule="evenodd"
            d="M8.75 2a.75.75 0 0 1 .75.75V3.5h2.5v-.75a.75.75 0 0 1 1.5 0V3.5h1.25a.75.75 0 0 1 0 1.5H4.25a.75.75 0 0 1 0-1.5H5.5v-.75A.75.75 0 0 1 7 2v1.5h2.5V2.75a.75.75 0 0 1 .75-.75zm-4 5.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75V15a2.5 2.5 0 0 1-2.5 2.5H7.25A2.5 2.5 0 0 1 4.75 15V7.5zm3.5 2.25a.75.75 0 0 0-1.5 0V14a.75.75 0 0 0 1.5 0V9.75zm3 0a.75.75 0 0 0-1.5 0V14a.75.75 0 0 0 1.5 0V9.75zm3 0a.75.75 0 0 0-1.5 0V14a.75.75 0 0 0 1.5 0V9.75z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default ButtonDeletePost;
