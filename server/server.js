import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import sanitizeBody from "./middlewares/sanitizeBody.js";
import "dotenv/config";
import connectDB from "./configs/db.js";
import corsOptions from "./configs/cors.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRouter.js";
import aiRouter from "./routes/aiRoutes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.set("trust proxy", 1);

// CORS first so preflight always gets correct Access-Control-Allow-Origin
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  compression({
    filter: (req, res) => {
      if ((req.headers["content-type"] || "").includes("multipart/form-data")) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(cookieParser());

const jsonParser = express.json({ limit: "2mb" });
const urlParser = express.urlencoded({ extended: true });

app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return next();
  }
  jsonParser(req, res, (err) => {
    if (err) return next(err);
    urlParser(req, res, next);
  });
});

app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

app.use(sanitizeBody);

app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
);
app.get("/", (req, res) => res.send("Server is Live"));

app.use(
  "/api",
  apiLimiter,
  (req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  }
);
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
