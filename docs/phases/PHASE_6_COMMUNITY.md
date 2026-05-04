# Phase 6 — Community & Contributions

> **Goal:** Open the project to the public. Set up everything needed for contributors to have a smooth experience — good docs, clear processes, and a welcoming community.

---

## Checklist

- [ ] README has live links and clear setup instructions
- [ ] CONTRIBUTING.md is complete and tested (follow it yourself first)
- [ ] `good-first-issue` label applied to starter tasks
- [ ] Discussion tab enabled on GitHub
- [ ] Project board created for tracking phases and tool requests
- [ ] Social / announcement post drafted
- [ ] First external contributor PR merged

---

## Step 1 — Enable GitHub Discussions

Go to repo → **Settings** → **Features** → enable **Discussions**.

Create starter categories:
- 💡 **Tool Ideas** — suggest new tools
- 🙋 **Q&A** — help with setup or contribution questions
- 🎉 **Show & Tell** — share tools you built
- 📣 **Announcements** — project updates (maintainer-only)

Pin a welcome post in Announcements explaining what ToolBox is and how to contribute.

---

## Step 2 — Create a GitHub Project Board

Go to repo → **Projects** → **New project** → Board view.

Create columns:
- **Tool Requests** — ideas from issues
- **In Progress** — tools being built
- **In Review** — open PRs
- **Done** — merged tools

Add all open `new-tool` issues to **Tool Requests**.

---

## Step 3 — Tag Good First Issues

Easy starter tasks to label `good-first-issue`:

- Add the **Age Calculator** tool (pure Python `datetime` math)
- Add the **BMI Calculator** tool (simple formula)
- Add the **UUID Generator** tool (stdlib `uuid`)
- Add the **Color Converter** tool (colorsys stdlib)
- Fix any typos in docs

These are well-defined, low-risk, and good for learning the contribution pattern.

---

## Step 4 — Announce the Project

Draft posts for:

### GitHub README Badge Block

```markdown
[![Contributors](https://img.shields.io/github/contributors/abhishekabhang314/toolbox)](https://github.com/abhishekabhang314/toolbox/graphs/contributors)
[![Open Issues](https://img.shields.io/github/issues/abhishekabhang314/toolbox)](https://github.com/abhishekabhang314/toolbox/issues)
[![Stars](https://img.shields.io/github/stars/abhishekabhang314/toolbox)](https://github.com/abhishekabhang314/toolbox/stargazers)
```

### Places to Share
- Reddit: r/webdev, r/Python, r/opensource
- Dev.to — write a post: "I built an open-source utility tools site in FastAPI + React"
- Hacker News: Show HN post
- Twitter/X, LinkedIn

---

## Step 5 — Maintain a CHANGELOG

Create `CHANGELOG.md`:

```markdown
# Changelog

All notable changes to ToolBox are documented here.
Format: [Semantic Versioning](https://semver.org/)

## [Unreleased]

## [0.1.0] — YYYY-MM-DD
### Added
- Project scaffold (Phase 1)
- FastAPI backend with CORS and category routers (Phase 2)
- Vite + React frontend with routing and search (Phase 3)
- QR Code Generator
- Unit Converter
- EMI Calculator
- Deployed to Vercel + Render (Phase 5)
```

Update this with every release.

---

## Step 6 — Release Process

When ready to tag a release:

```cmd
git checkout main
git pull
git tag v0.1.0
git push origin v0.1.0
```

In GitHub → **Releases** → **Draft a new release** → pick the tag → auto-generate release notes.

---

## Ongoing Maintenance

| Task | Frequency |
|---|---|
| Review open PRs | Weekly |
| Respond to issues | Within 48 hours |
| Update dependencies | Monthly |
| Update CHANGELOG | Each release |
| Review `good-first-issue` list | Monthly |

---

## ✅ Phase 6 Complete

The project is now live, open source, and ready for community contributions. 🎉

**Keep the momentum:** every merged tool makes the project more useful and attracts more contributors.
