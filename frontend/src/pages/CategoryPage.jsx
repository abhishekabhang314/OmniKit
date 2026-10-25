import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import OkLink from '@/components/OkLink'
import NotFoundPage from '@/pages/NotFoundPage'
import { usePageMotion } from '@/hooks/usePageMotion'
import { categories, categoryCount, chapterColors, NEW_TOOL_URL } from '@/lib/catalog'
import '@/styles/category.css'

// Bento rhythm across the 12-column grid.
const SPANS = [7, 5, 5, 7, 4, 4, 4]

// Column spans for each tool, plus a span for the propose cell that fills
// whatever is left of the last row (a full row if the tools end flush).
function bento(list) {
  const spans = list.map((_, i) => SPANS[i % SPANS.length])
  const used = spans.reduce((a, s) => (a + s) % 12, 0)
  return { spans, rest: (12 - used) % 12 || 12 }
}

// Which live ticker previews each tool; the rest show a static sample.
const TICKERS = { 'qr-code-generator': 'qr', 'uuid-generator': 'uuid', 'password-generator': 'pass', 'color-converter': 'color' }

function ageSample() {
  const a = new Date(1995, 5, 14), b = new Date()
  let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate()
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate() }
  if (m < 0) { y--; m += 12 }
  return `1995-06-14 → ${y}y ${m}m ${d}d`
}

const SAMPLES = {
  'unit-converter': '1 mi = 1.609344 km',
  'emi-calculator': '₹25,00,000 · 8.5% · 20 y → ₹21,696/mo',
  'bmi-calculator': '175 cm · 70 kg → 22.9',
  'age-calculator': ageSample(),
}

export default function CategoryPage() {
  const { category } = useParams()
  const idx = categories.findIndex(c => c.id === category)
  if (idx < 0) return <NotFoundPage />
  return <Category idx={idx} />
}

function Category({ idx }) {
  const root = useRef(null)
  const cat = categories[idx]
  const colors = chapterColors(idx)
  const nextIdx = (idx + 1) % categories.length
  const next = categories[nextIdx]
  const nextColors = chapterColors(nextIdx)

  usePageMotion(root, { fast: true, tickers: true })
  useEffect(() => { document.title = `${cat.name} — OmniKit` }, [cat.name])

  const { spans, rest: proposeSpan } = bento(cat.tools)
  const cells = cat.tools.map((t, i) => ({ tool: t, span: spans[i], big: spans[i] >= 7 }))

  return (
    <div ref={root}>
      <section className="ct-hero" style={{ background: colors.bg, color: colors.fg }}>
        <div className="ct-hero__meta" data-intro="">
          <nav className="ct-crumbs" aria-label="Breadcrumb">
            <OkLink to="/" label="OmniKit — Index">OmniKit</OkLink>
            <span>/</span>
            <span aria-current="page">{cat.name}</span>
          </nav>
          <span>Chapter {cat.n} of {categoryCount} · {cat.count} tools</span>
        </div>
        <div className="ct-hero__body">
          <div className="ct-hero__num" aria-hidden="true" data-depth="-2">{cat.n}</div>
          <div className="ct-hero__copy">
            <h1 data-split="intro">{cat.name}</h1>
            <p data-intro="">{cat.blurb}</p>
          </div>
        </div>
        <div className="ct-tabs" data-intro="">
          {categories.map(c => (
            <OkLink key={c.id} to={c.href} label={c.navLabel} aria-current={c.id === cat.id ? 'page' : undefined}>
              {c.n} {c.name}
            </OkLink>
          ))}
        </div>
      </section>

      <section className="ct-grid-wrap">
        <div className="ct-grid-head ok-label"><span>§ {cat.n} / All tools</span><span>Sorted as in tools.json</span></div>
        <div className="ct-grid">
          {cells.map(({ tool: t, span, big }) => (
            <OkLink
              key={t.id}
              to={t.href}
              label={t.navLabel}
              className={`ct-cell ok-spot${big ? ' ct-cell--big' : ''}`}
              style={{ gridColumn: `span ${span}` }}
              data-batch=""
              data-tilt=""
              data-cursor-label="Open tool"
            >
              <span className="ct-cell__top"><span>{t.code}</span><span>{t.isNew ? `New · ${t.tags.length} tags` : t.tagLine}</span></span>
              <span className="ct-cell__preview" data-depth="1.2" aria-hidden="true"><Preview tool={t} /></span>
              <span className="ct-cell__foot">
                <span className="ct-cell__text">
                  <span className="ct-cell__name">{t.name}</span>
                  <span className="ct-cell__desc">{t.desc}</span>
                </span>
                <span className="ct-cell__go">→</span>
              </span>
            </OkLink>
          ))}
          <OkLink to={NEW_TOOL_URL} className="ct-cell ct-cell--propose" style={{ gridColumn: `span ${proposeSpan}` }} data-batch="" data-cursor-label="GitHub">
            <span className="ct-cell__top"><span>TOOL/NEW</span><span>Open to contributors</span></span>
            <span className="ct-cell__plus" aria-hidden="true">+</span>
            <span className="ct-cell__foot">
              <span className="ct-cell__text">
                <span className="ct-cell__name">Propose a {cat.name.replace(/s$/, '').toLowerCase()}</span>
                <span className="ct-cell__desc">Add an entry to tools.json, a route and an endpoint, then open a pull request.</span>
              </span>
              <span className="ct-cell__go">↗</span>
            </span>
          </OkLink>
        </div>
      </section>

      <OkLink to={next.href} label={next.navLabel} className="ct-next" style={{ background: nextColors.bg, color: nextColors.fg }} data-cursor-label="Next chapter">
        <span className="ct-next__meta"><span>Next chapter</span><span>{next.n} / {categoryCount} · {next.count} tools</span></span>
        <span className="ct-next__name" data-split="scroll">{next.name} →</span>
      </OkLink>
    </div>
  )
}

function Preview({ tool }) {
  switch (TICKERS[tool.id]) {
    case 'qr': return <canvas data-tick="qr" />
    case 'uuid': return <span data-tick="uuid">3f1c9a2e-77b0-4c1d-9e2a-5b8d0f6a41c7</span>
    case 'pass': return <span className="pw" data-tick="pass" data-len="18">k7#Qm2!vR9xT&amp;pL4zz</span>
    case 'color': return <><span className="sw" data-tick="swatch" /><span className="hex" data-tick="hex">#C8F23A</span></>
    default: return <span>{SAMPLES[tool.id] || tool.tagLine}</span>
  }
}
