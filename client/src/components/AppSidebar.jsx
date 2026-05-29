import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { logout } from "../app/features/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import api from "../configs/api";
import toast from "react-hot-toast";

const AppSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/", icon: Home, label: "Home", external: false },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/");
    toast.success("Logged out");
  };

  return (
    <aside className="no-print fixed inset-y-0 left-0 z-40 flex flex-col w-64 border-r glass lg:translate-x-0 -translate-x-full lg:static lg:translate-x-0 transition-transform">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-center rounded-xl size-9 bg-gradient-to-br from-brand-600 to-violet-600 text-white">
          <Sparkles className="size-4" />
        </div>
        <div>
          <Link to="/app" className="text-sm font-bold text-slate-900 dark:text-white">
            ResumeAI
          </Link>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pro Builder</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => {
          const active = end
            ? location.pathname === to
            : location.pathname.startsWith(to) && to !== "/";
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto space-y-2 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center rounded-full size-9 bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs truncate text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center w-full gap-3 px-3 py-2 text-sm rounded-xl btn-ghost"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
