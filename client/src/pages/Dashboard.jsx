import  { useEffect, useState } from 'react'
import {
    FilePenLineIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UploadCloud,
    UploadCloudIcon,
    XIcon
} from 'lucide-react'

import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const [allResumes, setAllResumes] = useState([])
    const [showCreateresume,setShowCreateResume] = useState(false)
    const [showUploadResume,setShowUploadResume] = useState(false)
    const [title,setTitle] = useState('')
    const [resume,setResume] = useState(null)
    const [editresumeId,setEditResumeId] = useState('')

    const navigate = useNavigate()


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

    const createResume = async (e) => {
        e.preventDefault()
        setShowCreateResume(false)
        navigate(`/app/builder/res123`)

    }

    const deleteResume = async (resumeId) => {
        const confirm = window.confirm("Are you sure you want to delete this resume?")
        if(confirm){
            setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
        }
    }

    const uploadResume = async (e) => {
        e.preventDefault()
        setShowUploadResume(false)
        navigate('/app/builder/res123')
    }

    const editTitle = async (e) => {
        e.preventDefault()
        setEditResumeId('')
    setTitle('')
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
                    <button onClick={() => setShowCreateResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">

                        <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />

                        <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
                            Create Resume
                        </p>

                    </button>

                    {/* Upload Resume */}
                    <button onClick={() => setShowUploadResume(true)} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-purple-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">

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
                            <button onClick={()=> navigate(`/app/builder/${resume._id}`)}
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

                                <div onClick={e => e.stopPropagation()} className="absolute top-1 right-1 hidden group-hover:flex items-center">

                                    <TrashIcon onClick={() => deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />

                                    <PencilIcon onClick={() => {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />

                                </div>

                            </button>
                        )
                    })}

                </div>

                {showCreateresume && (
                    <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                        <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                            <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

                            <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>

                            <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' size={20} onClick={() => {setShowCreateResume(false);setTitle('')}}/>
                        </div>
                    </form>
                )
                }

                {showUploadResume && (
                     <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                        <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                            <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
                            <input onChange = {(e) => setTitle(e.target.value)} value = {title}type="text" placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

                            <div>
                                <label htmlFor='resume-input' className='block text-sm text-slate-700'>
                                    Select Resume File
                                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                                        {resume ? (
                                            <p className='text-green-700'>{resume.name}</p>
                                        ) : (
                                            <>
                                                <UploadCloud className='size-14 stroke-1' />
                                                <p>Upload Resume</p>
                                            </>
                                        )
                                        }
                                    </div>
                                </label>
                                <input id='resume-input' type='file' className='hidden' accept='.pdf' onChange={(e) => setResume(e.target.files[0])}/>
                                </div>

                            <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Upload Resume</button>

                            <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' size={20} onClick={() => {setShowUploadResume(false);setTitle('')}}/>
                        </div>
                    </form>
                )
                }

                 {editresumeId && (
                    <form onSubmit={editTitle} onClick={() => setEditResumeId('')}
                     className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                        <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                            <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

                            <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Save Changes</button>

                            <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' size={20} onClick={() => {setEditResumeId('');setTitle('')}}/>
                        </div>
                    </form>
                )
                }

            </div>

        </div>
    )
}

export default Dashboard