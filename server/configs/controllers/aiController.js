import ai from "../ai.js";
import Resume from "../../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "Please provide content to enhance" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 2-4 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS friendly. Only return the enhanced summary text with no options or additional commentary."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const enhanceJOBDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "Please provide content to enhance" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert in resume writing. Your task is to enhance a job description for a resume. Use bullet points with action verbs and quantify results where possible. Make it compelling and ATS friendly. Only return the enhanced description text with no options or additional commentary."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        });
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userID;
        if (!resumeText) {
            return res.status(400).json({ message: "Please provide resume content to upload" });
        }
        const systemPrompt = "You are an expert AI agent that extracts structured data from resumes. Return only valid JSON.";
        const userPrompt = `Extract data from this resume:\n${resumeText}\n\nProvide data in the following JSON format with no additional text before or after:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [{
    "company": "",
    "position": "",
    "start_date": "",
    "end_date": "",
    "description": "",
    "is_current": false
  }],
  "projects": [{
    "name": "",
    "type": "",
    "description": ""
  }],
  "education": [{
    "institution": "",
    "degree": "",
    "field": "",
    "graduation_date": "",
    "gpa": ""
  }]
}`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: 'json_object' }
        });

        const extractData = response.choices[0].message.content;
        const parseData = JSON.parse(extractData);

        if (parseData.project && !parseData.projects) {
            parseData.projects = parseData.project;
            delete parseData.project;
        }
        if (parseData.personal_info?.linkedIn && !parseData.personal_info?.linkedin) {
            parseData.personal_info.linkedin = parseData.personal_info.linkedIn;
            delete parseData.personal_info.linkedIn;
        }

        const newResume = await Resume.create({ userId, title, ...parseData });
        return res.status(200).json({ message: "Resume uploaded successfully", resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
