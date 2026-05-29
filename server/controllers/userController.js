import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  cookieOptions,
} from "../utils/tokens.js";

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};

const sendAuthResponse = async (res, user, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await user.addRefreshToken(hashToken(refreshToken));
  setAuthCookies(res, accessToken, refreshToken);

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshTokens;
  delete safeUser.resetPasswordToken;
  delete safeUser.emailVerificationToken;

  return res.status(statusCode).json({
    message: statusCode === 201 ? "User created successfully" : "Login successful",
    token: accessToken,
    refreshToken,
    user: safeUser,
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    return await sendAuthResponse(res, newUser, 201);
  } catch (error) {
    console.error("registerUser:", error.message);
    const status = error.code === 11000 ? 400 : 500;
    return res.status(status).json({
      message:
        error.code === 11000
          ? "User already exists"
          : error.message || "Registration failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return await sendAuthResponse(res, user);
  } catch (error) {
    console.error("loginUser:", error.message);
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body.refreshToken || req.headers["x-refresh-token"];

    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const tokenHash = hashToken(token);
    const valid = user.refreshTokens.some((t) => t.tokenHash === tokenHash);
    if (!valid) {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    await user.removeRefreshToken(tokenHash);

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    await user.addRefreshToken(hashToken(newRefreshToken));

    setAuthCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (token && req.userId) {
      const user = await User.findById(req.userId);
      if (user) await user.removeRefreshToken(hashToken(token));
    }

    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) await user.clearRefreshTokens();
    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -refreshTokens -resetPasswordToken -emailVerificationToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select("title template accent_color updatedAt createdAt public");
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    const genericMessage =
      "If an account exists for this email, password reset instructions have been generated.";

    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    return res.status(200).json({
      message: genericMessage,
      note: "Email delivery requires SMTP configuration in your deployment environment.",
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: "Valid token and password (8+ chars) required" });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.clearRefreshTokens();
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please login." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token required" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    return res.status(200).json({
      message: "Verification token regenerated.",
      note: "Email delivery requires SMTP configuration in your deployment environment.",
      ...(process.env.NODE_ENV === "development" && {
        verificationToken: user.emailVerificationToken,
      }),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
