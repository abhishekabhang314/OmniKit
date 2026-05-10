# Security Policy

## Supported Versions

Only the latest version of ToolBox is actively maintained and receives security updates.

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ Yes |
| Older branches | ❌ No |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.** Public disclosure before a fix is available puts all users at risk.

### How to Report

Report vulnerabilities privately via one of the following:

- **GitHub Private Vulnerability Reporting** (preferred):
  Go to the repo → **Security** tab → **Report a vulnerability** → fill out the form.
  GitHub keeps the report confidential between you and the maintainers.

- **Email:**
  Send details to the maintainer directly via your GitHub profile contact.

### What to Include

Please provide as much of the following as possible:

- A clear description of the vulnerability
- The affected component (backend API, frontend, CI pipeline, dependency)
- Steps to reproduce the issue
- Potential impact (what an attacker could do)
- Any suggested fix or mitigation, if you have one

---

## What Happens After You Report

| Timeline | Action |
|---|---|
| Within **48 hours** | We acknowledge receipt of your report |
| Within **7 days** | We assess severity and confirm whether it's a valid vulnerability |
| Within **30 days** | We aim to have a fix ready for confirmed vulnerabilities |
| After fix is released | We credit you in the release notes (unless you prefer to stay anonymous) |

If we need more information during the investigation, we will reach out via the same channel you used to report.

---

## Scope

### In Scope

- Security bugs in the FastAPI backend (e.g. injection, auth bypass, data exposure)
- Vulnerabilities introduced by Python tool libraries we use
- CI/CD pipeline misconfigurations that could lead to supply chain attacks
- Dependency vulnerabilities with a known CVE and a clear exploit path

### Out of Scope

- Vulnerabilities in tools or libraries we depend on that have no direct exploit path in this project (report those upstream)
- Rate limiting or DoS issues on the free-tier hosted API (we have limited control over infrastructure limits)
- Issues that require physical access to a machine
- Social engineering attacks

---

## Dependency Security

We use the following to keep dependencies up to date and audited:

- **Python:** `pip audit` (run manually — consider adding to CI)
- **Node:** `npm audit` (runs automatically on `npm install`)
- **GitHub:** Dependabot alerts are enabled for this repo

Contributors are encouraged to run the following before opening a PR:

```cmd
:: Backend
cd backend
venv\Scripts\activate
pip install pip-audit
pip-audit

:: Frontend
cd frontend
npm audit
```

---

## Disclosure Policy

We follow **coordinated disclosure**:

1. Reporter submits a private report
2. Maintainers investigate and develop a fix
3. Fix is merged and a new release is tagged
4. A security advisory is published on GitHub
5. Reporter is credited (with permission)

We ask that reporters give us a reasonable time to fix the issue before any public disclosure.

---

## Attribution

We are grateful to the security researchers and community members who responsibly disclose vulnerabilities. Contributors who report valid security issues will be acknowledged in our release notes unless they prefer to remain anonymous.
