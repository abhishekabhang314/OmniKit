# Phase 1 — Project Setup & Repository

> **Goal:** Get the full project structure on your machine, initialize Git, push to GitHub, and verify everything is wired up correctly before writing any real code.

---

## Checklist

- [x] Prerequisites installed
- [x] Project folder created and structured
- [x] Git initialized with correct branches
- [x] GitHub repository created and configured
- [ ] Branch protection rules set
- [x] Labels created
- [x] CI workflow verified
- [x] Team members invited (if applicable)

---

## Step 1 — Install Prerequisites (Windows)

### Python 3.11+
Download from https://www.python.org/downloads/

During install, **check "Add Python to PATH"**.

Verify:
```cmd
python --version
```

### Node.js 18+
Download from https://nodejs.org/ (LTS version)

Verify:
```cmd
node --version
npm --version
```

### Git
Download from https://git-scm.com/download/win

Verify:
```cmd
git --version
```

### VS Code (Recommended)
Download from https://code.visualstudio.com/

Recommended extensions:
- Python (Microsoft)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

---

## Step 2 — Clone / Initialize the Project

If starting fresh from this scaffold:

```cmd
:: Navigate to where you want the project
cd C:\Projects

:: If you already have the files, just init git:
cd OmniKit
git init
git add .
git commit -m "chore: initial project scaffold"
```

---

## Step 3 — Create the GitHub Repository

1. Go to https://github.com/new
2. Set the following:
   - **Repository name:** `OmniKit`
   - **Description:** `A community-built collection of everyday utility tools`
   - **Visibility:** Public
   - **Do NOT** initialize with README, .gitignore, or license (we have them already)
3. Click **Create repository**

### Push your local code

```cmd
git remote add origin https://github.com/abhishekabhang314/OmniKit.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Create the `dev` Branch

All active development happens on `dev`. `main` is production-only.

```cmd
git checkout -b dev
git push -u origin dev
```

---

## Step 5 — Configure Branch Protection Rules

In GitHub → Repository → **Settings** → **Branches**:

### Protect `main`
Click **Add rule**, set branch name pattern to `main`, then enable:

- [x] Require a pull request before merging
- [x] Require approvals: **1**
- [x] Require status checks to pass before merging
  - Add: `backend-tests`, `frontend-build`, `lint`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

### Protect `dev`
Add another rule for `dev`:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging

---

## Step 6 — Set Up GitHub Labels

Go to **Issues** → **Labels** → **New label** and create:

| Label | Color | Description |
|---|---|---|
| `new-tool` | `#0075ca` | PR that adds a new tool |
| `bug` | `#d73a4a` | Something isn't working |
| `good-first-issue` | `#7057ff` | Good for newcomers |
| `help-wanted` | `#008672` | Extra attention needed |
| `documentation` | `#e4e669` | Docs improvement |
| `duplicate` | `#cfd3d7` | Already reported |
| `wontfix` | `#ffffff` | Won't be addressed |
| `phase-1` | `#f9d0c4` | Phase 1 task |
| `phase-2` | `#fef2c0` | Phase 2 task |
| `phase-3` | `#c2e0c6` | Phase 3 task |

---

## Step 7 — Set Default Branch to `dev`

Go to **Settings** → **General** → **Default branch** → change to `dev`.

This ensures new PRs target `dev` by default.

---

## Step 8 — Update CODEOWNERS

Open `.github/CODEOWNERS` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```
* @abhishekabhang314
frontend/src/registry/tools.json @abhishekabhang314
.github/ @abhishekabhang314
```

Commit and push:
```cmd
git add .github/CODEOWNERS
git commit -m "chore: set codeowners"
git push
```

---

## Step 9 — Verify CI Pipeline

1. Go to your repo on GitHub
2. Click the **Actions** tab
3. You should see the **CI** workflow
4. Open a small test PR to `dev` to confirm all jobs pass

---

## Step 10 — (Optional) Set Up GitHub Pages for Docs

If you want a project website later, enable it:

**Settings** → **Pages** → Source: `Deploy from a branch` → `main` → `/docs`

---

## Folder Structure Verification

After Phase 1, your repo should look like this:

```
OmniKit/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── routers/__init__.py
│   ├── tools/__init__.py
│   └── tests/
├── frontend/
│   └── src/
│       └── registry/
│           └── tools.json
├── docs/
│   └── phases/
│       ├── PHASE_1_SETUP.md         ← this file
│       ├── PHASE_2_BACKEND.md
│       ├── PHASE_3_FRONTEND.md
│       ├── PHASE_4_FIRST_TOOLS.md
│       ├── PHASE_5_DEPLOYMENT.md
│       └── PHASE_6_COMMUNITY.md
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
├── .gitignore
├── LICENSE
├── README.md
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

---

## ✅ Phase 1 Complete

When all checkboxes at the top are done, move to **[Phase 2 — FastAPI Backend Foundation](PHASE_2_BACKEND.md)**.
