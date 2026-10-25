import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { revealTheme } from '@/lib/motion'

const KEY = 'OmniKit-theme'

function readSaved() {
  try { return localStorage.getItem(KEY) } catch { return null }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => readSaved() || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(KEY, theme) } catch { /* storage unavailable */ }
  }, [theme])

  // Pass the click event so the new theme spreads out from the pointer.
  const toggleTheme = e => {
    const next = theme === 'dark' ? 'light' : 'dark'
    revealTheme(e, () => {
      document.documentElement.setAttribute('data-theme', next)
      flushSync(() => setTheme(next))
    })
  }

  return { theme, toggleTheme }
}
