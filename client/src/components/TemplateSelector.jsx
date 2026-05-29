import { Check, Layout } from "lucide-react";
import { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean, traditional resume format with clear sections and professional typography.",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "Contemporary design with bold headings and a dynamic layout.",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview:
        "Sleek design that emphasizes simplicity and readability.",
    },
    {
      id: "minimal-image",
      name: "Minimal + Image",
      preview:
        "Minimal layout with a profile image for a personal touch.",
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="toolbar-btn"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Template</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 p-3 mt-2 space-y-2 bg-white border border-zinc-200 rounded-xl shadow-lg w-72">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 rounded-lg cursor-pointer border transition-colors ${
                selectedTemplate === template.id
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute flex items-center justify-center rounded-full top-3 right-3 size-5 bg-zinc-900">
                  <Check className="size-3 text-white" />
                </div>
              )}
              <h4 className="pr-8 font-medium text-zinc-900">{template.name}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                {template.preview}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
