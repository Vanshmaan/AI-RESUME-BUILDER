import sanitize from "mongo-sanitize";

/**
 * Sanitize request body only (Express 5 makes req.query read-only;
 * express-mongo-sanitize breaks by assigning to req.query).
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitize(req.body);
  }
  next();
};

export default sanitizeBody;
