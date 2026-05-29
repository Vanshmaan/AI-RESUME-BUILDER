import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId) =>
  jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ userId, type: "refresh" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: maxAgeMs,
  path: "/",
});
