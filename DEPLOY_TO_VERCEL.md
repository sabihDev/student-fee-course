Deploying Student Fee Management to Vercel

This project is a monorepo with two folders:
- `frontend/` (Vite + React) — suitable for deployment to Vercel as a static site
- `backend/` (Express + TypeScript + Mongoose) — can be deployed separately (Render, Railway, Heroku) or converted to Vercel Serverless Functions

Frontend (recommended on Vercel)
1. In the Vercel dashboard, click "New Project" and import this GitHub repo.
2. When prompted for the project root, select the `frontend` folder.
3. Configure the following (Vercel will often detect these automatically):
   - Framework Preset: `Other` or `Vite`
   - Build Command: `npm run build` (or `npm run build:prod`)
   - Output Directory: `dist`
4. Add Environment Variables (Project Settings > Environment Variables):
   - `VITE_API_URL` = `https://<your-backend-host>/api` (replace with the backend URL where your Express API is hosted)
5. Deploy. Vercel will build and publish the frontend.

Backend (options)
Option A — Deploy backend to Render/Railway/Heroku (recommended):
1. Push backend to its own service (Render/Railway/Heroku). Typical steps:
   - Set `MONGO_URI` in service environment variables to your MongoDB Atlas connection string.
   - Set `NODE_ENV=production` and `PORT=5000` (Render/Railway often provide a port environment variable).
2. Update the frontend `VITE_API_URL` in Vercel to point to the backend.

Option B — Convert backend to Vercel Serverless Functions (more work):
- Move or adapt Express routes into individual serverless functions under `frontend/api/*`.
- Replace long-running connection logic with a connection per function or use a global cached Mongoose connection (recommended). See Vercel docs for Node + Mongoose.

Helpful commands (local testing)
- Run backend locally:
  cd backend
  npm install
  npm run dev

- Run frontend locally:
  cd frontend
  npm install
  npm run dev

Notes & Recommendations
- Keep secrets out of the repository. The `.env` file is in `.gitignore` — set secrets in Vercel and Render/Railway dashboard.
- If you want me to convert the backend into Vercel Serverless functions (API routes), I can start that refactor — it requires restructuring the Express app and moving each route into `/api/*` serverless files.

If you'd like, I can:
- Create the `vercel.json` config for the frontend (done)
- Create a GitHub Action to automatically deploy (not necessary — Vercel auto-deploys on push)
- Help deploy the backend to Render or convert it to serverless on Vercel

Tell me which backend deployment option you prefer and I will prepare the necessary changes or guide you through the steps.