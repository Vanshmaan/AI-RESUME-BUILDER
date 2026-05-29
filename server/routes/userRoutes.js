import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/userController.js";
import protect from "../middlewares/authmiddleware.js";
import { validateLogin, validateRegister } from "../middlewares/validate.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/register", authLimiter, validateRegister, registerUser);
userRouter.post("/login", authLimiter, validateLogin, loginUser);
userRouter.post("/refresh", refreshToken);
userRouter.post("/forgot-password", authLimiter, forgotPassword);
userRouter.post("/reset-password", authLimiter, resetPassword);
userRouter.post("/verify-email", verifyEmail);

userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.post("/logout", protect, logoutUser);
userRouter.post("/logout-all", protect, logoutAllDevices);
userRouter.post("/resend-verification", protect, resendVerification);

export default userRouter;
