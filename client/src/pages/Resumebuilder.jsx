import React, { useState, useEffect } from 'react'
import Preview from './Preview';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, FileText, Briefcase, ChevronLeft, ChevronRight, Sparkles, User, GraduationCap, FolderOpen, Share2Icon, EyeIcon, EyeOffIcon, DownloadIcon, LoaderCircleIcon } from 'lucide-react';
import PersonalInfo from '../components/home/PersonalInfo';
import TemplateSelector from '../components/home/TemplateSelector';
import Colorpicker from '../components/home/Colorpicker';
import ProfessionalSummary from '../components/home/ProfessionalSummary';
import ExperienceForm from '../components/home/ExperienceForm';
import EducationForm from '../components/home/EducationForm';
import Projectform from '../components/home/Projectform';
import Skillsform from '../components/home/Skillsform';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { normalizeResumeFromApi } from '../utils/resumeUtils';
import Loader from '../components/home/Loader';

const Resumebuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const loadExistingResume = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/api/resumes/get/${id}`, {
        headers: { Authorization: token }
      });
      const normalized = normalizeResumeFromApi(data.resume);
      setResumeData(normalized);
      document.title = normalized.title;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load resume');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId && token) {
      loadExistingResume(resumeId);
    }
  }, [resumeId, token]);

  const sections = [
    { id: "personal_info", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderOpen },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];

  const prepareDataForSave = (data) => {
    const copy = { ...data, personal_info: { ...data.personal_info } };
    if (copy.personal_info?.image instanceof File) {
      delete copy.personal_info.image;
    }
    return copy;
  };

  const saveResume = async (dataToSave = resumeData) => {
    try {
      setIsSaving(true);
      const imageFile = dataToSave.personal_info?.image;
      const hasImageFile = imageFile instanceof File;
      const payload = prepareDataForSave(dataToSave);

      let response;
      if (hasImageFile) {
        const formData = new FormData();
        formData.append('resumeId', resumeId);
        formData.append('resumeData', JSON.stringify(payload));
        formData.append('removeBackground', removeBackground);
        formData.append('image', imageFile);
        response = await api.put('/api/resumes/update', formData, {
          headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.put('/api/resumes/update', {
          resumeId,
          resumeData: payload,
          removeBackground,
        }, {
          headers: { Authorization: token }
        });
      }

      const normalized = normalizeResumeFromApi(response.data.resume);
      setResumeData(normalized);
      toast.success(response.data.message || 'Resume saved successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const changeResumeVisibility = async () => {
    const updated = { ...resumeData, public: !resumeData.public };
    setResumeData(updated);
    await saveResume(updated);
  };

  const handleShare = async () => {
    const frontendUrl = window.location.origin;
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      try {
        await navigator.share({ url: resumeUrl, title: resumeData.title, text: 'Check out my resume' });
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(resumeUrl);
        toast.success('Resume link copied to clipboard');
      } catch {
        alert(`Share this link: ${resumeUrl}`);
      }
    }
  };

  const downloadResume = () => {
    window.print();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500'>
          <ArrowLeftIcon className="size-4" />Back to Dashboard
        </Link>
      </div>
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr className=" absolute top-0 left-0 right-0  border-2 border-gray-200" />
              <hr className=" absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }} />
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <TemplateSelector selectedTemplate={resumeData.template} onChange={(templateId) => setResumeData(prev => ({ ...prev, template: templateId }))} />
                <Colorpicker selectedColor={resumeData.accent_color} onChange={(colors) => setResumeData(prev => ({ ...prev, accent_color: colors }))} />

                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className=' flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'>
                      <ChevronLeft className='size-4' />Previous
                    </button>
                  )}
                  <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={` flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'}`} disabled={activeSectionIndex === sections.length - 1}>
                    <ChevronRight className='size-4' />Next
                  </button>
                </div>
              </div>
              <div className='space-y-6'>
                {activeSection.id === "personal_info" && (
                  <PersonalInfo
                    data={resumeData.personal_info}
                    onDataChange={(Data) => setResumeData(prev => ({ ...prev, personal_info: Data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                  />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))}
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
                  />
                )}
                {activeSection.id === 'projects' && (
                  <Projectform
                    data={resumeData.projects}
                    onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))}
                  />
                )}
                {activeSection.id === 'skills' && (
                  <Skillsform
                    data={resumeData.skills}
                    onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))}
                  />
                )}
              </div>
              <button
                onClick={() => saveResume()}
                disabled={isSaving}
                className='flex items-center justify-center gap-2 bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm disabled:opacity-50'
              >
                {isSaving && <LoaderCircleIcon className='size-4 animate-spin' />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2 z-10'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4' />Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center gap-2 px-4 py-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                  {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                  <DownloadIcon className='size-4' />Download
                </button>
              </div>
            </div>
            <Preview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resumebuilder
