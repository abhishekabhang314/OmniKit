import { useEffect, useRef } from 'react'
import OkLink from '@/components/OkLink'
import { useShell } from '@/context/ShellContext'
import { usePageMotion } from '@/hooks/usePageMotion'
import { useRepoStats } from '@/hooks/useRepoStats'
import { categories, tools, toolCount, categoryCount, findTool, chapterColors, CONTRIBUTING_URL, NEW_TOOL_URL } from '@/lib/catalog'
import { countTo } from '@/lib/motion'
import { SHORTCUT } from '@/lib/keys'
import '@/styles/home.css'

const featured = tools.filter(t => t.featured)
const live = id => findTool(id) || {}
const fmtInt = v => Math.round(v).toLocaleString('en-US')

export default function HomePage() {
  const root = useRef(null)
  const { openPalette } = useShell()
  usePageMotion(root, { tickers: true })

  useEffect(() => { document.title = 'OmniKit — everyday tools in one kit' }, [])

  const qr = live('qr-code-generator')
  const uuid = live('uuid-generator')
  const pw = live('password-generator')
  const color = live('color-converter')

  return (
    <div ref={root}>
      <section className="hm-hero" data-hero="">
        <div className="hm-hero__inner" data-hero-inner="">
          <div className="hm-hero__main">
            <div className="hm-hero__meta ok-label" data-intro="">
              <span>§00 / Index</span>
              <span>[ {toolCount} tools · {categoryCount} categories · free &amp; open source ]</span>
            </div>
            <h1 className="hm-hero__title">
              <span data-split="intro">Every tool</span>
              <span data-split="intro" style={{ color: 'var(--mute)' }}>you reach for,</span>
              <span className="hm-last">
                <span data-split="intro">in</span>
                <span data-split="intro" style={{ color: 'var(--acc-text)' }}>one kit.</span>
              </span>
            </h1>
            <div className="hm-hero__foot">
              <p className="hm-hero__lede" data-intro="">
                A free, open-source set of generators, converters and calculators. Open a tool, get the answer, move on.
              </p>
              <button type="button" className="hm-search" data-intro="" data-cursor-label="Search" onClick={openPalette}>
                <span className="hm-search__ring" />
                <span className="hm-search__hint">Search {toolCount} tools — try “qr”, “loan”, “hex”</span>
                <span className="hm-search__key">{SHORTCUT}</span>
              </button>
            </div>
          </div>

          <aside className="hm-live" data-intro="" aria-label="Live tool output">
            <div className="hm-live__head">
              <span><span className="hm-dot" />Live output</span>
              <span>4 ch</span>
            </div>
            <OkLink to={qr.href} label={qr.navLabel} className="hm-live__row hm-live__row--split" data-cursor-label="Open QR">
              <div className="hm-qr"><canvas data-tick="qr" aria-label="QR code assembling" /></div>
              <div className="hm-live__stack">
                <span className="ok-meta">{qr.code}</span>
                <span className="hm-live__name">{qr.short}</span>
                <span className="ok-meta">25×25 · ECC M</span>
              </div>
            </OkLink>
            <OkLink to={uuid.href} label={uuid.navLabel} className="hm-live__row" data-cursor-label="Open UUID">
              <div className="hm-live__cap"><span>{uuid.code} · UUID v4</span><span>↻ 2.6s</span></div>
              <div className="hm-readout"><span data-tick="uuid">3f1c9a2e-77b0-4c1d-9e2a-5b8d0f6a41c7</span></div>
            </OkLink>
            <OkLink to={pw.href} label={pw.navLabel} className="hm-live__row" data-cursor-label="Open Password">
              <div className="hm-live__cap"><span>{pw.code} · Password</span><span>16 chr · strong</span></div>
              <div className="hm-readout hm-readout--pw"><span data-tick="pass" data-len="16">k7#Qm2!vR9xT&amp;pL4</span></div>
            </OkLink>
            <OkLink to={color.href} label={color.navLabel} className="hm-live__row hm-live__row--split" data-cursor-label="Open Color">
              <div className="hm-swatch" data-tick="swatch" />
              <div className="hm-live__stack" style={{ fontFamily: 'var(--f-mono)' }}>
                <span className="ok-meta" style={{ fontSize: 10, letterSpacing: '.08em' }}>{color.code} · Color</span>
                <span className="hm-hex" data-tick="hex">#C8F23A</span>
                <span className="ok-meta" data-tick="hsl">hsl(74 88% 59%)</span>
              </div>
            </OkLink>
          </aside>
        </div>
      </section>

      <section id="featured" className="hm-featured" data-hscroll="">
        <div className="hm-sechead">
          <div>
            <div className="ok-label">§01 / Featured</div>
            <h2 className="ok-h2" data-split="scroll">Most reached-for</h2>
          </div>
          <div className="hm-progress ok-label">
            <div className="hm-progress__meta"><span>Scroll to advance</span><span>{String(featured.length).padStart(2, '0')} tools</span></div>
            <div className="hm-progress__bar"><div data-hprogress="" /></div>
          </div>
        </div>
        <div className="hm-viewport" data-viewport="" data-lenis-prevent-wheel="">
          <div className="hm-track" data-track="">
            {featured.map(t => (
              <OkLink key={t.id} to={t.href} label={t.navLabel} className="hm-card ok-spot" data-tilt="" data-cursor-label="Open tool">
                <div className="hm-card__top"><span>{t.code}</span><span>{t.catName}</span></div>
                <div className="hm-card__abbr ok-outline" data-hcard-inner="" aria-hidden="true">{t.abbr}</div>
                <div>
                  <div className="hm-card__name">{t.short}</div>
                  <p className="hm-card__desc">{t.desc}</p>
                  <div className="hm-card__cta"><span>Open tool</span><span>→</span></div>
                </div>
              </OkLink>
            ))}
            <OkLink scrollTo="#index" className="hm-card hm-card--end" data-cursor-label="Jump">
              <span className="ok-label">End of track</span>
              <strong>All {toolCount} tools ↓</strong>
            </OkLink>
          </div>
        </div>
      </section>

      <section id="categories" className="hm-chapters" data-chapters="">
        {categories.map((c, i) => {
          const { bg, fg } = chapterColors(i)
          return (
            <div key={c.id} className="hm-chapter" data-chapter="" style={{ background: bg, color: fg }}>
              <div className="hm-chapter__meta" data-chapter-content="">
                <span>§02 / Category {c.n} of {categoryCount}</span><span>{c.count} tools</span>
              </div>
              <div className="hm-chapter__body">
                <div className="hm-chapter__num" data-chapter-num="" aria-hidden="true">{c.n}</div>
                <div className="hm-chapter__copy" data-chapter-content="">
                  <h3><OkLink to={c.href} label={c.navLabel} data-cursor-label="Open chapter">{c.name} ↗</OkLink></h3>
                  <p>{c.blurb}</p>
                  <div className="hm-chapter__list">
                    {c.tools.map(t => (
                      <OkLink key={t.id} to={t.href} label={t.navLabel} data-cursor-label="Open">
                        <span className="code">{t.code}</span>
                        <span className="name">{t.name}</span>
                        <span className="arrow">→</span>
                      </OkLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section id="index" className="hm-index">
        <div className="hm-sechead">
          <div>
            <div className="ok-label">§03 / Index</div>
            <h2 className="ok-h2" data-split="scroll">The full kit</h2>
          </div>
          <p className="hm-index__note">Every tool in tools.json, in manifest order. Press <kbd>/</kbd> anywhere to search.</p>
        </div>
        <div className="hm-rows">
          {tools.map(t => (
            <OkLink key={t.id} to={t.href} label={t.navLabel} className="hm-row" data-batch="" data-cursor-label="Open">
              <span className="hm-row__code">{t.code}</span>
              <span className="hm-row__abbr" data-depth="1.2">{t.abbr}</span>
              <span className="hm-row__main">
                <span className="hm-row__name">{t.name}</span>
                <span className="hm-row__desc">{t.desc}</span>
              </span>
              <span className="hm-row__cat ok-label">{t.catName}</span>
              <span className="hm-row__tags ok-meta">{t.tagLine}</span>
              <span className="hm-row__go">→</span>
            </OkLink>
          ))}
        </div>
      </section>

      <Contribute />
    </div>
  )
}

function Contribute() {
  const stats = useRepoStats()
  const contributors = useRef(null)
  const stars = useRef(null)

  useEffect(() => {
    if (!stats) return
    countTo(contributors.current, stats.contributors ?? NaN, fmtInt)
    countTo(stars.current, stats.stars ?? NaN, fmtInt)
  }, [stats])

  const marquee = tools.concat(tools)

  return (
    <section id="contribute" className="hm-contrib">
      <div className="hm-contrib__top">
        <div className="hm-contrib__title">
          <div className="ok-label">§04 / Built by the community</div>
          <h2>
            <span data-split="scroll">Built in the open.</span>
            <span data-split="scroll" style={{ color: 'var(--acc-text)' }}>Bring a tool.</span>
          </h2>
        </div>
        <div className="hm-contrib__side">
          <p>Each tool is one entry in tools.json, one React route and one FastAPI endpoint. Add yours and it shows up here.</p>
          <ol>
            <li>01 — Fork the repo</li>
            <li>02 — Register your tool in tools.json</li>
            <li>03 — Open a pull request</li>
          </ol>
          <div className="hm-contrib__ctas">
            <OkLink to={CONTRIBUTING_URL} className="ok-btn ok-btn--accent" data-magnetic="" data-cursor-label="GitHub">Contribute on GitHub ↗</OkLink>
            <OkLink to={NEW_TOOL_URL} className="ok-btn" data-magnetic="">Propose a tool</OkLink>
          </div>
        </div>
      </div>

      <div className="hm-stats">
        <div className="hm-stat">
          <div className="ok-label">Tools shipped</div>
          <div className="hm-stat__val" data-count={tools.length} data-pad="2">{toolCount}</div>
        </div>
        <div className="hm-stat">
          <div className="ok-label">Contributors</div>
          <div className="hm-stat__val" ref={contributors}>—</div>
        </div>
        <div className="hm-stat">
          <div className="ok-label">GitHub stars</div>
          <div className="hm-stat__val" ref={stars}>—</div>
        </div>
      </div>

      <div className="hm-marquee" aria-hidden="true">
        <div data-marquee="" data-dir="1">
          <div className="hm-marquee__row">
            {marquee.map((t, i) => (
              <span key={i} className="hm-marquee__item">{t.short}<span className="hm-marquee__sq" /></span>
            ))}
          </div>
        </div>
        <div data-marquee="" data-dir="-1">
          <div className="hm-marquee__row">
            {marquee.map((t, i) => (
              <span key={i} className="hm-marquee__item ok-outline">{t.code}<span className="hm-marquee__cat">/{t.catName}</span></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
