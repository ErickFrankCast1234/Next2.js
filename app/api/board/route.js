// Importar las utilidades necesarias desde Next.js y la autenticación
import { NextResponse } from "next/server";
import { auth } from "@/public/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await connectMongo();

    // Verifica si el usuario existe
    const user = await User.findById(session.user.id);

    if (!user) {
      console.error("❌ Usuario no encontrado");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verificar si el usuario tiene acceso (suscripción activa)
    if (!user.hasAccess) {
      console.warn("⚠️ Usuario sin suscripción intentó crear un tablero");
      return NextResponse.json(
        { error: "Please subscribe to create a board" },
        { status: 403 }
      );
    }

    // Crear un nuevo tablero
    const board = await Board.create({
      userId: user._id,
      name: body.name,
    });

    user.boards.push(board._id);
    await user.save();

    return NextResponse.json({ message: "Board created successfully", board });
  } catch (e) {
    console.error("❌ Error en POST /api/board:", e); // Agrega más detalles al error
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


// Función asíncrona para manejar la solicitud DELETE
export async function DELETE(req) {
  try {
    // Extraer los parámetros de la URL de la solicitud
    const { searchParams } = new URL(req.url); // Cambio aquí para evitar errores en `nextUrl`
    const boardId = searchParams.get("boardId"); // Obtener el boardId desde los parámetros

    // Validar que se haya proporcionado un boardId
    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required" }, // Error si no se proporciona el boardId
        { status: 400 } // Código de estado HTTP 400 (Solicitud incorrecta)
      );
    }

    // Obtener la sesión del usuario autenticado
    const session = await auth();

    // Validar si el usuario está autenticado
    if (!session) {
      return NextResponse.json(
        { error: "Not authorized" }, // Error si el usuario no está autenticado
        { status: 401 } // Código de estado HTTP 401 (No autorizado)
      );
    }

    await connectMongo(); // Conectar con la base de datos MongoDB

    // Buscar al usuario autenticado en la base de datos
    const user = await User.findById(session?.user?.id);

    // Verificar si el usuario tiene acceso (suscripción activa)
    if (!user.hasAccess) {
      console.warn("⚠️ Usuario sin suscripción intentó eliminar un tablero");
      return NextResponse.json(
        { error: "Please subscribe to delete a board" },
        { status: 403 }
      );
    }

    // Verificar si el tablero realmente pertenece al usuario antes de eliminarlo
    const board = await Board.findOne({ _id: boardId, userId: session?.user?.id });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found or not owned by user" },
        { status: 404 }
      );
    }

    // Eliminar el tablero
    await Board.deleteOne({ _id: boardId });

    // Filtrar la lista de tableros del usuario para remover el eliminado
    user.boards = user.boards.filter((id) => id.toString() !== boardId);

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con éxito si el tablero fue eliminado correctamente
    return NextResponse.json({ message: "Board deleted successfully" });
  } catch (e) {
    // Manejar errores inesperados y responder con un error de servidor
    console.error("❌ Error en DELETE /api/board:", e);
    return NextResponse.json(
      { error: e.message }, // Mensaje de error detallado
      { status: 500 } // Código de estado HTTP 500 (Error del servidor)
    );
  }
}
