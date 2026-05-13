// controllers/aiController.js

import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

/* =========================
   1. Enhance Professional Summary
========================= */
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert resume writer. Convert the input into a strong 1–2 line ATS-friendly professional summary highlighting skills, experience, and career goals. Return ONLY text."
                },
                {
                    role: "user",
                    content: userContent
                }
            ]
        });

        const enhancedContent = response.choices[0].message.content;

        return res.status(200).json({ enhancedContent });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


/* =========================
   2. Enhance Job Description
========================= */
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert resume writer. Improve the job description into 1–2 ATS-friendly sentences using action verbs and measurable impact. Return ONLY text."
                },
                {
                    role: "user",
                    content: userContent
                }
            ]
        });

        const enhancedContent = response.choices[0].message.content;

        return res.status(200).json({ enhancedContent });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


/* =========================
   3. Upload & Extract Resume
========================= */
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert resume parser. Extract structured data from resumes and return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `
Extract resume data from the text below and return ONLY valid JSON with this structure:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Resume Text:
${resumeText}
                    `
                }
            ],
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0].message.content);

        const newResume = await Resume.create({
            userId,
            title,
            ...parsed
        });

        return res.status(200).json({
            resumeId: newResume._id
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};