# Deployment Guide

This document outlines the step-by-step process for deploying the Smart Attendance System to production using Railway, Supabase, Vercel, and Cloudflare R2.

## 1. Supabase (Database)
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Once the project is provisioned, go to **Project Settings** → **Database**.
3. Under **Connection string**, copy the **URI** (ensure it uses the connection pooler, usually port 5432 or 6543).
4. Save this URI; you will use it as the `DATABASE_URL` in Railway.

## 2. Cloudflare R2 (Image Storage - Optional but Recommended)
1. Go to your Cloudflare Dashboard → **R2 Object Storage**.
2. Create a new bucket named `attendance-faces` (or any name you prefer).
3. Go to **Manage R2 API Tokens** and click **Create API token**.
4. Grant the token **Object Read & Write** permissions.
5. Save the generated `Account ID`, `Access Key ID`, and `Secret Access Key`.

## 3. Railway (Backend)
1. Push your repository to GitHub.
2. Go to [Railway](https://railway.app) and create a **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. **Important**: Go to the newly created service's **Settings** → **Deploy** and set the **Root Directory** to `/backend`.
5. Under the **Volumes** tab, click **Add Volume** and mount it at `/data`.
6. Go to the **Variables** tab and add the following:
   - `DATABASE_URL`: The connection string from Supabase (Step 1).
   - `FAISS_INDEX_PATH`: `/data/faiss_indexes` (This saves ML models to your volume).
   - `CORS_ORIGINS`: Your eventual Vercel frontend URL (e.g., `https://my-attendance-app.vercel.app`).
   - `R2_ACCOUNT_ID`: Your Cloudflare Account ID.
   - `R2_ACCESS_KEY`: Your R2 Access Key ID.
   - `R2_SECRET_KEY`: Your R2 Secret Key.
   - `R2_BUCKET_NAME`: `attendance-faces` (or your chosen bucket name).
7. Go to the **Settings** tab → **Networking** and click **Generate Domain** to get your public API URL.
8. Wait for the build and deployment to finish. The Dockerfile will download the ML models during the build process, which may take ~5 minutes.

## 4. Vercel (Frontend)
1. Locally, configure your Vercel deployment by creating/editing `frontend/.env.production`:
   ```env
   VITE_API_URL=https://<your-railway-domain>.up.railway.app
   ```
2. Push this change to GitHub.
3. Go to [Vercel](https://vercel.com) and **Add New Project**.
4. Import your GitHub repository.
5. In the configuration step, set the **Framework Preset** to `Vite`.
6. **Important**: Set the **Root Directory** to `frontend`.
7. Click **Deploy**. Vercel will automatically read routing rules from `vercel.json` and connect to your Railway backend.

## 5. Verification
1. Visit your Vercel URL.
2. Create a new Section.
3. Register a student with a photo. The photo will automatically be uploaded to Cloudflare R2, and their details saved to Supabase.
4. Capture attendance using the webcam/image upload. The request will route to Railway's FastAPI server, use the FAISS index (persisted on the Railway volume) to recognize the face, and return the result.
