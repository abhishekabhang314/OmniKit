# Changelog

All notable changes to OmniKit are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
### Changed
- Redesigned the frontend in the "Instrument" style: dark/light tokens,
  Big Shoulders Display, JetBrains Mono and Hanken Grotesk type
- New home page with a pinned hero and live output rail, horizontal
  featured track, pinned category chapters, full index and contribute section
- New category, tool and 404 pages; every tool now uses a live input/readout
  frame that updates as you type
- Smooth scrolling (Lenis) and scroll choreography (GSAP ScrollTrigger),
  curtain page transitions, ⌘K/Ctrl K tool search, pointer-origin theme reveal

### Removed
- Tailwind CSS, shadcn/ui, animate-ui, the old ui-kit and their dependencies

---

## [0.1.0] — 2026-05-20
### Added
- Project scaffold (Phase 1)
- FastAPI backend with CORS and category routers (Phase 2)
- Vite + React frontend with routing and search (Phase 3)
- QR Code Generator
- Unit Converter
- EMI Calculator
- Deployed to Vercel + Render (Phase 5)

---

_Releases will be tagged and documented here as phases are completed._
