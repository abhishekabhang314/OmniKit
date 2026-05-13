# OmniKit Tool Developer Guide

Welcome to the OmniKit utility tools platform! This guide will walk you through how to build and contribute new tools to the website.

## Overview
OmniKit is a Vite + React + Tailwind v4 + shadcn/ui based frontend with a FastAPI backend.
All new tools should be added as new components in `frontend/src/tools/` and registered in `frontend/src/registry/tools.json`.

We use a standard shared UI kit (`@/components/ui-kit`) and animation library (`@/components/animate-ui`) to ensure all tools have a cohesive, high-quality, and accessible design.

---

## Quickstart

1. Create a new `.jsx` file in `frontend/src/tools/` (e.g., `MyNewTool.jsx`).
2. Register your tool in `frontend/src/registry/tools.json`.
3. Add a lazy route export in `frontend/src/pages/ToolPage.jsx` `TOOL_COMPONENTS` map.
4. Add any required backend endpoints in `backend/main.py`.

---

## Tool Component Template

Here is a simple starting point for a new tool:

```jsx
import { useState } from 'react'
import axios from 'axios'
import { ToolInput, ToolButton, ToolResult, FieldGroup } from '@/components/ui-kit'

export default function MyNewTool() {
  const [inputVal, setInputVal] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAction = async () => {
    if (!inputVal) {
      setError('Please provide an input value.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/tools/my-new-tool', { data: inputVal })
      setResult(res.data.result)
    } catch (err) {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={1}>
        <ToolInput
          label="Enter Value"
          id="tool-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          error={error}
        />
      </FieldGroup>
      
      <ToolButton loading={loading} onClick={handleAction}>
        Run Tool
      </ToolButton>

      <ToolResult visible={!!result}>
        <div className="text-center font-mono text-2xl text-[var(--color-primary)]">
          {result}
        </div>
      </ToolResult>
    </div>
  )
}
```

---

## Component Reference

Always use components from our `ui-kit` rather than native HTML inputs to maintain styling consistency.

| Component | Usage |
| :--- | :--- |
| **`ToolInput`** | Standard text/number/textarea input. Supports `label`, `prefix`, `suffix`, `error`, `hint`. |
| **`ToolSelect`** | Dropdown select. Supports `label`, `options={[{value, label}]}`. |
| **`ToolSlider`** | Range slider. Supports `label`, `min`, `max`, `value`, `onChange`, `showValue`. |
| **`ToolButton`** | Primary action button. Supports `loading` state (spinner). |
| **`ToolResult`** | Animated wrapper for the tool's output. Set `visible={true}` to slide/fade it in. |
| **`FieldGroup`** | Responsive CSS Grid wrapper for inputs. Supports `cols={1|2|3}`. |

---

## Theming & Dark Mode

OmniKit has a comprehensive CSS variable design token system (`frontend/src/theme.css`). 
**DO NOT use hardcoded hex colors.**

- Dark mode is automatically handled if you use the correct CSS variables or Tailwind classes mapping to these variables.
- Example text color: `text-[var(--color-text-primary)]` or `text-foreground`.
- Example background: `bg-[var(--color-surface)]` or `bg-card`.

---

## Do's & Don'ts

**✅ DO:**
- Use the `ui-kit` and `animate-ui` components.
- Use `shadcn/ui` components (like `<Card>`, `<Badge>`, `<Progress>`, `<Accordion>`) for complex layouts.
- Add an animated loading spinner state via `<ToolButton loading={true}>`.
- Call your backend API using `axios` and handle errors gracefully.

**❌ DON'T:**
- Use inline styles for layout (`style={{ margin: 10 }}`). Use Tailwind classes (`m-2.5`).
- Use native `<input>` or `<button>` directly. Always use `ToolInput` and `ToolButton`.
- Hardcode colors (`#ff0000`). Use `var(--color-error)`.
- Use `useState` to manage routing. Let the Vite router handle it.

---

## Submitting

Once your tool is ready and tested locally, submit a Pull Request to the main repository. Make sure the backend endpoint is included and your React component follows this guide. Happy building!
