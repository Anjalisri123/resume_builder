export const normalizeResumeFromApi = (resume) => {
    if (!resume) return null;
    const normalized = { ...resume };
    if (normalized.project && !normalized.projects) {
        normalized.projects = normalized.project;
        delete normalized.project;
    }
    if (normalized.personal_info?.linkedIn && !normalized.personal_info?.linkedin) {
        normalized.personal_info = {
            ...normalized.personal_info,
            linkedin: normalized.personal_info.linkedIn,
        };
    }
    return {
        _id: normalized._id || "",
        title: normalized.title || "Untitled Resume",
        personal_info: normalized.personal_info || {},
        professional_summary: normalized.professional_summary || "",
        experience: normalized.experience || [],
        education: normalized.education || [],
        projects: normalized.projects || [],
        skills: normalized.skills || [],
        template: normalized.template || "classic",
        accent_color: normalized.accent_color || "#3B82F6",
        public: normalized.public || false,
    };
};
