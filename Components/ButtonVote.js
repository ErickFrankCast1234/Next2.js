"use client";

// Importamos los hooks necesarios de React y las librerías auxiliares
import { useState } from "react"; // Hook para manejar estado
import axios from "axios"; // Librería para hacer peticiones HTTP
import { toast } from "react-hot-toast"; // Librería para mostrar notificaciones
import { useEffect } from "react";

// Definimos el componente funcional ButtonVote
const ButtonVote = ({ postId, initialVotesCounter }) => {
    // Creamos una clave única en localStorage basada en el postId
    const localStorageKeyName = `codefastSaaS-hasVoted-${postId}`;
  
    // Estado para rastrear si el usuario ya ha votado o no
    const [hasVoted, setHasVoted] = useState(false);
  
    // Estado para manejar si la solicitud está en proceso (cargando)
    const [isLoading, setIsLoading] = useState(false);
  
    // Estado para manejar el contador de votos
    const [votesCounter, setVotesCounter] = useState(initialVotesCounter);
  
    // Efecto secundario para recuperar el estado del voto desde localStorage al montar el componente
    useEffect(() => {
      setHasVoted(localStorage.getItem(localStorageKeyName) === "true");
    }, []);
  
    // Función asíncrona para manejar el voto
    const handleVote = async () => {
      // Evita que se ejecute la función si ya está en proceso una solicitud
      if (isLoading) return;
  
      // Establece el estado de carga en true
      setIsLoading(true);
  
      try {
        // Si el usuario ya ha votado, elimina el voto
        if (hasVoted) {
          await axios.delete(`/api/vote?postId=${postId}`);
          setHasVoted(false);
          setVotesCounter(votesCounter - 1);
          toast.success("Vote removed!");
          localStorage.removeItem(localStorageKeyName); // Elimina el estado guardado en localStorage
        } 
        // Si el usuario no ha votado, agrega el voto
        else {
          await axios.post(`/api/vote?postId=${postId}`);
          setHasVoted(true);
          setVotesCounter(votesCounter + 1);
          toast.success("Upvoted!");
          localStorage.setItem(localStorageKeyName, "true"); // Guarda el estado en localStorage
        }
      } catch (error) {
        // Manejo de errores, muestra una notificación con el error
        const errorMessage = error.response?.data?.error || error.message || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        // Finaliza la carga independientemente del resultado de la solicitud
        setIsLoading(false);
      }
    };
  
    return (
      // Botón que cambia de estilo según si el usuario ya ha votado o no
      <button
        className={`group border px-4 py-2 rounded-xl text-lg duration-200 ${
          hasVoted
            ? "bg-primary text-primary-content border-transparent"
            : "bg-base-100 text-base-content hover:border-base-content/25"
        }`}
        onClick={handleVote} // Maneja el evento de clic para votar
      >
        {/* Icono de flecha SVG con animación al pasar el cursor */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 group-hover:-translate-y-1 duration-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75 12 8.25l7.5 7.5"
          />
        </svg>
  
        {/* Muestra un spinner de carga mientras la solicitud está en proceso */}
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <div>{votesCounter}</div> // Muestra el contador de votos
        )}
      </button>
    );
  };
  
  // Exportamos el componente para su uso en otras partes de la aplicación
  export default ButtonVote;