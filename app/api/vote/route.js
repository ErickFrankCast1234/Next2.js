// Importamos las dependencias necesarias
import { NextResponse } from "next/server"; // Manejo de respuestas HTTP en Next.js
import connectMongo from "@/libs/mongoose"; // Función para conectar con la base de datos MongoDB
import Post from "@/models/Post"; // Modelo de la colección de posts

// Definimos la función asíncrona para manejar solicitudes POST
export async function POST(req) {
  try {
    // Extraemos los parámetros de la URL de la solicitud
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId"); // Obtenemos el ID del post desde los parámetros

    // Conectamos a la base de datos
    await connectMongo();

    // Buscamos el post en la base de datos usando el ID proporcionado
    const post = await Post.findById(postId);

    // Si el post no existe, devolvemos un error 404 (No encontrado)
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" }, // Mensaje de error
        { status: 404 } // Código HTTP 404
      );
    }

    // Incrementamos el contador de votos del post
    post.votesCounter += 1;

    // Guardamos el post actualizado en la base de datos
    await post.save();

    // Devolvemos una respuesta vacía con estado 200 (OK) indicando que la operación fue exitosa
    return NextResponse.json({});
  } catch (e) {
    // En caso de error, lo mostramos en la consola
    console.error(e);

    // Enviamos una respuesta con estado 500 (Error interno del servidor) y el mensaje de error
    return NextResponse.json(
      { error: e.message }, // Mensaje de error
      { status: 500 } // Código HTTP 500
    );
  }
}



// Método DELETE para eliminar un post por ID
export async function DELETE(req) {
    try {
      // Obtener el postId de los parámetros de la URL
      const { searchParams } = new URL(req.url);
      const postId = searchParams.get("postId");
  
      if (!postId) {
        return NextResponse.json(
          { error: "Post ID is required" },
          { status: 400 }
        );
      }
  
      // Conectar a la base de datos
      await connectMongo();
  
      // Buscar y eliminar el post en la BD
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Post deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
