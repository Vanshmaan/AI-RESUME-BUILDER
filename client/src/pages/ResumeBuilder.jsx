import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  GraduationCap,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import AIInsightsPanel from "../components/AIInsightsPanel";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import { useAutosave } from "../hooks/useAutosave";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#6366f1",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showAI, setShowAI] = useState(true);

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderOpen },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = `${data.resume.title} · ResumeAI`;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resume");
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const saveResume = useCallback(
    async (data, { silent } = {}) => {
      const payload = data || resumeData;
      let updated = structuredClone(payload);

      if (typeof updated.personal_info?.image === "object") {
        delete updated.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updated));
      if (removeBackground) formData.append("removeBackground", "yes");
      if (typeof payload.personal_info?.image === "object") {
        formData.append("image", payload.personal_info.image);
      }

      const { data: res } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });

      setResumeData(res.resume);
      setLastSaved(new Date());
      if (!silent) toast.success("Saved");
      return res.resume;
    },
    [resumeId, token, resumeData, removeBackground]
  );

  useAutosave(resumeData, saveResume, 2500, loaded && !!resumeData._id);

  const activeSection = sections[activeSectionIndex];
  const progress = ((activeSectionIndex + 1) / sections.length) * 100;

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));
      await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });
      setResumeData((prev) => ({ ...prev, public: !prev.public }));
      toast.success(resumeData.public ? "Resume is now private" : "Resume is now public");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleShare = () => {
    const base = window.location.href.split("/app/")[0];
    const url = `${base}/view/${resumeId}`;
    navigator.clipboard?.writeText(url);
    toast.success("Link copied to clipboard");
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Loading builder…</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 lg:p-8 print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {lastSaved && (
            <span className="flex items-center gap-1 ai-chip">
              <Check className="size-3" /> Autosaved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button type="button" onClick={() => setShowAI(!showAI)} className="btn-ghost text-xs">
            {showAI ? "Hide" : "Show"} AI Studio
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-print">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSectionIndex(i)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
              i === activeSectionIndex
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <s.icon className="size-4" />
            {s.name}
          </button>
        ))}
      </div>

      <div className="h-1 mb-8 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden no-print">
        <div
          className="h-full transition-all duration-500 bg-gradient-to-r from-brand-600 to-violet-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-5 no-print">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({ ...prev, accent_color: color }))
                  }
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={activeSectionIndex === 0}
                  onClick={() => setActiveSectionIndex((i) => Math.max(0, i - 1))}
                  className="btn-ghost p-2"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={activeSectionIndex === sections.length - 1}
                  onClick={() =>
                    setActiveSectionIndex((i) => Math.min(sections.length - 1, i + 1))
                  }
                  className="btn-ghost p-2"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {activeSection.id === "personal" && (
              <PersonalInfoForm
                data={resumeData.personal_info}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, personal_info: data }))
                }
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}
            {activeSection.id === "summary" && (
              <ProfessionalSummaryForm
                data={resumeData.professional_summary}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, professional_summary: data }))
                }
                setResumeData={setResumeData}
              />
            )}
            {activeSection.id === "experience" && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, experience: data }))
                }
              />
            )}
            {activeSection.id === "education" && (
              <EducationForm
                data={resumeData.education}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, education: data }))
                }
              />
            )}
            {activeSection.id === "projects" && (
              <ProjectForm
                data={resumeData.project}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, project: data }))
                }
              />
            )}
            {activeSection.id === "skills" && (
              <SkillsForm
                data={resumeData.skills}
                onChange={(data) =>
                  setResumeData((prev) => ({ ...prev, skills: data }))
                }
              />
            )}

            <button
              type="button"
              onClick={() => toast.promise(saveResume(), { loading: "Saving…" })}
              className="w-full mt-6 btn-primary"
            >
              Save now
            </button>
          </div>

          {showAI && <AIInsightsPanel resumeId={resumeId} token={token} />}
        </div>

        <div className="xl:col-span-7">
          <div className="sticky top-4">
            <div className="flex flex-wrap justify-end gap-2 mb-3 no-print">
              {resumeData.public && (
                <button type="button" onClick={handleShare} className="btn-secondary text-xs py-2">
                  <Share2 className="size-4" /> Copy link
                </button>
              )}
              <button type="button" onClick={changeResumeVisibility} className="btn-secondary text-xs py-2">
                {resumeData.public ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                {resumeData.public ? "Public" : "Private"}
              </button>
              <button type="button" onClick={handlePrint} className="btn-primary text-xs py-2">
                <Download className="size-4" /> Print / PDF
              </button>
            </div>
            <div className="resume-print-host overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                classes="p-8 min-h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
