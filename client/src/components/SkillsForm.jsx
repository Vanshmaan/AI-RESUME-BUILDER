import { Plus, Sparkles, X } from "lucide-react"
import { useState } from "react"

const SkillsForm = ({ data, onChange }) => {

    const [newSkill, setNewSkill] = useState("")

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handlekeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addSkill()
        }
    }

    return (
        <div className="space-y-4">

            <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    Skills
                </h3>
                <p className="text-sm text-gray-500">
                    Add your technical and soft skills
                </p>
            </div>

            <div className="flex gap-2">

                <input
                    type="text"
                    placeholder="Enter a Skill(e.g. Javascript)"
                    className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setNewSkill(e.target.value)}
                    value={newSkill}
                    onKeyDown={handlekeyPress}
                />

                <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="size-4" />
                    Add
                </button>

            </div>

            {data.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                    {data.map((skill, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-zinc-100 text-zinc-800"
                        >
                            {skill}

                            <button
                                onClick={() => removeSkill(index)}
                                className="p-0.5 ml-1 transition-colors rounded hover:bg-zinc-200"
                            >
                                <X className="w-3 h-3" />
                            </button>

                        </span>
                    ))}

                </div>

            ) : (

                <div>
                    <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No skills added yet.</p>
                    <p className="text-sm">Add your technical and soft skills above.</p>
                </div>

            )}

            <div>
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Add 8-12 relevant skills including technical and soft skills.
                </p>
            </div>

        </div>
    )
}

export default SkillsForm
