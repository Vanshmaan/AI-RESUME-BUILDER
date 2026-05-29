export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const code = err.statusCode || 500;

  console.error(`[${req.method}] ${req.originalUrl}`, err.message);

  // CORS rejection — return 403 with message (cors middleware may not set headers)
  if (err.message?.includes("CORS not allowed")) {
    return res.status(403).json({ message: err.message });
  }

  res.status(code).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
