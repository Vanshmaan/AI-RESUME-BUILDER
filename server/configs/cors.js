/**
 * CORS for credentialed requests (cookies + Authorization).
 * Must return a specific origin — never "*" when credentials: true.
 */
const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

export const corsOptions = {
  origin(origin, callback) {
    // Server-to-server / curl (no Origin header)
    if (!origin) {
      return callback(null, true);
    }

    if (DEV_ORIGINS.includes(origin)) {
      return callback(null, origin);
    }

    // Local dev: Vite may use LAN IP (e.g. http://192.168.x.x:5173)
    if (process.env.NODE_ENV !== "production") {
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, origin);
      }
      if (/^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) {
        return callback(null, origin);
      }
    }

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Refresh-Token"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
};

export default corsOptions;
