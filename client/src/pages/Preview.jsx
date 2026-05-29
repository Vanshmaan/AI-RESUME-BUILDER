import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon } from "lucide-react";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/public/" + resumeId);

      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  return resumeData ? (
    <div className="min-h-screen bg-zinc-100">
      <div className="max-w-3xl py-12 mx-auto px-4">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-6 bg-white rounded-xl shadow-sm border border-zinc-200"
        />
      </div>
    </div>
  ) : (
    <div className="app-shell">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <p className="text-2xl font-semibold text-zinc-400 md:text-4xl">
            Resume not found
          </p>
          <a href="/" className="mt-8 btn-primary">
            <ArrowLeftIcon className="size-4" />
            Back to home
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
