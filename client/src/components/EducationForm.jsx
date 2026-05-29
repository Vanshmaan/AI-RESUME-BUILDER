import { GraduationCap, Plus, Trash2 } from "lucide-react"


const EducationForm = ({ data, onChange }) => {
       const addEducation = () => {

        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: ""
            
        }

        onChange([...data, newEducation])
    }

    const removeEducation = (index) => {

        const updatedEducation = data.filter((_, i) => i !== index)

        onChange(updatedEducation)
    }

    const updateEducation = (index, updatedField, value) => {

        const updatedEducation = [...data]

        updatedEducation[index] = {
            ...updatedEducation[index],
            [updatedField]: value
        }

        onChange(updatedEducation)
    }

  return (
     <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        Education
                    </h3>

                    <p className="text-sm text-gray-500">
                        Add your educational background
                    </p>
                </div>

                <button
                    onClick={addEducation}
                    className="ai-action-btn"
                >
                    <Plus className="size-4" />
                    Add Education
                </button>

            </div>

            {data.length === 0 ? (

                <div className="text-center py-8 text-gray-500">

                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-400" />

                    <p>No education added yet.</p>

                    <p className="text-sm">
                        Click "Add Education" to get started.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {data.map((education, index) => (

                        <div
                            key={index}
                            className="border p-4 border-gray-200 rounded-lg space-y-4"
                        >

                            <div className="flex justify-between items-start">

                                <h4 className="font-medium">
                                    Education #{index + 1}
                                </h4>

                                <button
                                    onClick={() => removeEducation(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="size-4" />
                                </button>

                            </div>

                            <div className="grid md:grid-cols-2 gap-3">

                                <input
                                    type="text"
                                    placeholder="Institution Name"
                                    className="px-3 py-2 text-sm  border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={education.institution || ""}
                                    onChange={(e) =>
                                        updateEducation(
                                            index,
                                            "institution",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Degree (eg. B.Sc in Computer Science)"
                                    className="px-3 py-2 text-sm  border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={education.degree || ""}
                                    onChange={(e) =>
                                        updateEducation(
                                            index,
                                            "degree",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Field of Study (eg. Computer Science)"
                                    className="px-3 py-2 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={education.field || ""}
                                    onChange={(e) =>
                                        updateEducation(
                                            index,
                                            "field",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="month"
                                    className="px-3 py-2 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={education.graduation_date || ""}
                                    onChange={(e) =>
                                        updateEducation(
                                            index,
                                            "graduation_date",
                                            e.target.value
                                        )
                                    }
                                    

                                />



                            </div>

                            <input
                                    type="text"
                                    placeholder="GPA (eg. 3.8)"
                                    className="px-3 py-2 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={education.gpa || ""}
                                    onChange={(e) =>
                                        updateEducation(
                                            index,
                                            "gpa",
                                            e.target.value
                                        )
                                    }
                                />

                        </div>

                    ))}

                </div>

            )}

        </div>
  )
}

export default EducationForm