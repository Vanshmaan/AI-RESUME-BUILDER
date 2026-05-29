import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => (
  <section id="cta" className="py-24 page-container">
    <div className="relative overflow-hidden rounded-3xl p-12 text-center glass-card">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-violet-600/20" />
      <div className="relative">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Ready to land your next role?
        </h2>
        <p className="max-w-lg mx-auto mt-4 text-slate-600 dark:text-slate-400">
          Join thousands building smarter resumes with AI. Free to start — no credit card required.
        </p>
        <Link to="/app?state=register" className="inline-flex mt-8 btn-primary h-12 px-8 text-base">
          Create your resume <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default CallToAction;
