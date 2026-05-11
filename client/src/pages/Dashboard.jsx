import  { useEffect, useState } from 'react'
import {
    FilePenLineIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UploadCloudIcon
} from 'lucide-react'

import { dummyResumeData } from '../assets/assets'

const Dashboard = () => {

    const [allResumes, setAllResumes] = useState([])

    const colors = [
        'bg-red-100/80 text-red-800',
        'bg-green-100/80 text-green-800',
        'bg-blue-100/80 text-blue-800',
        'bg-yellow-100/80 text-yellow-800',
        'bg-purple-100/80 text-purple-800'
    ]

    const loadAllResumes = async () => {
        setAllResumes(dummyResumeData)
    }

    useEffect(() => {
        loadAllResumes()
    }, [])

    return (
        <div>

            <div className="max-w-7xl mx-auto py-8 px-4">

                <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
                    Welcome, Joe Doe
                </p>

                <div className="flex gap-4 flex-wrap">

                    {/* Create Resume */}
                    <button className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">

                        <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />

                        <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
                            Create Resume
                        </p>

                    </button>

                    {/* Upload Resume */}
                    <button className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-purple-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">

                        <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />

                        <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
                            Upload Existing
                        </p>

                    </button>

                </div>

                <hr className="border-slate-300 my-6 sm:w-[305px]" />

                {/* Resume Cards */}
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">

                    {allResumes.map((resume, index) => {

                        const baseColor = colors[index % colors.length]

                        return (
                            <button
                                key={index}
                                className={`relative group w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border border-slate-300 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer ${baseColor}`}
                            >

                                <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" />

                                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center">
                                    {resume.title}
                                </p>

                                <p className="absolute bottom-1 text-[11px] text-slate-500 group-hover:text-slate-700 transition-all duration-300 px-2 text-center">
                                    Updated on{" "}
                                    {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>

                                <div className="absolute top-1 right-1 hidden group-hover:flex items-center">

                                    <TrashIcon className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />

                                    <PencilIcon className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />

                                </div>

                            </button>
                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default Dashboard