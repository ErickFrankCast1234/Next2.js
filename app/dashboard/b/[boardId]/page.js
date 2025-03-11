// COMPONENTE PARA OBTENER Y MOSTRAR UN TABLERO ESPECÍFICO

// Importar funciones y módulos necesarios
import { redirect } from "next/navigation"; // Redirección en Next.js
import connectMongo from "@/libs/mongoose"; // Conectar con la base de datos MongoDB
import Board from "@/models/Board"; // Modelo de datos del tablero
import { auth } from "@/public/auth"; // Función de autenticación

// Función para obtener un tablero específico
const getBoard = async (boardId) => {
    const session = await auth(); // Obtener la sesión del usuario autenticado

    await connectMongo(); // Conectar a la base de datos MongoDB

    // Buscar el tablero en la base de datos que coincida con el ID y el usuario autenticado
    const board = await Board.findOne({
        _id: boardId,
        userId: session?.user?.id, // Asegurar que el usuario sea el propietario
    });

    // Si no se encuentra el tablero, redirigir al dashboard
    if (!board) {
        redirect("/dashboard");
    }

    return board; // Devolver el tablero encontrado
};

// Componente para mostrar el tablero en la interfaz
export default async function FeedbackBoard({ params }) {
    const { boardId } = params; // Extraer el ID del tablero desde los parámetros de la URL

    const board = await getBoard(boardId); // Obtener los datos del tablero

    return <main>{board.name}</main>; // Renderizar el nombre del tablero en la interfaz
}
