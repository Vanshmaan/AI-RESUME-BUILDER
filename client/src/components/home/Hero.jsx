import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import LandingNav from "./LandingNav";

const Hero = () => (
  <div className="mesh-bg min-h-screen">
    <LandingNav />
    <section className="relative pt-16 pb-24 page-container text-center lg:pt-24">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 ai-chip rounded-full">
        <Sparkles className="size-3.5" />
        AI-powered · ATS-optimized · Interview-ready
      </div>

      <h1 className="section-title max-w-4xl mx-auto">
        Turn your experience into a{" "}
        <span className="gradient-text italic">hire-winning</span> resume
      </h1>

      <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400">
        ResumeAI helps you build, score, and tailor resumes for any role — with
        real-time AI coaching, ATS checks, and beautiful templates.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Link to="/app?state=register" className="btn-primary h-12 px-8 text-base">
          Start free <ArrowRight className="size-4" />
        </Link>
        <a href="#features" className="btn-secondary h-12 px-8 text-base">
          See features
        </a>
      </div>

      <ul className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-slate-600 dark:text-slate-400">
        {["ATS keyword optimization", "AI resume scoring", "One-click PDF export"].map(
          (t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" /> {t}
            </li>
          )
        )}
      </ul>

      <div className="relative mt-16 mx-auto max-w-4xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-500/30 to-violet-500/30 blur-3xl" />
        <div className="relative glass-card p-2 overflow-hidden rounded-2xl">
          <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 text-left">
            <div className="flex gap-2 mb-6">
              <div className="rounded-full size-3 bg-red-400" />
              <div className="rounded-full size-3 bg-amber-400" />
              <div className="rounded-full size-3 bg-emerald-400" />
            </div>
            <div className="space-y-3 max-w-md">
              <div className="h-4 rounded skeleton w-3/4" />
              <div className="h-3 rounded skeleton w-full" />
              <div className="h-3 rounded skeleton w-5/6" />
              <div className="mt-6 h-20 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-sm text-brand-700 dark:text-brand-300">
                Live AI resume preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Hero;
