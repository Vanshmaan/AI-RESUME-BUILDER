import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);

      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        {
          userContent: data || "Write a professional resume summary"
        },
        {
          headers: { Authorization: token }
        }
      );

      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));

      toast.success("Summary enhanced successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
            Professional Summary
          </h3>
          <p className="text-sm text-zinc-500">
            Add summary for your resume here
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="ai-action-btn disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <textarea
        value={data || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        className="mt-2 resize-none"
        placeholder="Write a professional summary..."
      />
    </div>
  );
};

export default ProfessionalSummaryForm;