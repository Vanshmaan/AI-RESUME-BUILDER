import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row page-container">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-lg size-8 bg-gradient-to-br from-brand-600 to-violet-600 text-white">
          <Sparkles className="size-4" />
        </div>
        <span className="font-bold text-slate-900 dark:text-white">ResumeAI</span>
      </Link>
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} ResumeAI. Built for modern job seekers.
      </p>
      <div className="flex gap-6 text-sm text-slate-500">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <Link to="/app">App</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
