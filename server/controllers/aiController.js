import Resume from "../models/Resume.js";
import { chatCompletion, streamChatCompletion } from "../services/aiService.js";

const resumeToText = (resume) => {
  const r = resume?.toObject ? resume.toObject() : resume;
  return JSON.stringify({
    title: r.title,
    professional_summary: r.professional_summary,
    skills: r.skills,
    personal_info: r.personal_info,
    experience: r.experience,
    education: r.education,
    project: r.project,
  });
};

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    const enhancedContent = await chatCompletion({
      feature: "enhance-summary",
      systemPrompt:
        "You are an expert resume writer. Convert the input into a strong 1–2 line ATS-friendly professional summary. Return ONLY the summary text.",
      userContent,
    });
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    const enhancedContent = await chatCompletion({
      feature: "enhance-job",
      systemPrompt:
        "Improve the job description into 2–4 ATS-friendly bullet points using action verbs and measurable impact. Return ONLY the improved text.",
      userContent,
    });
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const enhanceJobDescriptionStream = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await streamChatCompletion(res, {
      systemPrompt:
        "Improve the job description into ATS-friendly bullet points with action verbs. Stream concise output only.",
      userContent,
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const scoreResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "score-resume",
      json: true,
      systemPrompt:
        'Score the resume 0-100. Return JSON: {"overallScore":number,"categories":[{"name":string,"score":number,"feedback":string}],"topImprovements":[string]}',
      userContent: resumeToText(resume),
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const atsCheck = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "ats-check",
      json: true,
      systemPrompt:
        'Analyze ATS compatibility. Return JSON: {"atsScore":number,"matchedKeywords":[string],"missingKeywords":[string],"formatIssues":[string],"recommendations":[string]}',
      userContent: `Resume:\n${resumeToText(resume)}\n\nJob Description:\n${jobDescription || "General professional role"}`,
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const summary = await chatCompletion({
      feature: "gen-summary",
      systemPrompt:
        "Write a compelling 2-line professional summary based on the resume data. Return ONLY the summary.",
      userContent: resumeToText(resume),
    });

    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const skillSuggestions = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "skill-suggest",
      json: true,
      systemPrompt:
        'Return JSON: {"skillsToAdd":[string],"skillsToHighlight":[string],"learningPath":[string]}',
      userContent: `Resume:\n${resumeToText(resume)}\nTarget role: ${targetRole || "Not specified"}`,
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const jobMatchAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "job-match",
      json: true,
      systemPrompt:
        'Return JSON: {"matchScore":number,"strengths":[string],"gaps":[string],"tailoringTips":[string]}',
      userContent: `Resume:\n${resumeToText(resume)}\n\nJob:\n${jobDescription}`,
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const grammarFix = async (req, res) => {
  try {
    const { text } = req.body;
    const fixed = await chatCompletion({
      feature: "grammar",
      systemPrompt:
        "Fix grammar, spelling, and clarity. Keep meaning and tone professional. Return ONLY corrected text.",
      userContent: text,
    });
    return res.status(200).json({ fixed });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const coverLetter = async (req, res) => {
  try {
    const { resumeId, jobDescription, companyName } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const letter = await chatCompletion({
      feature: "cover-letter",
      systemPrompt:
        "Write a professional cover letter (3-4 paragraphs). Return ONLY the letter text.",
      userContent: `Resume:\n${resumeToText(resume)}\nCompany: ${companyName || "the company"}\nJob:\n${jobDescription || ""}`,
      useCache: false,
    });

    return res.status(200).json({ coverLetter: letter });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const interviewTips = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "interview",
      json: true,
      systemPrompt:
        'Return JSON: {"likelyQuestions":[{"question":string,"answerTip":string}],"behavioralStories":[string],"questionsToAskEmployer":[string]}',
      userContent: `Resume:\n${resumeToText(resume)}\nRole:\n${jobDescription || "General interview"}`,
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const keywordOptimize = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await chatCompletion({
      feature: "keywords",
      json: true,
      systemPrompt:
        'Return JSON: {"optimizedSummary":string,"suggestedBullets":[string],"keywordsToAdd":[string]}',
      userContent: `Resume:\n${resumeToText(resume)}\n\nTarget job:\n${jobDescription || ""}`,
    });

    return res.status(200).json({ result: JSON.parse(result) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
