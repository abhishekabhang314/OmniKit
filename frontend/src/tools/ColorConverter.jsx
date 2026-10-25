import { useEffect, useRef, useState } from 'react'
import { ActionButton, Field, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyText } from '@/lib/output'
import { gsap, reduceMotion } from '@/lib/motion'

const SAMPLES = ['#C8F23A', 'rgb(255, 99, 71)', 'hsl(210, 90%, 55%)', '#0D0E0B', '#F4F1E8']

const sourceOf = s => (/^\s*rgb/i.test(s) ? 'RGB' : /^\s*hsl/i.test(s) ? 'HSL' : 'HEX')

// WCAG relative luminance of a #RRGGBB colour.
function luminance(hex) {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
  const c = rgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

export default function ColorConverter({ tool }) {
  const [input, setInput] = useState('#C8F23A')
  const swatch = useRef(null)

  const blank = !input.trim()
  const { data, error, loading } = useLiveApi('/api/converters/color', { color: input.trim() }, { enabled: !blank })
  const hex = data?.hex?.toUpperCase() || '#C8F23A'
  const L = luminance(hex)
  const darkInk = L > 0.4
  const invalid = !!error && !blank

  useEffect(() => {
    if (!swatch.current) return
    if (reduceMotion()) swatch.current.style.background = hex
    else gsap.to(swatch.current, { backgroundColor: hex, duration: 0.7, ease: 'power2.inOut' })
  }, [hex])

  const rows = data ? [['HEX', hex], ['RGB', data.rgb], ['HSL', data.hsl]] : []

  const inputs = (
    <>
      <Field label="Colour value" htmlFor="co-in">
        <div className="tl-co-picker">
          <input id="co-in" className="tl-text" type="text" spellCheck="false" value={input} onChange={e => setInput(e.target.value)} placeholder="#C8F23A, rgb(…), hsl(…)" />
          <input type="color" value={hex.toLowerCase()} onChange={e => setInput(e.target.value.toUpperCase())} aria-label="Pick a colour" />
        </div>
        <span className="ok-meta" style={invalid ? { color: 'var(--danger)' } : undefined}>
          {blank ? 'Enter a HEX, RGB or HSL value' : invalid ? 'Not a colour yet — showing the last valid value' : `Read as ${sourceOf(input)}`}
        </span>
      </Field>
      <Field label="Try">
        <div className="tl-samples">
          {SAMPLES.map(v => (
            <button key={v} type="button" onClick={() => setInput(v)}><i style={{ background: v }} />{v}</button>
          ))}
        </div>
      </Field>
    </>
  )

  const output = (
    <>
      <div ref={swatch} className="tl-swatch" style={{ color: darkInk ? '#10110D' : '#FFFFFF' }}>
        <strong>{hex}</strong>
        <span>{darkInk ? 'Dark text reads best' : 'Light text reads best'}</span>
      </div>
      <div className="tl-co-rows">
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className="k">{k}</span>
            <span className="v">{v}</span>
            <ActionButton small label="Copy" onClick={() => copyText(v)} />
          </div>
        ))}
      </div>
      <div className="tl-cap" style={{ textTransform: 'none', letterSpacing: 0 }}>
        Contrast · on white {(1.05 / (L + 0.05)).toFixed(2)}:1 · on black {((L + 0.05) / 0.05).toFixed(2)}:1
      </div>
    </>
  )

  const actions = <ActionButton primary label="Copy all three" disabled={!rows.length} onClick={() => copyText(rows.map(r => r[1]).join('\n'))} />

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} busy={loading} />
}
