import { Check, Palette } from "lucide-react";
import { useState } from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Orange", value: "#f97316" },
    { name: "Gray", value: "#6b7280" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="toolbar-btn"
      >
        <Palette size={14} />
        <span className="max-sm:hidden">Accent</span>
        <span
          className="ml-1 rounded-full border border-zinc-200 size-3.5"
          style={{ backgroundColor: selectedColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 grid w-56 grid-cols-4 gap-2 p-3 mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
            >
              <div
                className="border-2 border-transparent rounded-full size-10 group-hover:border-zinc-300 transition-colors"
                style={{ backgroundColor: color.value }}
              />
              {selectedColor === color.value && (
                <div className="absolute flex items-center justify-center rounded-full inset-0 size-10">
                  <Check
                    className={`size-4 ${
                      color.value === "#ffffff" ? "text-zinc-900" : "text-white"
                    }`}
                  />
                </div>
              )}
              <p className="mt-1 text-[10px] text-zinc-500">{color.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
