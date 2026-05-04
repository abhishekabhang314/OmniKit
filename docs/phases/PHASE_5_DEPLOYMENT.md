# Phase 5 — Deployment & CI/CD

> **Goal:** Deploy the frontend to Vercel and the backend to Render. Set up GitHub Actions to auto-deploy on merge to `main`. The live site should be accessible to the public.

---

## Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both platforms
- [ ] Auto-deploy on push to `main` working
- [ ] CI checks required before merge to `main`
- [ ] Live URLs documented in README

---

## Step 1 — Deploy Backend to Render

### Create `backend/render.yaml`

```yaml
services:
  - type: web
    name: toolbox-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: APP_ENV
        value: production
      - key: ALLOWED_ORIGINS
        value: https://your-frontend.vercel.app
```

### Deploy Steps

1. Go to https://render.com and sign up / log in with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo (`toolbox`)
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3.11
5. Add environment variables:
   - `APP_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://your-vercel-url.vercel.app`
6. Click **Create Web Service**

Render will give you a URL like: `https://toolbox-api.onrender.com`

Test it: `https://toolbox-api.onrender.com/docs`

---

## Step 2 — Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up / log in with GitHub
2. Click **Add New Project** → Import your `toolbox` repo
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://toolbox-api.onrender.com`
5. Click **Deploy**

Vercel will give you a URL like: `https://toolbox.vercel.app`

---

## Step 3 — Update CORS on Render

Go back to Render → your service → **Environment** and update:

```
ALLOWED_ORIGINS=https://toolbox.vercel.app
```

Trigger a redeploy.

---

## Step 4 — Add Deploy Workflow to GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    name: Trigger Render Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"

  # Vercel deploys automatically from GitHub — no action needed
  # Just make sure the Vercel project is connected to the repo
```

### Add Render Deploy Hook Secret

1. In Render → your service → **Settings** → **Deploy Hook** → copy the URL
2. In GitHub → repo → **Settings** → **Secrets and variables** → **Actions** → **New secret**
   - Name: `RENDER_DEPLOY_HOOK`
   - Value: paste the Render deploy hook URL

---

## Step 5 — Update README with Live URLs

In `README.md`, add a section:

```markdown
## 🌐 Live

| | URL |
|---|---|
| Frontend | https://toolbox.vercel.app |
| API | https://toolbox-api.onrender.com |
| API Docs | https://toolbox-api.onrender.com/docs |
```

---

## Step 6 — Custom Domain (Optional)

If you have a domain:

- **Vercel:** Settings → Domains → Add domain
- **Render:** Settings → Custom Domain → Add domain

Update `ALLOWED_ORIGINS` on Render to include the custom domain.

---

## ✅ Phase 5 Complete

When all checkboxes at the top are done, move to **[Phase 6 — Community & Contributions](PHASE_6_COMMUNITY.md)**.
