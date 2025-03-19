"use client";
// Importación de React y librerías necesarias
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Definición del componente funcional ButtonVote
const ButtonVote = ({ postId, initialVotesCounter }) => {
  // Clave para guardar el estado del voto en localStorage
  const localStorageKeyName = `codefastSaas-hasVoted-${postId}`;

  // Estado para rastrear si el usuario ha votado o no
  const [hasVoted, setHasVoted] = useState(
    localStorage.getItem(localStorageKeyName) === "true"
  );

  // Estado para manejar el estado de carga (loading)
  const [isLoading, setIsLoading] = useState(false);

  // Estado para manejar la cantidad de votos
  const [votesCounter, setVotesCounter] = useState(initialVotesCounter);

  // useEffect para actualizar el estado del voto desde localStorage al montar el componente
  useEffect(() => {
    setHasVoted(localStorage.getItem(localStorageKeyName) === "true");
  }, []);

  // Función asíncrona que maneja la acción de votar
  const handleVote = async () => {
    // Si ya está en proceso de votación, no permitir más acciones
    if (isLoading) return;

    // Activar estado de carga
    setIsLoading(true);

    try {
      if (hasVoted) {
        // Si el usuario ya votó, elimina el voto
        setHasVoted(false);
        setVotesCounter(votesCounter - 1);

        // Llamada DELETE a la API para eliminar el voto
        await axios.delete(`/api/vote?postId=${postId}`);

        // Eliminar el estado de voto en localStorage
        localStorage.removeItem(localStorageKeyName);

        // Notificar éxito
        toast.success("Vote removed!");
      } else {
        // Si el usuario no ha votado, agregar el voto
        setHasVoted(true);
        setVotesCounter(votesCounter + 1);

        // Llamada POST a la API para agregar el voto
        await axios.post(`/api/vote?postId=${postId}`);

        // Guardar el estado de voto en localStorage
        localStorage.setItem(localStorageKeyName, "true");

        // Notificar éxito
        toast.success("Upvoted!");
      }
    } catch (error) {
      // Manejo de errores
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      // Mostrar mensaje de error con toast
      toast.error(errorMessage);
    } finally {
      // Desactivar el estado de carga
      setIsLoading(false);
    }
  };

  // Renderizado del botón con clases dinámicas y SVG para icono
  return (
    <button
      className={`group border px-4 py-2 rounded-xl text-lg duration-200 ${
        hasVoted
          ? "bg-primary text-primary-content border-transparent"
          : "bg-base-100 text-base-content hover:border-base-content/25"
      }`}
      onClick={handleVote}
    >
      {/* SVG del icono del voto con animación en hover */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 group-hover:translate-y-0.5 duration-200"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>

      {/* Indicador de carga o contador de votos */}
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <div>{votesCounter}</div>
      )}
    </button>
  );
};

// Exportación del componente
export default ButtonVote;
