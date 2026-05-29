import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  FileCheck,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
  Wand2,
  X,
} from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";
import AIResultDisplay from "./AIResultDisplay";

const tools = [
  { id: "score", label: "Resume score", icon: BarChart3, endpoint: "/api/ai/score" },
  { id: "ats", label: "ATS check", icon: FileCheck, endpoint: "/api/ai/ats-check" },
  { id: "match", label: "Job match", icon: Target, endpoint: "/api/ai/job-match" },
  { id: "keywords", label: "Keywords", icon: Wand2, endpoint: "/api/ai/keyword-optimize" },
  { id: "cover", label: "Cover letter", icon: MessageSquare, endpoint: "/api/ai/cover-letter" },
  { id: "interview", label: "Interview prep", icon: Briefcase, endpoint: "/api/ai/interview-tips" },
];

const AIInsightsPanel = ({ resumeId, token }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(null);
  const [result, setResult] = useState(null);

  const runTool = async (tool) => {
    if (!resumeId) return;
    setLoading(tool.id);
    setResult(null);

    try {
      const body = { resumeId };
      if (["ats", "match", "keywords", "cover", "interview"].includes(tool.id)) {
        if (!jobDescription.trim()) {
          toast.error("Paste a job description for this tool");
          setLoading(null);
          return;
        }
        body.jobDescription = jobDescription;
      }
      if (tool.id === "cover") body.companyName = companyName;

      const { data } = await api.post(tool.endpoint, body, {
        headers: { Authorization: token },
      });

      setResult({ toolId: tool.id, toolLabel: tool.label, data });
      toast.success(`${tool.label} ready`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-brand-600" />
        <h3 className="font-semibold text-slate-900 dark:text-white">AI Career Studio</h3>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={3}
        placeholder="Paste target job description (required for ATS, match, keywords)"
        className="text-xs"
      />

      <input
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company name (for cover letter)"
        className="text-xs"
      />

      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            disabled={!!loading}
            onClick={() => runTool(tool)}
            className="flex items-center gap-2 p-2.5 text-xs font-medium text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-500/10 transition-all disabled:opacity-50"
          >
            {loading === tool.id ? (
              <Loader2 className="size-3.5 animate-spin shrink-0" />
            ) : (
              <tool.icon className="size-3.5 shrink-0 text-brand-600" />
            )}
            {tool.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 max-h-[28rem] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-brand-600">{result.toolLabel}</p>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close results"
            >
              <X className="size-4" />
            </button>
          </div>
          <AIResultDisplay toolId={result.toolId} payload={result.data} />
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
