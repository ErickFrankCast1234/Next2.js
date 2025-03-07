import { useState } from "react";

const FAQListItem = ({ qa }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={qa.question}>
      {/* 1. Pregunta (clickable) */}
      <button
        className="py-5 font-semibold border-b w-full text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{qa.question}</p>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M10.75 7.5a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5V7.5z" />
          </svg>
        )}
      </button>

      {/* 2. Respuesta */}
      <div className={`${isOpen ? "block" : "hidden"}`}>
        {qa.answer}
      </div>
    </li>
  );
};

export default FAQListItem;
