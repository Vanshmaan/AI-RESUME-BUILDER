import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, Sparkles, User2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import api from "../configs/api";

const Login = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = useState(urlState || "login");
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/users/forgot-password", {
        email: forgotEmail,
      });
      toast.success(data.message);
      setShowForgot(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (showForgot) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 mesh-bg">
        <form onSubmit={handleForgot} className="w-full max-w-md p-8 glass-card">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email. If SMTP is configured on the server, you will receive a link.
          </p>
          <input
            type="email"
            className="mt-6"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full mt-4 btn-primary">
            Send reset link
          </button>
          <button
            type="button"
            onClick={() => setShowForgot(false)}
            className="w-full mt-3 btn-ghost"
          >
            Back to login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 mesh-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-1/4 size-72 bg-brand-500/20 blur-3xl animate-float" />
        <div className="absolute rounded-full bottom-20 right-1/4 size-96 bg-violet-500/15 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[420px] p-8 glass-card sm:p-10"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="flex items-center justify-center rounded-xl size-10 bg-gradient-to-br from-brand-600 to-violet-600 text-white">
              <Sparkles className="size-5" />
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
            {state === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {state === "login"
              ? "Sign in to your AI resume workspace"
              : "Start building ATS-optimized resumes"}
          </p>
        </div>

        {state !== "login" && (
          <label className="block mb-4">
            <div className="flex items-center gap-3 px-4 border rounded-xl h-12 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
              <User2 className="size-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="!border-0 !ring-0 !shadow-none bg-transparent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </label>
        )}

        <label className="block mb-4">
          <div className="flex items-center gap-3 px-4 border rounded-xl h-12 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Mail className="size-4 text-slate-400 shrink-0" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="!border-0 !ring-0 !shadow-none bg-transparent"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label className="block mb-2">
          <div className="flex items-center gap-3 px-4 border rounded-xl h-12 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Lock className="size-4 text-slate-400 shrink-0" />
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              className="!border-0 !ring-0 !shadow-none bg-transparent"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
        </label>

        {state === "login" && (
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="mb-4 text-xs text-brand-600 hover:underline"
          >
            Forgot password?
          </button>
        )}

        <button type="submit" className="w-full mt-4 btn-primary h-12">
          {state === "login" ? "Sign in" : "Create account"}
        </button>

        <p className="mt-6 text-sm text-center text-slate-500">
          {state === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="font-semibold text-brand-600 hover:underline"
          >
            {state === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
