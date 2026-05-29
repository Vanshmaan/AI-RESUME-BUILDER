import jwt from "jsonwebtoken";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header) return header.replace(/^Bearer\s+/i, "").trim();
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  return null;
};

const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.type || decoded.type === "access") {
      req.userId = decoded.userId;
    }
  } catch {
    /* ignore */
  }
  next();
};

export default protect;
