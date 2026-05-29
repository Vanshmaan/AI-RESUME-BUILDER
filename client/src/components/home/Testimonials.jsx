const testimonials = [
  {
    quote:
      "The ATS checker caught missing keywords I never would have found. I got callbacks within two weeks.",
    name: "Priya Sharma",
    role: "Software Engineer",
  },
  {
    quote:
      "ResumeAI feels like a funded SaaS product — clean UI, fast AI, and the job match tool is genuinely useful.",
    name: "Marcus Chen",
    role: "Product Manager",
  },
  {
    quote:
      "Built a polished resume in minutes. The step-by-step builder is intuitive.",
    name: "Elena Rodriguez",
    role: "Marketing Lead",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 page-container">
    <div className="text-center max-w-2xl mx-auto mb-16">
      <p className="ai-chip mx-auto w-fit mb-4">Testimonials</p>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Loved by job seekers worldwide
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t) => (
        <blockquote
          key={t.name}
          className="p-6 glass-card hover:shadow-lg transition-shadow"
        >
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
          <footer className="mt-6">
            <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
            <p className="text-sm text-slate-500">{t.role}</p>
          </footer>
        </blockquote>
      ))}
    </div>
  </section>
);

export default Testimonials;
