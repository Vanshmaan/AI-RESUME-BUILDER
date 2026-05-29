import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authSlice";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/80">
      <nav className="flex items-center justify-between py-3.5 page-container">
        <Link to="/app">
          <img src="/logo.svg" alt="Resume Builder" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="hidden font-medium text-zinc-600 sm:block">
            Hi, {user?.name}
          </p>
          <button
            type="button"
            onClick={logoutUser}
            className="btn-secondary gap-2 py-2 pl-4 pr-4"
          >
            <LogOut className="size-4" />
            <span className="max-sm:hidden">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
