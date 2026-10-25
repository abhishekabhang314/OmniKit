# OmniKit Tool Developer Guide

Welcome to the OmniKit utility tools platform! This guide will walk you through how to build and contribute new tools to the website.

## Overview
OmniKit is a Vite + React frontend styled with plain CSS design tokens and animated with GSAP + Lenis, on top of a FastAPI backend.
All new tools should be added as new components in `frontend/src/tools/` and registered in `frontend/src/registry/tools.json`.

Every tool uses the shared **instrument kit** (`@/components/instrument`): an input column next to a live "readout" panel. Using it keeps all tools consistent, themed and accessible, and gives you the count-up and scramble animations for free.

---

## Quickstart

1. Create a new `.jsx` file in `frontend/src/tools/` (e.g., `MyNewTool.jsx`).
2. Register your tool in `frontend/src/registry/tools.json` (add `short` and `abbr` for the big display labels).
3. Add a lazy route export in `frontend/src/pages/ToolPage.jsx` `TOOL_COMPONENTS` map.
4. Add any required backend endpoints in `backend/main.py`.

The home page, category page, search palette and footer pick the tool up from `tools.json` automatically.

---

## Tool Component Template

Here is a simple starting point for a new tool. `useLiveApi` posts to your endpoint shortly after the inputs stop changing, so the output updates as the user types. There is no "Run" button.

```jsx
import { useState } from 'react'
import { ActionButton, Field, Scramble, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'

export default function MyNewTool({ tool }) {
  const [text, setText] = useState('hello')

  const { data, error, loading } = useLiveApi('/api/tools/my-new-tool', { data: text }, { enabled: !!text.trim() })
  const result = data?.result || ''

  const inputs = (
    <Field label="Enter value" htmlFor="my-input">
      <input id="my-input" className="tl-text" value={text} onChange={e => setText(e.target.value)} />
    </Field>
  )

  const output = (
    <>
      <div className="tl-cap">Result</div>
      <Scramble className="tl-big" text={result} />
    </>
  )

  const actions = <ActionButton primary label="Copy" disabled={!result} onClick={() => copyText(result)} />

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={error} busy={loading} />
}
```

---

## Component Reference

From `@/components/instrument`:

| Component | Usage |
| :--- | :--- |
| **`ToolFrame`** | Page frame. Props: `code`, `inputs`, `output`, `actions`, `error`, `busy`, and `after` (content below the frame, e.g. a table). |
| **`Field`** | Labelled form row. Supports `label`, `aside` (right-hand hint), `htmlFor`. |
| **`NumberField`** | Text input plus a bound range slider. Supports `prefix`, `suffix`, `hint`, `min`, `max`, `step`. |
| **`Segmented`** | Joined button group for one choice: `options={[{ value, label, sub? }]}`. |
| **`Chips`** | Separate pill buttons for one choice (e.g. units). |
| **`Toggle`** | On/off option with a checkbox square and sample text. |
| **`CountUp`** | Number that tweens to each new `value` using your `format` function (keep `format` stable, e.g. module-level or `useMemo`). |
| **`Scramble`** | Text that decodes through random glyphs when it changes. |
| **`ActionButton`** | Output action. Shows "Copied ✓" / "Done ✓" after `onClick`; return `false` to skip that. |

Helpers: `useLiveApi(path, body, { enabled, delay })` returns `{ data, error, loading, refresh }`, and `@/lib/output` has `copyText`, `copyImage` and `downloadBlob`.

For plain inputs use the `tl-text` (single line) and `tl-area` (textarea) classes.

---

## Theming & Dark Mode

Design tokens live in `frontend/src/index.css` and switch with `data-theme` on `<html>`.
**DO NOT use hardcoded hex colors.**

- Page surfaces: `var(--bg)`, `var(--bg2)`, `var(--panel)`, text `var(--ink)` / `var(--mute)`, borders `var(--line)`.
- Accent: `var(--accent)`, with `var(--acc-ink)` for text on it and `var(--acc-text)` for accent-coloured text.
- Inside the output panel: `var(--ro-ink)`, `var(--ro-dim)`, `var(--ro-line)`.
- Type: `var(--f-display)` (headlines/numbers), `var(--f-mono)` (labels/data), `var(--f-sans)` (body).

---

## Do's & Don'ts

**✅ DO:**
- Build on `ToolFrame` and the instrument components.
- Keep the core logic in your FastAPI endpoint and call it with `useLiveApi`.
- Put tool-specific styles in `frontend/src/styles/tool.css` with a `tl-` prefix.
- Respect reduced motion. The kit already does, so prefer it over custom animations.

**❌ DON'T:**
- Hardcode colors (`#ff0000`). Use `var(--danger)` and the other tokens.
- Add a separate "Calculate" button when the output can update live.
- Use `useState` to manage routing. Let the router handle it.

---

## Submitting

Once your tool is ready and tested locally, submit a Pull Request to the main repository. Make sure the backend endpoint is included and your React component follows this guide. Happy building!
