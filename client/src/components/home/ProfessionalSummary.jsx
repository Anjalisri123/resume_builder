import { Sparkles, LoaderCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../configs/api'
import toast from 'react-hot-toast'

const ProfessionalSummary = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    if (!data?.trim()) {
      toast.error('Please enter a summary before enhancing')
      return
    }
    try {
      setIsEnhancing(true)
      const { data: response } = await api.post('/api/ai/enhance-pro-sum', { userContent: data }, {
        headers: { Authorization: token }
      })
      onChange(response.enhancedContent)
      toast.success('Summary enhanced with AI')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to enhance summary')
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
          <p className='text-sm text-gray-500'>Add summary to your resume here</p>
        </div>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
        >
          {isEnhancing ? <LoaderCircleIcon className='size-4 animate-spin' /> : <Sparkles className='size-4' />}
          AI Enhance
        </button>
      </div>
      <div className='mt-6'>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives'
        />
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: keep it concise (3-4 sentences) and focus on your most relevant achievements and skills</p>
      </div>
    </div>
  )
}

export default ProfessionalSummary
