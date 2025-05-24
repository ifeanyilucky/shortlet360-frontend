import { Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="p-5 flex lg:w-1/2 relative ">
      <Link to="/">
        <img src="/logo.png" alt="Aplet360 Logo" className="w-32 h-auto" />
      </Link>
    </div>
  );
}
