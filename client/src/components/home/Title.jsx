import React from 'react'

const Title = ({title,description}) => {
  return (
    <div className='text-center mt-6 text-slate-700'>
      <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-600 mt-2 max-w-2xl">{description}</p>
    </div>
  )
}

export default Title
