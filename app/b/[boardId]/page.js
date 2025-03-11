// COMPONENTE PARA OBTENER Y MOSTRAR UN TABLERO PÚBLICO

// Importar funciones y módulos necesarios
import { redirect } from "next/navigation"; // Función de redirección en Next.js
import connectMongo from "@/libs/mongoose"; // Conectar a la base de datos MongoDB
import Board from "@/models/Board"; // Modelo de datos del tablero

// Función para obtener un tablero específico
const getBoard = async (boardId) => {
    await connectMongo(); // Conectar con la base de datos MongoDB

    const board = await Board.findById(boardId); // Buscar el tablero por su ID en la base de datos

    // Si el tablero no existe, redirigir a la página principal
    if (!board) {
        redirect("/"); // Redirige al usuario a la página de inicio
    }

    return board; // Devuelve el tablero encontrado
};

// Componente para mostrar el tablero en la interfaz de usuario
export default async function PublicFeedbackBoard({ params }) {
    const { boardId } = params; // Extraer el ID del tablero desde los parámetros de la URL

    const board = await getBoard(boardId); // Obtener los datos del tablero

    return <main>{board.name} (public)</main>; // Renderizar el nombre del tablero con la etiqueta "public"
}
