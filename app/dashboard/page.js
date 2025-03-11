// Dashboard.js - Muestra los tableros del usuario autenticado y un formulario para crear nuevos tableros

// Importar componentes y utilidades necesarias
import ButtonLogout from "@/Components/ButtonLogout"; // Botón para cerrar sesión
import FormNewBoard from "@/Components/FormNewBoard"; // Formulario para crear un nuevo tablero
import { auth } from "@/public/auth"; // Autenticación del usuario
import connectMongo from "@/libs/mongoose"; // Conectar a la base de datos MongoDB
import User from "@/models/User"; // Modelo de usuario en Mongoose
// Importar el modelo Board
import Board from "@/models/Board"; // Asegúrate de que la ruta sea correcta


// Función asíncrona para obtener el usuario autenticado y sus tableros
async function getUser() {
    const session = await auth(); // Obtener la sesión del usuario autenticado
    await connectMongo(); // Conectar con MongoDB
    return await User.findById(session.user.id).populate("boards"); // Obtener el usuario y sus tableros
}

// Componente principal del Dashboard
export default async function Dashboard() {
    const user = await getUser(); // Obtener el usuario con sus tableros

    return (
        <main className="bg-base-200 min-h-screen">
            {/* Cabecera con el botón de logout */}
            <section className="bg-base-100">
                <div className="max-w-5xl mx-auto px-5 py-3 flex justify-end">
                    <ButtonLogout />
                </div>
            </section>

            {/* Sección del formulario para crear un nuevo tablero */}
            <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
                <FormNewBoard />

                {/* Mostrar la lista de tableros del usuario */}
                <div>
                    <h1 className="font-extrabold text-xl mb-4">
                        {user.boards.length} Boards
                    </h1>

                    {/* Lista de tableros con margen vertical */}
                    <ul className="space-y-4">
                        {user.boards.map((board) => (
                            <div
                                key={board._id}
                                className="bg-base-100 p-6 rounded-3xl"
                            >
                                {board.name}
                            </div>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
