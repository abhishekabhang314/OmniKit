import { lazy, Suspense, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import OkLink from '@/components/OkLink'
import NotFoundPage from '@/pages/NotFoundPage'
import { usePageMotion } from '@/hooks/usePageMotion'
import { findCategory, findTool, tools, CONTRIBUTING_URL } from '@/lib/catalog'
import '@/styles/tool.css'

const TOOL_COMPONENTS = {
  'qr-code-generator': lazy(() => import('@/tools/QRCodeGenerator')),
  'unit-converter': lazy(() => import('@/tools/UnitConverter')),
  'emi-calculator': lazy(() => import('@/tools/EMICalculator')),
  'password-generator': lazy(() => import('@/tools/PasswordGenerator')),
  'uuid-generator': lazy(() => import('@/tools/UUIDGenerator')),
  'color-converter': lazy(() => import('@/tools/ColorConverter')),
  'bmi-calculator': lazy(() => import('@/tools/BMICalculator')),
  'age-calculator': lazy(() => import('@/tools/AgeCalculator')),
}

export default function ToolPage() {
  const { category, toolId } = useParams()
  const tool = findTool(toolId)
  if (!tool || tool.category !== category) return <NotFoundPage />
  return <Tool tool={tool} />
}

function Tool({ tool }) {
  const root = useRef(null)
  const cat = findCategory(tool.category)
  const ToolComponent = TOOL_COMPONENTS[tool.id]
  const related = tools.filter(t => t.category === tool.category && t.id !== tool.id)

  usePageMotion(root, { fast: true })
  useEffect(() => { document.title = `${tool.name} — OmniKit` }, [tool.name])

  return (
    <main ref={root} className="tl-page">
      <nav className="tl-crumbs ok-label" aria-label="Breadcrumb">
        <OkLink to="/" label="OmniKit — Index">OmniKit</OkLink><span>/</span>
        <OkLink to={cat.href} label={cat.navLabel}>{cat.name}</OkLink><span>/</span>
        <span aria-current="page">{tool.name}</span>
      </nav>

      <div className="tl-head">
        <h1 data-split="intro">{tool.name}</h1>
        <div className="tl-head__side" data-intro="">
          <div className="tl-tags">
            <OkLink to={cat.href} label={cat.navLabel} className="is-cat">{cat.name}</OkLink>
            <span>{tool.code}</span>
            {tool.isNew && <span className="is-new">New</span>}
          </div>
          <p>{tool.desc}</p>
          <div className="ok-meta">{tool.route} · {tool.tagLine}</div>
        </div>
      </div>

      {ToolComponent ? (
        <Suspense fallback={<div className="tl-soon ok-label">Loading tool…</div>}>
          <ToolComponent tool={tool} />
        </Suspense>
      ) : (
        <div className="tl-soon">
          <span className="ok-label">Coming soon</span>
          <p>This tool is registered but not built yet. Want to ship it?</p>
          <OkLink to={CONTRIBUTING_URL} className="ok-btn ok-btn--accent">Contribute →</OkLink>
        </div>
      )}

      {related.length > 0 && (
        <section className="tl-related">
          <div className="tl-related__head">
            <div>
              <div className="ok-label">More in {cat.name}</div>
              <h2 data-split="scroll">Related tools</h2>
            </div>
            <OkLink to={cat.href} label={cat.navLabel} className="ok-btn ok-btn--quiet" data-magnetic="">All {cat.name} →</OkLink>
          </div>
          <div className="tl-related__grid">
            {related.map(t => (
              <OkLink key={t.id} to={t.href} label={t.navLabel} className="tl-rel ok-spot" data-batch="" data-tilt="" data-cursor-label="Open tool">
                <span className="tl-rel__top"><span>{t.code}</span><span>{t.catName}</span></span>
                <span className="tl-rel__abbr ok-outline" data-depth="1" aria-hidden="true">{t.abbr}</span>
                <span>
                  <span className="tl-rel__name">{t.name}</span>
                  <span className="tl-rel__desc">{t.desc}</span>
                </span>
              </OkLink>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
