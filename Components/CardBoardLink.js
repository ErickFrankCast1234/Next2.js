// Indicamos que este componente debe ejecutarse en el lado del cliente
"use client";

// Importamos la librería de notificaciones `react-hot-toast`
import toast from "react-hot-toast";



// Definimos el componente funcional `CardBoardLink` que recibe `boardId` como prop
const CardBoardLink = ({ boardId }) => {
    // Creamos el enlace dinámico según el entorno de ejecución (desarrollo o producción)
    const boardLink = `${
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://codefastsaas.com"
    }/b/${boardId}`;

    // Función para copiar el enlace al portapapeles
    const copyLink = () => {
        navigator.clipboard.writeText(boardLink); // Copia el texto al portapapeles
        toast.success("Link copied to clipboard!"); // Muestra una notificación de éxito
    };

    return (
        // Contenedor con estilos de fondo, padding y alineación flex
        <div className="bg-base-100 rounded-2xl text-sm px-4 py-2.5 flex items-center max-w-96">
            {/* Muestra el enlace con truncado si es muy largo */}
            <p className="truncate">{boardLink}</p>

            {/* Botón para copiar el enlace con icono SVG */}
            <button className="btn btn-sm btn-neutral btn-square" onClick={copyLink}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V6.75c0-.621.504-1.125 1.125-1.125h5.25"
                    />
                </svg>
            </button>
        </div>
    );
};

// Exportamos el componente para su uso en otros archivos
export default CardBoardLink;
