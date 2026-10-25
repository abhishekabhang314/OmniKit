import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import OkLink from '@/components/OkLink'
import { useShell } from '@/context/ShellContext'
import { usePageMotion } from '@/hooks/usePageMotion'
import { tools, toolCount } from '@/lib/catalog'
import { scramble } from '@/lib/motion'
import { SHORTCUT } from '@/lib/keys'
import '@/styles/notfound.css'

// Rank tools by how many letter pairs they share with the requested path.
const grams = s => { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g }
const clean = s => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function closest(path, n = 4) {
  const pg = grams(clean(path))
  const score = t => { const g = grams(clean(t.id + t.name + t.tags.join(''))); let k = 0; pg.forEach(x => g.has(x) && k++); return k }
  return tools.map(t => ({ t, s: score(t) })).sort((a, b) => b.s - a.s).slice(0, n).map(x => x.t)
}

export default function NotFoundPage() {
  const root = useRef(null)
  const pathEl = useRef(null)
  const { pathname } = useLocation()
  const { openPalette } = useShell()
  usePageMotion(root, { fast: true })

  useEffect(() => { document.title = '404 — OmniKit' }, [])
  useEffect(() => { scramble(pathEl.current, pathname, 700) }, [pathname])

  return (
    <main ref={root} className="nf">
      <div className="nf__meta ok-label" data-intro="">
        <span>ERR/404 · Route not registered</span><span>tools.json · {toolCount} entries checked</span>
      </div>

      <div className="nf__body">
        <h1 className="nf__code">
          <span data-intro="" aria-label="404">4<span className="nf__zero">0</span>4</span>
        </h1>
        <div className="nf__side">
          <div className="nf__req" data-intro="">
            <span>GET</span><span ref={pathEl} className="nf__path" />
          </div>
          <h2 data-split="intro">This drawer is empty.</h2>
          <p data-intro="">No tool is registered at this address. It may have been renamed, or nobody has built it yet.</p>
          <div className="nf__ctas" data-intro="">
            <button type="button" className="ok-btn ok-btn--accent" onClick={openPalette} data-magnetic="">
              Search tools <span className="ok-kbd" style={{ borderColor: 'currentColor', color: 'inherit' }}>{SHORTCUT}</span>
            </button>
            <OkLink to="/" label="OmniKit — Index" className="ok-btn" data-magnetic="">Back to the index</OkLink>
          </div>
        </div>
      </div>

      <div data-intro="">
        <div className="ok-label" style={{ marginBottom: 12 }}>Closest matches</div>
        <div className="nf__near">
          {closest(pathname).map(t => (
            <OkLink key={t.id} to={t.href} label={t.navLabel} data-cursor-label="Open">
              <span className="code">{t.code}</span>
              <span className="name">{t.name}</span>
              <span>→</span>
            </OkLink>
          ))}
        </div>
      </div>
    </main>
  )
}
