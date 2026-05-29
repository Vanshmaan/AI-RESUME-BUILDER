import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const LandingNav = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Stories" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="flex items-center justify-between py-4 page-container">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-xl size-9 bg-gradient-to-br from-brand-600 to-violet-600 text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">ResumeAI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={toggleTheme} className="p-2 rounded-lg btn-ghost">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          {user ? (
            <Link to="/app" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/app?state=login" className="btn-ghost">Sign in</Link>
              <Link to="/app?state=register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        <button type="button" className="p-2 md:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 glass-card p-6">
            <button type="button" onClick={() => setOpen(false)} className="mb-6">
              <X />
            </button>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 font-medium">
                {l.label}
              </a>
            ))}
            <Link to="/app" onClick={() => setOpen(false)} className="block w-full mt-6 text-center btn-primary">
              {user ? "Dashboard" : "Get started"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
