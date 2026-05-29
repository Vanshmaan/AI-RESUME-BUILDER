import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import {
  normalizeResumeDoc,
  normalizeResumePayload,
} from "../utils/normalizeResume.js";

export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({
      message: "Resume created successfully",
      resume: normalizeResumeDoc(newResume),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume: normalizeResumeDoc(resume) });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getpublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not public" });
    }

    return res.status(200).json({ resume: normalizeResumeDoc(resume) });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const {
  resumeId,
  resumeData,
  removeBackground,
} = req.body || {};
    const image = req.file;

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    resumeDataCopy = normalizeResumePayload(resumeDataCopy);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};
      resumeDataCopy.personal_info.image = response.url;

      try {
        fs.unlinkSync(image.path);
      } catch {
        /* ignore */
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume: normalizeResumeDoc(resume),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getResumeStats = async (req, res) => {
  try {
    const userId = req.userId;
    const [total, publicCount, recent] = await Promise.all([
      Resume.countDocuments({ userId }),
      Resume.countDocuments({ userId, public: true }),
      Resume.find({ userId }).sort({ updatedAt: -1 }).limit(5).select("title updatedAt"),
    ]);

    return res.status(200).json({
      stats: { total, publicCount, privateCount: total - publicCount },
      recent,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
