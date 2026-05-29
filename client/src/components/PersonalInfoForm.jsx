import { BriefcaseBusiness, Globe, LucideBanknoteArrowDown, Mail, MapPin, Phone, User } from "lucide-react"


const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground}) => {
    const handleChange  = (field,value) =>{
        onChange({...data, [field]: value})
    }
    const fields = [
        {key : "full_name", label : "Full Name", icon : User ,type:"text",required: true },
        {key : "email", label : "Email", icon : Mail ,type:"email",required: true },
        {key : "phone", label : "Phone Number", icon : Phone ,type:"tel"},
        {key : "location", label : "Location", icon : MapPin ,type:"text"},
        {key : "profession" , label : "Profession", icon : BriefcaseBusiness ,type:"text"},
        {key : "linkedin", label : "LinkedIn Profile", icon : LucideBanknoteArrowDown ,type:"url"},
        {key : "website", label : "Personal Website", icon : Globe ,type:"url"},
    ]
  return (
    <div>
        <h3 className="text-lg font-semibold text-zinc-900">Personal Information</h3>
        <p className="text-sm text-zinc-500">Add your contact details and profile photo.</p>
        <div className="flex items-center gap-2">
            <label>
                {
                    data.image ? (
                        <img src= {typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt="Profile" className="w-24 h-24 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80" />
                    ) :(
                        <div className="inline-flex items-center gap-2 mt-5 text-zinc-500 hover:text-zinc-800 cursor-pointer">
                            <User className="p-2.5 border rounded-full size-10 border-zinc-200" />
                            Upload photo
                        </div>
                    )
                }
                <input type = "file" accept="image/jpeg, image/png" className="hidden" onChange={(e) => handleChange('image', e.target.files[0])} />
            </label>
            {typeof data.image === 'object' && (
                <div className="flex flex-col gap-1 pl-4 text-sm"> 
                <p>Remove Background</p>
                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input type="checkbox" className="sr-only peer" checked={removeBackground} onChange={() => setRemoveBackground(prev => !prev)} />
                    <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:bg-zinc-900 transition-colors duration-200">

                    </div>
                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                </label>
                </div>
            )}
        </div>
        {
            fields.map((field) => {
                const Icon = field.icon
                return (
                    <div key={field.key} className="space-y-1 mt-5"> 
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-600" >
                        <Icon className="size-4" />
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input type={field.type} value={data[field.key] || ""} onChange={(e) => handleChange(field.key,e.target.value)}
                    className="mt-1" placeholder={`Enter your ${field.label.toLowerCase()}`} required={field.required}/>
                    </div>
                )

            })     
        }
    </div>
  )
}

export default PersonalInfoForm