// COMPONENTE PARA OBTENER Y MOSTRAR UN TABLERO ESPECÍFICO

// Importar funciones y módulos necesarios
import Link from "next/link";
import { redirect } from "next/navigation"; // Redirección en Next.js
import connectMongo from "@/libs/mongoose"; // Conectar con la base de datos MongoDB
import Board from "@/models/Board"; // Modelo de datos del tablero
import Post from "@/models/Post"; // Modelo de datos de los posts
import { auth } from "@/public/auth"; // Función de autenticación
import CardBoardLink from "@/Components/CardBoardLink"; // Enlace al tablero
import ButtonDeleteBoard from "@/Components/ButtonDeleteBoard"; // Botón para eliminar tablero

// Función asincrónica para obtener un tablero específico
const getBoard = async (boardId) => {
  if (!boardId) {
    console.error("❌ Error: boardId es inválido");
    return null;
  }

  const session = await auth(); // Obtener la sesión del usuario autenticado

  if (!session) {
    console.error("⚠️ Error: El usuario no está autenticado.");
    return null;
  }

  await connectMongo(); // Conectar a la base de datos MongoDB

  // Buscar el tablero en la base de datos que coincida con el ID y el usuario autenticado
  const board = await Board.findOne({
    _id: boardId,
    userId: session?.user?.id, // Asegurar que el usuario sea el propietario
  });

  if (!board) {
    console.warn("⚠️ Tablero no encontrado. Redirigiendo...");
    redirect("/dashboard");
  }

  return board;
};

// Función para obtener los posts asociados a un tablero
const getPosts = async (boardId) => {
  if (!boardId) {
    console.error("❌ Error: boardId no válido.");
    return [];
  }

  await connectMongo(); // Conectar a la base de datos

  // Obtener los posts del tablero, ordenados por fecha de creación
  const posts = await Post.find({ boardId }).sort({ createdAt: -1 });

  return posts;
};

// Componente FeedbackBoard - Muestra el contenido de un tablero específico
export default async function FeedbackBoard({ params }) {
  const { boardId } = params; // Extraer el ID del tablero desde los parámetros

  // Obtener la información del tablero con el ID proporcionado
  const board = await getBoard(boardId);
  const posts = await getPosts(boardId); // Obtener los posts asociados

  if (!board) {
    return <p>Error: No se pudo cargar el tablero.</p>;
  }

  return (
    <main className="bg-base-200 min-h-screen">
      {/* Sección del encabezado */}
      <section className="bg-base-100"></section>

      {/* Sección que muestra el nombre del tablero */}
      <section className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-12">
        <div className="space-y-12">
          {/* Título del tablero */}
          <h1 className="font-extrabold text-xl mb-4">{board?.name || "Sin nombre"}</h1>

          {/* Enlace al tablero y botón de eliminación */}
          <CardBoardLink boardId={board._id.toString()} />
          <ButtonDeleteBoard boardId={board._id.toString()} />
        </div>

        {/* Lista de posts */}
        <ul className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post._id}>
                <div className="bg-base-100 p-6 rounded-3xl">
                  {/* Título del post */}
                  <div className="font-bold mb-1">{post.title}</div>
                  {/* Descripción del post */}
                  <div className="opacity-80 leading-relaxed max-h-32 overflow-hidden">
                    {post.description}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No hay posts en este tablero aún.</p>
          )}
        </ul>
      </section>
    </main>
  );
}
