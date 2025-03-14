// Importamos los módulos necesarios para manejar la navegación, base de datos y componentes
import { redirect } from "next/navigation"; // Para redireccionar en caso de error
import connectMongo from "@/libs/mongoose"; // Conectar con la base de datos MongoDB
import Board from "@/models/Board"; // Modelo de la tabla de tableros
import Post from "@/models/Post"; // Modelo de la tabla de posts
import FormAddPost from "@/Components/FormAddPost"; // Componente para añadir un nuevo post
import CardPost from "@/Components/CardPost"; // Componente para mostrar un post en una tarjeta
import { auth } from "@/public/auth"; // ✅ Función de autenticación

// Función asincrónica para obtener los datos del tablero y sus posts
const getData = async (boardId) => {
  try {
    await connectMongo(); // Establecemos la conexión con la base de datos

    // Buscamos el tablero en la base de datos por su ID
    const board = await Board.findById(boardId).lean(); // Usamos .lean() para optimizar la consulta

    // Si el tablero no existe, redirigimos a la página principal
    if (!board) {
      redirect("/");
    }

    // Buscamos los posts asociados al tablero y los ordenamos por fecha de creación (más reciente primero)
    const posts = await Post.find({ boardId }).sort({ createdAt: -1 }).lean();

    // Retornamos el tablero y los posts encontrados
    return { board, posts };
  } catch (error) {
    console.error("Error al obtener datos:", error);
    redirect("/error"); // Redirigir a una página de error si hay fallos en la BD
  }
};

// Definimos la función asíncrona PublicFeedbackBoard, que recibe los parámetros de la URL
export default async function PublicFeedbackBoard({ params }) {
  // Extraemos el boardId desde los parámetros de la URL
  const { boardId } = params;

  // Estado de carga para la sesión
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error en la autenticación:", error);
    session = null;
  }

  // Llamamos a la función getData para obtener el tablero y sus publicaciones
  const { board, posts } = await getData(boardId);

  // Renderizamos la interfaz de usuario
  return (
    <main className="min-h-screen bg-base-200 py-8">
      {/* Sección con el título del tablero */}
      <section className="max-w-5xl mx-auto p-5">
        <h1 className="text-xl font-bold text-gray-800">{board.name}</h1>
      </section>

      {/* Si hay una sesión activa, mostramos el formulario y los posts */}
      {session ? (
        <section className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
          {/* Formulario para agregar un nuevo post */}
          <div className="w-full md:w-1/3">
            <FormAddPost boardId={boardId} />
          </div>

          {/* Lista de posts en el tablero */}
          <ul className="space-y-4 w-full md:w-2/3">
            {posts.length > 0 ? (
              posts.map((post) => <CardPost key={post._id} post={post} />)
            ) : (
              <p className="text-gray-500 text-center">No posts yet.</p>
            )}
          </ul>
        </section>
      ) : (
        // Si el usuario no está autenticado, mostramos un mensaje con estilos mejorados
        <p className="text-center text-gray-600 mt-10">
          🚀 You must be logged in to see the posts!
        </p>
      )}
    </main>
  );
}
