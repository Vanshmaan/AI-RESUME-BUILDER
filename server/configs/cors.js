/**
 * CORS for credentialed requests (cookies + Authorization).
 * Must return a specific origin — never "*" when credentials: true.
 */

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",

  // Production frontend
  "https://ai-resume-builder-client-sage.vercel.app",
];

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests without Origin header
    if (!origin) {
      return callback(null, true);
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Allow local network IPs during development
    if (process.env.NODE_ENV !== "production") {
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      if (/^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
    }

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Refresh-Token",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
};

export default corsOptions;