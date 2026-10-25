import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useShell } from '@/context/ShellContext'
import { searchTools, NEW_TOOL_URL } from '@/lib/catalog'
import { gsap, lockScroll, unlockScroll, reduceMotion } from '@/lib/motion'
import { SHORTCUT } from '@/lib/keys'

// Mounted only while open, so every opening starts with an empty query.
export default function CommandPalette({ onClose }) {
  const { go } = useShell()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const panel = useRef(null)
  const input = useRef(null)
  const list = useRef(null)
  const lastFocus = useRef(null)

  const results = searchTools(q)

  useLayoutEffect(() => {
    lastFocus.current = document.activeElement
    lockScroll()
    input.current?.focus()
    if (!reduceMotion()) gsap.fromTo(panel.current, { y: -14, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' })
    return () => {
      unlockScroll()
      lastFocus.current?.focus?.()
    }
  }, [])

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  const pick = t => { onClose(); go(t.href, t.navLabel) }

  const onKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(results.length - 1, s + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)) }
    else if (e.key === 'Enter' && results[sel]) { e.preventDefault(); pick(results[sel]) }
    else if (e.key === 'Tab') e.preventDefault() // keep focus in the dialog
  }

  return (
    <div className="ok-palette" onClick={onClose} data-lenis-prevent="">
      <div ref={panel} className="ok-palette__panel" role="dialog" aria-modal="true" aria-label="Search tools" onClick={e => e.stopPropagation()}>
        <div className="ok-palette__bar">
          <span className="ok-palette__badge">{SHORTCUT}</span>
          <input
            ref={input}
            className="ok-palette__input"
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search tools, categories, tags"
            aria-label="Search tools"
            role="combobox"
            aria-expanded="true"
            aria-controls="ok-palette-list"
            aria-activedescendant={results[sel] ? `ok-opt-${results[sel].id}` : undefined}
          />
          <span className="ok-meta">ESC</span>
        </div>
        <div ref={list} id="ok-palette-list" className="ok-palette__list" role="listbox" data-lenis-prevent="">
          {results.map((t, i) => (
            <div
              key={t.id}
              id={`ok-opt-${t.id}`}
              role="option"
              aria-selected={i === sel}
              className="ok-palette__opt"
              onClick={() => pick(t)}
              onMouseEnter={() => setSel(i)}
            >
              <span className="ok-palette__code">{t.code}</span>
              <span className="ok-palette__name">{t.name}</span>
              <span className="ok-palette__cat">{t.catName}</span>
            </div>
          ))}
          {results.length === 0 && (
            <div className="ok-palette__empty">
              No tool matches “{q}”. <a href={NEW_TOOL_URL} target="_blank" rel="noreferrer">Propose it →</a>
            </div>
          )}
        </div>
        <div className="ok-palette__foot"><span>↑↓ Navigate</span><span>↵ Open tool</span><span>Esc Close</span></div>
      </div>
    </div>
  )
}
