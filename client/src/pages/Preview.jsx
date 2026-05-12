import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { dummyResumeData } from "../assets/assets"
import ResumePreview from "../components/ResumePreview"
import { ArrowLeftIcon, Loader } from "lucide-react"

const Preview = () => {

    const { resumeId } = useParams()
    const [resumeData, setResumeData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadResume = async () => {
        setResumeData(dummyResumeData.find(resume => resume._id === resumeId) || null)
        setIsLoading(false)
    }

    useEffect(() => {
        loadResume()
    }, [])

    return resumeData ? (
        <div className="bg-slate-100">
            <div className="max-w-3xl mx-auto py-10">
                <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accent_color}
                    classes="py-4 bg-white"
                />
            </div>
        </div>
    ) : (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
    
    <p className="text-xl font-semibold text-gray-800 mb-2">
        Resume Not Found
    </p>

    <p className="text-sm text-gray-500 mb-6">
        The resume you are looking for does not exist or has been removed.
    </p>

    <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium shadow-md transition-all"
    >
        <ArrowLeftIcon className="size-4" />
        Go to Home Page
    </a>

</div>
            )}
        </div>
    )
}

export default Preview