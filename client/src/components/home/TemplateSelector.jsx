import React from 'react'
import { Layout, Check } from 'lucide-react'

const TemplateSelector = ({ selectedTemplate, onChange}) => {
 const [isOpen, setIsOpen] = React.useState(false);

 const templates = [
    {
        id:"classic",
        name:"Classic",
        preview:"A traditional resume layout with a clean and professional design, featuring a clear hierarchy of information and a focus on readability.",
    },
    {
        id:"modern",
        name:"Modern",
        preview:"A contemporary resume layout with a clean and minimalist design, emphasizing visual appeal and modern aesthetics.",
    },
    {
        id:"minimal",
        name:"Minimal",
        preview:"A clean and simple resume layout that focuses on essential information and uses minimal design elements.",
    },
    {
        id:"minimal_image",
        name:"Minimal Image",
        preview:"A clean and simple resume layout that focuses on essential information and uses minimal design elements with an image.",
    },
 ]

 return (
  <div className='relative'>
    <button 
      onClick={()=>setIsOpen(!isOpen)} 
      className='inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
    >
      <Layout size={14}/>
      <span className='max-sm:hidden'>TEMPLATES</span>
    </button>

    {isOpen && (
      <div className='absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
        {templates.map((template)=>(
          <div 
            key={template.id} 
            onClick={()=>{onChange(template.id); setIsOpen(false)}} 
            className={`relative p-3 border rounded-md cursor-pointer transition-all ${
              selectedTemplate===template.id
                ? 'border-blue-600 bg-blue-500'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            {selectedTemplate===template.id && (
              <div className='absolute top-2 right-2 text-green-600'>
                <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                  <Check className='w-3 h-3 text-white'/>
                </div>
              </div>
            )}

            <div>
              <h4 className='font-medium text-gray-800'>{template.name}</h4>
              <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>
                {template.preview}
              </div>
            </div>

          </div>
        ))}
      </div>
    )}
  </div>
 )
}

export default TemplateSelector
