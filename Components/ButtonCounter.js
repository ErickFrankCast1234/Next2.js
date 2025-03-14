"use client"; 

// Importamos los hooks useState y useEffect de React
import { useState, useEffect } from "react";

// Definimos el componente funcional Counter
const Counter = () => {
  // Definimos un estado para manejar el contador
  const [count, setCount] = useState(0);

  // useEffect se ejecuta cada vez que 'count' cambia
  useEffect(() => {
    // Si el contador llega a 3, mostramos una alerta
    if (count === 3) {
      alert("Count is 3!");
    }
  }, [count]); // Dependencia: se ejecuta cuando 'count' cambia

  // Función para incrementar el contador
  const increment = () => setCount(count + 1);

  // Función para decrementar el contador
  const decrement = () => setCount(count - 1);

  return (
    // Contenedor principal con diseño de flexbox
    <div className="flex items-center justify-center gap-6 py-8">
      
      {/* Botón para disminuir el contador */}
      <button
        className="btn btn-primary btn-lg text-2xl"
        onClick={decrement} // Disminuye en 1 cuando se presiona
      >
        -
      </button>

      {/* Muestra el valor actual del contador */}
      <span className="text-3xl font-bold">{count}</span>

      {/* Botón para aumentar el contador */}
      <button
        className="btn btn-primary btn-lg text-2xl"
        onClick={increment} // Aumenta en 1 cuando se presiona
      >
        +
      </button>
    </div>
  );
};

// Exportamos el componente para ser utilizado en otras partes de la aplicación
export default Counter;
