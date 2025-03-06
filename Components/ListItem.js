const ListItem = ({ children }) => {
    return (
      <li className="flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="text-green-600 size-4"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.041l-5 7.5a.75.75 0 0 1-1.154.114l-2.5-2.5a.75.75 0 0 1 1.06-1.06l1.91 1.91 4.541-6.812a.75.75 0 0 1 1.041-.208z"
            clipRule="evenodd"
          />
        </svg>
        {children}
      </li>
    );
  };
  
  export default ListItem;
  