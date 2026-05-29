# ResumeAI — MERN AI Resume Builder

Production-oriented SaaS-style resume builder with AI enhancements, ATS tools, and premium UI.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit
- **Backend:** Express 5, MongoDB, OpenAI, ImageKit, JWT auth

## Local development

```bash
# Server
cd server
npm install
npm run server

# Client (new terminal)
cd client
npm install
npm run dev
```

## Environment variables

Use existing keys only — see `.env.example`. Do not rename variables used in deployment.

| Variable | Where |
|----------|--------|
| `MONGODB_URI` | Server |
| `JWT_SECRET` | Server |
| `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` | Server |
| `IMAGEKIT_PRIVATE_KEY` | Server |
| `PORT` | Server |
| `VITE_BASE_URL` | Client (API origin, e.g. `http://localhost:3000`) |

## Deployment

- **Frontend (Vercel):** Root directory `client`, build `npm run build`, output `dist`. Set `VITE_BASE_URL` to your API URL.
- **Backend (Render/Railway):** Root `server`, start `npm start`. Enable credentials/CORS for your frontend origin.

Health check: `GET /health`

## API highlights

- Auth: register, login, refresh, logout, forgot/reset password (email send requires SMTP — not in current env)
- Resumes: CRUD, public share, stats
- AI: enhance text, score, ATS, job match, cover letter, interview tips, keywords
