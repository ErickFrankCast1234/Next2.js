import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name, children }) => {
  
  if (isLoggedIn) {
    return (
      <Link href="/dashboard">
        <p>Welcome back {name}</p>
        {children}
      </Link>
    );
  }

  return <button>Login</button>;
};

export default ButtonLogin;
