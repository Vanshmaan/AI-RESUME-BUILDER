import { Check, Layout } from "lucide-react"
import { useState } from "react"


const TemplateSelector = ({selectedTemplate, onChange}) => {
    const [isOpen, setIsOpen] = useState(false)
    const templates = [
        {
            id : "classic",
            name : "Classic",
            preview : "A clean,traditional resume format with clear sections and professional typography "
        },
        {
            id : "modern",
            name : "Modern",
            preview : "A contemporary design with bold headings, vibrant colors, and a dynamic layout that stands out."
        },
        {
            id : "minimal",
            name : "Minimal",
            preview : "A sleek, understated design that emphasizes simplicity and readability with ample white space."
        },
        {
            id : "minimal-image",
            name : "Minimal + Image",
            preview : "A minimalist layout that incorporates a profile image for a personal touch while maintaining a clean design."
        }
    ]
  return (
    <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg">
            <Layout size={14} /> <span className="max-sm:hidden">Template</span>

        </button>

        {
            isOpen && (
                <div className="absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
                    {templates.map((template) => (
                        <div key={template.id} onClick={() => {onChange(template.id); setIsOpen(false)}} className={`p-3 rounded-md cursor-pointer border ${selectedTemplate === template.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                            {
                                selectedTemplate === template.id && (
                                    <div className="absolute top-2 right-2">
                                        <div>
                                            <Check className="size-3 text-white" />
                                            </div>
                                        </div>

                                )
                            }
                            <div className="space-y-1">
                                <h4 className="font-medium text-gray-800" >{template.name}</h4>
                                <p className="mt-2 p-2 bg-blue-50 rounded-text-xs text-gray-500 italic">{template.preview}</p>
                                </div>
                           
                        </div>
                    ))}
                </div>
            )
        }
    </div>
  )
}

export default TemplateSelector