import express from "express";
import {
  enhanceJobDescription,
  enhanceJobDescriptionStream,
  enhanceProfessionalSummary,
  scoreResume,
  atsCheck,
  generateSummary,
  skillSuggestions,
  jobMatchAnalysis,
  grammarFix,
  coverLetter,
  interviewTips,
  keywordOptimize,
} from "../controllers/aiController.js";
import protect from "../middlewares/authmiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";

const aiRouter = express.Router();

aiRouter.use(protect, aiLimiter);

aiRouter.post("/enhance-pro-sum", enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", enhanceJobDescription);
aiRouter.post("/enhance-job-desc/stream", enhanceJobDescriptionStream);

aiRouter.post("/score", scoreResume);
aiRouter.post("/ats-check", atsCheck);
aiRouter.post("/generate-summary", generateSummary);
aiRouter.post("/skill-suggestions", skillSuggestions);
aiRouter.post("/job-match", jobMatchAnalysis);
aiRouter.post("/grammar-fix", grammarFix);
aiRouter.post("/cover-letter", coverLetter);
aiRouter.post("/interview-tips", interviewTips);
aiRouter.post("/keyword-optimize", keywordOptimize);

export default aiRouter;
