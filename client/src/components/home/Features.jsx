import {
  BarChart3,
  FileSearch,
  MessageSquare,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI writing assistant",
    desc: "Enhance summaries, bullets, and skills with context-aware suggestions.",
  },
  {
    icon: FileSearch,
    title: "ATS compatibility",
    desc: "Match keywords and formatting rules recruiters and parsers expect.",
  },
  {
    icon: BarChart3,
    title: "Resume scoring",
    desc: "Get actionable scores across impact, clarity, and completeness.",
  },
  {
    icon: Target,
    title: "Job match analysis",
    desc: "Compare your resume against any job description in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Cover letters & prep",
    desc: "Generate tailored cover letters and interview talking points.",
  },
  {
    icon: Zap,
    title: "Autosave & templates",
    desc: "Premium templates with autosave so you never lose progress.",
  },
];

const Features = () => (
  <section id="features" className="py-24 page-container">
    <div className="text-center max-w-2xl mx-auto mb-16">
      <p className="ai-chip mx-auto w-fit mb-4">Features</p>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
        Everything you need to get hired faster
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="p-6 glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center mb-4 rounded-2xl size-12 bg-brand-50 dark:bg-brand-500/10 text-brand-600 group-hover:scale-110 transition-transform">
            <f.icon className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
