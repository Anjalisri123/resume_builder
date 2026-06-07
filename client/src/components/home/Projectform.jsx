import React from 'react'
import { Plus,Sparkle,Trash } from 'lucide-react';
const Projectform = ({data,onChange}) => {
 const addProject=()=>{
    const newProject={
        name:"",
        type:"",
           description:"",
    };
    onChange([...data,newProject])
}

const removeProject =(index)=>{
    const updated=data.filter((_,i)=>i!==index);
    onChange(updated)
}
const updatedProject =(index,field,value)=>{
    const updated=[...data];
    updated[index]={...updated[index],[field]:value}
    onChange(updated)
}
  
    return (
       <div className='space-y-4'>
      <div className='flex items-center justify-between'>
<div>
<h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
<p className='text-sm text-gray-500'>Add your projects details</p>
</div>
<button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
    <Sparkle className='size-4'/>
    <Plus className='size-4'/>
Add Projects
</button>
      </div>

    <div className='space-y-4 mt-6' >
{data.map((project,index)=>(
    <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
     <div className='flex justify-between items-start'>
        <h4>Project #{index+1}</h4>
        <button  onClick={()=>removeProject(index)}className='text-red-500 hover:text-red-700 transition-colors'>
            <Trash className='size-4'/>
        </button>
     </div>
     <div className='gird  gap-3'>
        <input value={project.name||""} onChange={(e)=>updatedProject(index,"name",e.target.value)} type="text" placeholder="Project name" className='px-2 py-1 text-sm  bg-gray-300 border-1 m-1'   />
        <input value={project.type||""} onChange={(e)=>updatedProject(index,"type",e.target.value)} type="text" placeholder="Project type" className='px-2 py-1 text-sm  bg-gray-200 border-1 '   />
         <textarea rows={4} value={project.description||""} onChange={(e)=>updatedProject(index,"description",e.target.value)}  placeholder="Project description" className='w-full px-3 py-2 text-sm rounded-lg resize-none'   />
           
     </div>
    </div>
))}
    </div>



      </div>
  )
}

export default Projectform
