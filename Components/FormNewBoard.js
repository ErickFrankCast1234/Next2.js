// FormNewBoard.js - Componente para crear un nuevo tablero de retroalimentación

"use client"; // Indica que este componente es del lado del cliente

// Importar dependencias necesarias
import { useState } from "react"; // Hook para manejar el estado del componente
import { useRouter } from "next/navigation"; // Para navegar y refrescar rutas en Next.js
import axios from "axios"; // Biblioteca para hacer solicitudes HTTP
import toast from "react-hot-toast";

const FormNewBoard = () => {
  const router = useRouter(); // Crear una instancia del enrutador de Next.js
  const [name, setName] = useState(""); // Estado para el nombre del tablero
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Estado para el mensaje de error

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    if (isLoading) return; // Evitar múltiples envíos
    setIsLoading(true);
    setError(""); // Limpiar errores previos

    try {
      await axios.post("/api/board", { name });
      setName(""); // Reiniciar el campo del nombre del tablero
      router.refresh(); // Refrescar la página para mostrar los nuevos tableros
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";

      setError(errorMessage); // Guardar el mensaje de error en el estado
      toast.error(errorMessage); // Mostrar una notificación emergente
    } finally {
      setIsLoading(false); // Restablecer el estado de carga
    }
  };

  return (
    <form className="bg-base-100 p-8 rounded-3xl space-y-8" onSubmit={handleSubmit}>
      {/* 🔹 Muestra el mensaje de error si existe */}
      {error && (
        <div className="p-3 bg-red-200 text-red-800 rounded">
          ❌ {error}
        </div>
      )}

      <p className="font-bold text-lg">Create a new feedback board</p>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Board name</span>
        </div>

        <input
          required
          type="text"
          placeholder="Future Unicorn Inc. 🦄"
          className="input input-bordered w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Create Board
      </button>
    </form>
  );
};

export default FormNewBoard;
