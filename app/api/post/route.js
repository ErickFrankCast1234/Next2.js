// Importamos las dependencias necesarias
import { NextResponse } from "next/server"; // Para manejar respuestas HTTP en Next.js
import { Filter } from "bad-words"; // Para filtrar palabras inapropiadas
import connectMongo from "@/libs/mongoose"; // Función para conectar con la base de datos
import Post from "@/models/Post"; // Modelo de publicación en MongoDB
import { auth } from "@/public/auth"; // Middleware de autenticación

// Función asincrónica para manejar la solicitud POST (Crear un post)
export async function POST(req) {
  try {
    // Obtenemos los datos del cuerpo de la solicitud
    const body = await req.json();
    const { title, description } = body;

    // Extraemos los parámetros de la URL
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    // Validamos que el título no esté vacío
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" }, 
        { status: 400 }
      );
    }

    // Instanciamos el filtro de palabras prohibidas
    const badWordsFilter = new Filter();

    // Sanitizamos el título y la descripción eliminando palabras ofensivas
    const sanitizedTitle = badWordsFilter.clean(title);
    const sanitizedDescription = badWordsFilter.clean(description);

    // Obtenemos la sesión del usuario autenticado
    const session = await auth();

    // Conectamos a la base de datos MongoDB
    await connectMongo();

    // Creamos el nuevo post en la base de datos
    const post = await Post.create({
      title: sanitizedTitle,
      description: sanitizedDescription,
      boardId,
      userId: session?.user?.id, // Asignamos el ID del usuario autenticado
    });

    // Retornamos la respuesta con el post creado
    return NextResponse.json(post);
  } catch (e) {
    // Capturamos cualquier error y enviamos una respuesta con código 500
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ✅ Función para manejar la solicitud DELETE (Eliminar un post)
export async function DELETE(req) {
  try {
    // Extraemos los parámetros de la URL
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    // Verificamos si se proporcionó un ID de post
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" }, 
        { status: 400 }
      );
    }

    // Obtenemos la sesión del usuario autenticado
    const session = await auth();

    // Conectamos a la base de datos MongoDB
    await connectMongo();

    // Buscamos el post en la base de datos
    const post = await Post.findById(postId);

    // Si el post no existe, devolvemos un error
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" }, 
        { status: 404 }
      );
    }

    // Verificamos si el usuario autenticado es el propietario del post
    if (post.userId.toString() !== session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 403 }
      );
    }

    // Eliminamos el post de la base de datos
    await Post.findByIdAndDelete(postId);

    // Retornamos una respuesta de éxito
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (e) {
    // Capturamos cualquier error y enviamos una respuesta con código 500
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
