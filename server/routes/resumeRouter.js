import express from "express";
import protect from "../middlewares/authmiddleware.js";
import {
  createResume,
  deleteResume,
  getpublicResumeById,
  getResumeById,
  updateResume,
  getResumeStats,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.get("/public/:resumeId", getpublicResumeById);

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", upload.single("image"), protect, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/stats", protect, getResumeStats);

export default resumeRouter;
