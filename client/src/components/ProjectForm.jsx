import { Plus, Trash2 } from "lucide-react"

const ProjectForm = ({ data = [], onChange }) => {

    const addProject = () => {

        const newProject = {
            name: "",
            type: "",
            description: "",
        }

        onChange([...data, newProject])
    }

    const removeProject = (index) => {

        const updatedProject = data.filter((_, i) => i !== index)

        onChange(updatedProject)
    }

    const updateProject = (index, updatedField, value) => {

        const updatedProject = [...data]

        updatedProject[index] = {
            ...updatedProject[index],
            [updatedField]: value
        }

        onChange(updatedProject)
    }

    return (

        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Projects
                    </h3>

                    <p className="text-sm text-gray-500">
                        Add your projects
                    </p>
                </div>

                <button
                    onClick={addProject}
                    className="ai-action-btn"
                >
                    <Plus className="size-4" />
                    Add Project
                </button>

            </div>

            {/* Projects List */}
            <div className="space-y-4">

                {data.map((project, index) => (

                    <div
                        key={index}
                        className="border p-4 border-gray-200 rounded-lg space-y-4"
                    >

                        {/* Top row */}
                        <div className="flex justify-between items-start">

                            <h4 className="font-medium">
                                Project #{index + 1}
                            </h4>

                            <button
                                onClick={() => removeProject(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="size-4" />
                            </button>

                        </div>

                        {/* Inputs */}
                        <div className="grid  gap-3">

                            <input
                                type="text"
                                placeholder="Project Name"
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={project.name || ""}
                                onChange={(e) =>
                                    updateProject(index, "name", e.target.value)
                                }
                            />

                            <input
                                type="text"
                                placeholder="Project Type"
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                value={project.type || ""}
                                onChange={(e) =>
                                    updateProject(index, "type", e.target.value)
                                }
                            />

                        </div>

                        {/* Description */}
                        <textarea
                            rows={4}
                            placeholder="Describe your project"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            value={project.description || ""}
                            onChange={(e) =>
                                updateProject(index, "description", e.target.value)
                            }
                        />

                    </div>

                ))}

            </div>

        </div>
    )
}

export default ProjectForm