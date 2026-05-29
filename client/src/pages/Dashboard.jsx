import {
  FilePenLine,
  Pencil,
  Plus,
  Trash2,
  X,
  TrendingUp,
  Globe,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [title, setTitle] = useState("");
  const [editResumeId, setEditResumeId] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [resumesRes, statsRes] = await Promise.all([
        api.get("/api/users/resumes", { headers: { Authorization: token } }),
        api.get("/api/resumes/stats", { headers: { Authorization: token } }),
      ]);
      setAllResumes(resumesRes.data.resumes);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: token } }
      );
      setAllResumes(
        allResumes.map((r) =>
          r._id === editResumeId ? { ...r, title } : r
        )
      );
      setEditResumeId("");
      setTitle("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume permanently?")) return;
    try {
      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: { Authorization: token },
      });
      setAllResumes(allResumes.filter((r) => r._id !== resumeId));
      toast.success("Resume deleted");
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-10">
        <p className="ai-chip w-fit mb-3">
          <TrendingUp className="size-3" /> Workspace
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Hey {user?.name?.split(" ")[0]}, ready to stand out?
        </h1>
        <p className="mt-2 text-slate-500">
          Build, score, and optimize resumes with AI in one place.
        </p>
      </header>

      <div className="grid gap-4 mb-10 sm:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm text-slate-500">Total resumes</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.total ?? "—"}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Globe className="size-3.5" /> Public
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {stats?.publicCount ?? "—"}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Lock className="size-3.5" /> Private
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.privateCount ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button type="button" onClick={() => setShowCreateResume(true)} className="btn-primary">
          <Plus className="size-4" /> New resume
        </button>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : allResumes.length === 0 ? (
        <EmptyState
          icon={FilePenLine}
          title="No resumes yet"
          description="Create your first AI-powered resume to get started."
          action={
            <button type="button" onClick={() => setShowCreateResume(true)} className="btn-primary">
              <Plus className="size-4" /> Create resume
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allResumes.map((item) => (
            <div
              key={item._id}
              className="relative group glass-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => navigate(`/app/builder/${item._id}`)}
                className="w-full p-5 text-left"
              >
                <div
                  className="flex items-center justify-center mb-4 rounded-xl h-28"
                  style={{
                    background: `linear-gradient(135deg, ${item.accent_color || "#6366f1"}22, ${item.accent_color || "#6366f1"}44)`,
                  }}
                >
                  <FilePenLine
                    className="size-10"
                    style={{ color: item.accent_color || "#6366f1" }}
                  />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </p>
                {item.public && (
                  <span className="inline-block mt-2 ai-chip">Public</span>
                )}
              </button>
              <div className="absolute flex gap-1 opacity-0 top-3 right-3 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    setEditResumeId(item._id);
                    setTitle(item.title);
                  }}
                  className="p-2 rounded-lg bg-white/90 dark:bg-slate-800 shadow"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteResume(item._id)}
                  className="p-2 text-red-600 rounded-lg bg-white/90 dark:bg-slate-800 shadow"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateResume && (
        <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal-panel">
            <h2 className="text-lg font-semibold">Create resume</h2>
            <input className="mt-4" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resume title" required />
            <button type="submit" className="w-full mt-4 btn-primary">Create</button>
            <button type="button" onClick={() => setShowCreateResume(false)} className="absolute top-4 right-4 btn-ghost p-1">
              <X className="size-5" />
            </button>
          </div>
        </form>
      )}

      {editResumeId && (
        <form onSubmit={editTitle} onClick={() => setEditResumeId("")} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal-panel">
            <h2 className="text-lg font-semibold">Rename</h2>
            <input className="mt-4" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <button type="submit" className="w-full mt-4 btn-primary">Save</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
