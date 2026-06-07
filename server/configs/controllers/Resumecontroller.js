import Resume from "../../models/Resume.js";
import imagekit from "../imagekit.js";
import fs from 'fs';

const normalizeResume = (resume) => {
    const obj = resume?.toObject ? resume.toObject() : { ...resume };
    if (obj.project && !obj.projects) {
        obj.projects = obj.project;
    }
    if (obj.personal_info?.linkedIn && !obj.personal_info?.linkedin) {
        obj.personal_info.linkedin = obj.personal_info.linkedIn;
    }
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
};

export const createResume = async (req, res) => {
    try {
        const userId = req.userID;
        const { title } = req.body;
        const newResume = await Resume.create({ userId, title });
        return res.status(200).json({ message: "Resume created successfully", resume: normalizeResume(newResume) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userID;
        const { resumeId } = req.params;
        await Resume.findOneAndDelete({ userId, _id: resumeId });
        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userID;
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ resume: normalizeResume(resume) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ resume: normalizeResume(resume) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const updateResume = async (req, res) => {
    try {
        const userId = req.userID;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;
        const parsedData = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
        let resumedatacopy = JSON.parse(JSON.stringify(parsedData));

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground === 'true' || removeBackground === true ? ',e-background_removal' : '')
                }
            });
            resumedatacopy.personal_info = resumedatacopy.personal_info || {};
            resumedatacopy.personal_info.image = response.url;
        }

        delete resumedatacopy._id;
        delete resumedatacopy.userId;

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId },
            { $set: resumedatacopy },
            { new: true }
        );
        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ message: "Resume updated successfully", resume: normalizeResume(updatedResume) });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
