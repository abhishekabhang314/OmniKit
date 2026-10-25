import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { countTo, scramble, ScrollTrigger } from '@/lib/motion'

/* Form controls for the input panel ─────────────────────────── */

export function Field({ label, aside, htmlFor, children }) {
  const Tag = htmlFor ? 'label' : 'div'
  return (
    <div className="tl-field">
      <div className="tl-field__head">
        <Tag className="ok-label" htmlFor={htmlFor}>{label}</Tag>
        {aside != null && <span className="ok-meta tl-field__aside">{aside}</span>}
      </div>
      {children}
    </div>
  )
}

// Joined button group with one active option.
export function Segmented({ label, options, value, onChange, wrap }) {
  return (
    <div role="group" aria-label={label} className={`tl-seg${wrap ? ' tl-seg--wrap' : ''}`}>
      {options.map(o => (
        <button key={String(o.value)} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          <span>{o.label}</span>
          {o.sub && <small>{o.sub}</small>}
        </button>
      ))}
    </div>
  )
}

// Separate chips (unit pickers).
export function Chips({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="tl-chips">
      {options.map(o => (
        <button key={o.value} type="button" title={o.title} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ label, sample, on, onChange }) {
  return (
    <button type="button" className="tl-toggle" aria-pressed={on} onClick={() => onChange(!on)}>
      <span className="tl-toggle__box" />
      <span className="tl-toggle__label">{label}</span>
      <span className="ok-meta">{sample}</span>
    </button>
  )
}

// Text input with prefix/suffix plus a range slider bound to the same value.
export function NumberField({ id, label, hint, value, onChange, min, max, step, prefix, suffix }) {
  const n = parseFloat(String(value).replace(/,/g, ''))
  return (
    <Field label={label} aside={hint} htmlFor={id}>
      <div className="tl-num">
        {prefix && <span className="tl-num__pre">{prefix}</span>}
        <input id={id} type="text" inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} />
        {suffix && <span className="tl-num__suf">{suffix}</span>}
      </div>
      <input type="range" aria-label={label} min={min} max={max} step={step} value={isFinite(n) ? n : min} onChange={e => onChange(e.target.value)} />
    </Field>
  )
}

/* Output readouts ────────────────────────────────────────────── */

// Number that counts from its previous value to the new one.
export function CountUp({ value, format, className, style }) {
  const el = useRef(null)
  useEffect(() => { countTo(el.current, value, format) }, [value, format])
  return <span ref={el} className={className} style={style} />
}

// Text that decodes through random glyphs whenever it changes.
export function Scramble({ text, dur = 700, className, style }) {
  const el = useRef(null)
  useEffect(() => { scramble(el.current, text, dur) }, [text, dur])
  return <span ref={el} className={className} style={style} />
}

/* Actions ────────────────────────────────────────────────────── */

// Output-panel button that briefly confirms ("Copied ✓") after running.
export function ActionButton({ label, done, onClick, primary, disabled, small }) {
  const doneLabel = done || (label.startsWith('Copy') ? 'Copied ✓' : 'Done ✓')
  const [flash, setFlash] = useState(false)
  const t = useRef(null)
  useEffect(() => () => clearTimeout(t.current), [])
  const run = async () => {
    const ok = await onClick()
    if (ok === false) return
    setFlash(true)
    clearTimeout(t.current)
    t.current = setTimeout(() => setFlash(false), 1500)
  }
  const cls = ['tl-act', primary && 'tl-act--primary', flash && 'tl-act--done', small && 'tl-act--small'].filter(Boolean).join(' ')
  return (
    <button type="button" className={cls} onClick={run} disabled={disabled} data-magnetic={small ? undefined : ''}>
      {flash ? doneLabel : label}
    </button>
  )
}

/* Layout ─────────────────────────────────────────────────────── */

// Input column + sticky live output panel, with actions under the output.
export function ToolFrame({ code, inputs, output, actions, error, busy, after }) {
  // Tools load lazily, after the page measured its scroll triggers.
  useLayoutEffect(() => { ScrollTrigger.refresh() }, [])

  return (
    <>
      <section className="tl-frame">
        <div className="tl-in">
          <div className="tl-in__head ok-label"><span>Input</span><span>{code}/IN</span></div>
          {inputs}
        </div>
        <div className="tl-out">
          <div className="tl-out__head">
            <span><span className={`tl-out__dot${busy ? ' is-busy' : ''}`} />Output · live</span>
            <span>{code}/OUT</span>
          </div>
          <div className="tl-out__body" aria-live="polite">
            {output}
            {error && <div className="tl-err" role="alert">{error}</div>}
          </div>
          <div className="tl-out__actions">
            {actions}
            <span className="tl-out__note">Computed by the OmniKit API</span>
          </div>
        </div>
      </section>
      {after}
    </>
  )
}
