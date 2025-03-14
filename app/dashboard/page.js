// Importamos los componentes necesarios
import Link from "next/link";
import ButtonLogout from "@/Components/ButtonLogout"; // Botón para cerrar sesión
import FormNewBoard from "@/Components/FormNewBoard"; // Formulario para crear tableros
import ButtonCheckout from "@/Components/ButtonCheckout"; // ✅ Importamos el botón de suscripción
import { auth } from "@/public/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import ButtonPortal from "@/Components/ButtonPortal";

// Función para obtener el usuario autenticado
async function getUser() {
  const session = await auth();
  await connectMongo();
  return await User.findById(session.user.id).populate("boards");
}

// Componente del Dashboard
export default async function Dashboard() {
  const user = await getUser(); // Obtener los datos del usuario

  console.log("Valor de user.hasAccess:", user.hasAccess); // 🔹 Agregar aquí


  return (
    <main className="bg-base-200 min-h-screen">
      {/* Cabecera con botón de Logout y botón de Subscribe */}
      {/* HEADER */}
      <section className="bg-base-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex justify-between">
          {user.hasAccess ? <ButtonPortal /> : <ButtonCheckout />}
          <ButtonLogout />
        </div>
      </section>

      {/* Sección de los tableros del usuario */}
      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <FormNewBoard />

        <div>
          <h1 className="font-extrabold text-xl mb-4">
            {user.boards.length} Boards
          </h1>

          {/* Lista de tableros del usuario */}
          <ul className="space-y-4">
            {user.boards.map((board) => (
              <li key={board._id}>
                <Link
                  href={`/dashboard/b/${board._id}`}
                  className="block bg-base-100 p-6 rounded-3xl hover:bg-neutral hover:text-neutral-content duration-1000"
                >
                  {board.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
