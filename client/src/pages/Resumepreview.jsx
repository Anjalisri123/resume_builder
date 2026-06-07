import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import Preview from './Preview'
import Loader from '../components/home/Loader'
import api from '../configs/api'
import { normalizeResumeFromApi } from '../utils/resumeUtils'

const Resumepreview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
    const { data } = await api.get(`/api/resumes/public/${resumeId}`);

    const normalizedResume = normalizeResumeFromApi(data.resume);

    setResumeData(normalizedResume);

    if (normalizedResume?.title) {
      document.title = normalizedResume.title;
    }
  } catch (error) {
    console.error("Failed to load resume:", error);

    setResumeData(null);

    document.title = "Resume Not Found";
  } finally {
    setIsLoading(false);
  }
  }

  useEffect(() => {
    loadResume()
  }, [resumeId])

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <Preview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white" />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>
            Resume not found
          </p>
          <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
            <ArrowLeftIcon className='mr-2 size-4' />
            go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Resumepreview
