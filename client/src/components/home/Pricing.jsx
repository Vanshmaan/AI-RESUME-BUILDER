import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for students and first-time job seekers.",
    features: ["3 resumes", "Basic templates", "AI summary enhance", "PDF export"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "For professionals actively applying to roles.",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "ATS check & scoring",
      "Job match & keywords",
      "Cover letter generator",
    ],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Teams",
    price: "Custom",
    desc: "For career centers, bootcamps, and HR teams.",
    features: ["Shared workspace", "Admin dashboard", "Bulk import", "Priority support"],
    cta: "Contact sales",
    highlight: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="py-24 bg-slate-100/50 dark:bg-slate-900/30">
    <div className="page-container">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="ai-chip mx-auto w-fit mb-4">Pricing</p>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Simple plans that scale with you
        </h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-2xl transition-all duration-300 ${
              plan.highlight
                ? "glass-card ring-2 ring-brand-500 shadow-xl shadow-brand-500/20 scale-[1.02]"
                : "glass-card hover:shadow-lg"
            }`}
          >
            {plan.highlight && (
              <span className="ai-chip mb-4">Most popular</span>
            )}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
            <p className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
              {plan.price}
              {plan.period && (
                <span className="text-base font-normal text-slate-500">{plan.period}</span>
              )}
            </p>
            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="size-4 text-emerald-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/app?state=register"
              className={`block w-full mt-8 text-center ${plan.highlight ? "btn-primary" : "btn-secondary"}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
