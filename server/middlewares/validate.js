import validator from "validator";

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Name is too short" });
  }

  const normalizedEmail = validator.normalizeEmail(email.trim());
  if (!normalizedEmail) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  req.body.name = validator.escape(name.trim());
  req.body.email = normalizedEmail;
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const normalizedEmail = validator.normalizeEmail(email.trim());
  if (!normalizedEmail) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  req.body.email = normalizedEmail;
  next();
};

export const requireRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      const User = (await import("../models/User.js")).default;
      const user = await User.findById(req.userId).select("role");
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
