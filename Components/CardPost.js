import React from "react";
import ButtonDeletePost from "./ButtonDeletePost";
import ButtonVote from "./ButtonVote";

// Definimos un componente funcional llamado CardPostAdmin
const CardPostAdmin = ({ post }) => {
  return (
    // Contenedor principal con flex para organizar contenido y botones
    <li className="bg-base-100 rounded-3xl p-6 flex justify-between items-center gap-4">
      {/* Contenedor del contenido del post con ancho máximo */}
      <div className="flex-1 min-w-0">
        {/* Título del post */}
        <div className="font-bold mb-1">{post.title}</div>

        {/* Descripción del post con control de desbordamiento y corte con puntos suspensivos */}
        <div className="opacity-80 leading-relaxed max-h-32 overflow-hidden text-ellipsis break-words">
          {post.description}
        </div>
      </div>

      {/* Botón para votar por el post */}
        {/* Botón para votar por el post, pasando postId y valores iniciales */}
        <ButtonVote 
        postId={post._id.toString()} 
        initialVoted={post.userVoted || false} 
        initialVotesCounter={post.votesCounter || 0} 
      />

      {/* Botón para eliminar el post, pasando el ID del post como prop */}
      <ButtonDeletePost postId={post._id.toString()} />
    </li>
  );
};

// Exportamos el componente para su uso en otras partes de la aplicación
export default CardPostAdmin;

