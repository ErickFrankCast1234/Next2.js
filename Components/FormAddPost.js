"use client"; // Indica que este es un componente de React que se ejecuta en el cliente

// Importamos las dependencias necesarias
import { useState, useEffect } from "react"; // Hooks de React para manejar estado y efectos secundarios
import { useRouter } from "next/navigation"; // Hook de Next.js para manejar la navegación
import axios from "axios"; // Librería para realizar solicitudes HTTP
import toast from "react-hot-toast"; // Librería para mostrar notificaciones emergentes

// Definimos el componente FormAddPost y recibimos el boardId como prop
const FormAddPost = ({ boardId }) => {
  const router = useRouter(); // Hook para manejar la navegación en Next.js

  // Definimos estados para los datos del formulario y el estado de carga
  const [title, setTitle] = useState(""); // Estado para almacenar el título del post
  const [description, setDescription] = useState(""); // Estado para almacenar la descripción del post
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si la solicitud está en proceso

  // Efecto secundario que se ejecuta cuando el componente se monta
  useEffect(() => {
    // Muestra un toast de prueba cuando la página se carga
    toast.success("Toast de prueba: Página cargada correctamente!");
  }, []); // Se ejecuta solo una vez, al montar el componente

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página por defecto

    console.log("➡️ Enviando post...");

    // Si ya hay una solicitud en proceso, se cancela el envío
    if (isLoading) {
      console.log("⚠️ Ya hay una solicitud en proceso. Se cancela el envío.");
      return;
    }

    setIsLoading(true); // Activamos el estado de carga

    try {
      console.log("📡 Datos enviados:", { title, description });

      // Enviamos la solicitud POST a la API con el título y la descripción
      const response = await axios.post(`/api/post?boardId=${boardId}`, {
        title,
        description,
      });

      console.log("✅ Respuesta del servidor:", response.data);

      // Reiniciamos los campos del formulario después de una solicitud exitosa
      setTitle("");
      setDescription("");

      console.log("✅ Post añadido correctamente antes de mostrar toast.");

      // 🔥 Mostramos un mensaje de éxito antes de recargar la página
      toast.success("Post added!");

      // ⏳ Esperamos 2 segundos antes de refrescar la página para que se vea el toast
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 🔄 Refrescamos la página para mostrar el nuevo post
      router.refresh();
    } catch (error) {
      console.error("❌ Error al publicar el post:", error);

      // Capturamos el mensaje de error si ocurre un problema en la solicitud
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      console.log("⚠️ Mensaje de error:", errorMessage);

      // Mostramos el mensaje de error en un toast
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Desactivamos el estado de carga después de la respuesta
      console.log("ℹ️ Formulario listo para otro envío.");
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8 w-full md:w-96 shrink-0 md:sticky top-8"
      onSubmit={handleSubmit} // Manejamos el envío del formulario
    >
      {/* Mensaje de encabezado */}
      <p className="font-bold text-lg">Suggest a feature</p>

      {/* Campo de entrada para el título */}
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Short, descriptive title</span>
        </div>
        <input
          required
          type="text"
          placeholder="Enter a title"
          className="input input-bordered w-full"
          value={title} // Enlazamos el estado con el campo de entrada
          onChange={(event) => setTitle(event.target.value)} // Actualizamos el estado al escribir
          maxLength={100} // Se limita el título a 100 caracteres
        />
      </label>

      {/* Campo de entrada para la descripción */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">Description</span>
        </div>
        <textarea
          value={description} // Enlazamos el estado con el campo de entrada
          onChange={(event) => setDescription(event.target.value)} // Actualizamos el estado al escribir
          className="textarea textarea-bordered h-24"
          placeholder="Provide a detailed description"
          maxLength={1000} // Se limita la descripción a 1000 caracteres
        />
      </label>

      {/* Botón de envío */}
      <button className="btn btn-primary w-full" type="submit">
        {/* Mostramos un spinner de carga si isLoading está activo */}
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Add Post
      </button>
    </form>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default FormAddPost;
