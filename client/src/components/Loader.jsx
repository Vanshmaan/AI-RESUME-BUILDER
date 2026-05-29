import { Sparkles } from "lucide-react";

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen mesh-bg gap-4">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-xl animate-pulse" />
      <div className="relative flex items-center justify-center rounded-2xl size-14 bg-gradient-to-br from-brand-600 to-violet-600 text-white">
        <Sparkles className="size-6 animate-pulse" />
      </div>
    </div>
    <p className="text-sm font-medium text-slate-500">Loading workspace…</p>
  </div>
);

export default Loader;
