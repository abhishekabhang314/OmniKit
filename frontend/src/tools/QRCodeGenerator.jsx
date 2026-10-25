import { useEffect, useRef, useState } from 'react'
import { ActionButton, Field, Segmented, ToolFrame } from '@/components/instrument'
import { useLiveApi } from '@/hooks/useLiveApi'
import { copyImage, downloadBlob } from '@/lib/output'
import { reduceMotion } from '@/lib/motion'

const THEMES = [
  { value: 'dark', label: 'Black on white' },
  { value: 'light', label: 'White on black' },
]

const toBlob = dataUrl => fetch(dataUrl).then(r => r.blob())

// Paints the PNG onto the canvas in diagonal blocks so the code "assembles".
function assemble(canvas, img, bg) {
  const ctx = canvas.getContext('2d')
  const w = img.naturalWidth, h = img.naturalHeight
  canvas.width = w
  canvas.height = h
  ctx.imageSmoothingEnabled = false
  if (reduceMotion()) { ctx.drawImage(img, 0, 0); return () => {} }

  const G = 29, cw = w / G, ch = h / G, cells = []
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) cells.push([x, y, x + y + Math.random() * 7])
  cells.sort((a, b) => a[2] - b[2])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  let drawn = 0, raf
  const t0 = performance.now()
  const step = now => {
    const p = Math.min(1, (now - t0) / 700)
    const target = Math.floor((1 - Math.pow(1 - p, 3)) * cells.length)
    for (; drawn < target; drawn++) {
      const [x, y] = cells[drawn]
      const sx = Math.floor(x * cw), sy = Math.floor(y * ch)
      const sw = Math.ceil(cw) + 1, sh = Math.ceil(ch) + 1
      ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh)
    }
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

export default function QRCodeGenerator({ tool }) {
  const [content, setContent] = useState('https://github.com/abhishekabhang314/OmniKit')
  const [border, setBorder] = useState(2)
  const [theme, setTheme] = useState('dark')
  const [size, setSize] = useState(null)
  const canvas = useRef(null)

  const empty = !content.trim()
  const { data, error, loading } = useLiveApi('/api/generators/qr-code', { content, size: 10, border, theme }, { enabled: !empty })
  const image = empty ? null : data?.image_base64
  const bg = theme === 'dark' ? '#FFFFFF' : '#000000'
  const bytes = new TextEncoder().encode(content).length

  useEffect(() => {
    if (!image) return
    let stop = () => {}
    const img = new Image()
    img.onload = () => {
      setSize([img.naturalWidth, img.naturalHeight])
      stop = assemble(canvas.current, img, bg)
    }
    img.src = image
    return () => { img.onload = null; stop() }
  }, [image, bg])

  const inputs = (
    <>
      <Field label="Content" htmlFor="qr-content">
        <textarea id="qr-content" className="tl-area" rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="A link or any text" />
        <span className="ok-meta">{bytes} bytes · UTF-8</span>
      </Field>
      <Field label="Quiet zone" aside={`${border} modules`} htmlFor="qr-border">
        <input id="qr-border" type="range" min={0} max={8} step={1} value={border} onChange={e => setBorder(+e.target.value)} />
      </Field>
      <Field label="Colours">
        <Segmented label="Colours" options={THEMES} value={theme} onChange={setTheme} />
      </Field>
    </>
  )

  const output = empty ? (
    <div className="tl-cap">Type a link or some text to generate a code.</div>
  ) : (
    <div className="tl-qr">
      <div className="tl-qr__tile" style={{ background: bg }}>
        <canvas ref={canvas} role="img" aria-label={`QR code for ${content}`} />
      </div>
      <div className="tl-qr__stats">
        <span>Payload</span><span>{bytes} B</span>
        <span>Quiet zone</span><span>{border} mod</span>
        <span>Image</span><span>{size ? `${size[0]} × ${size[1]} px` : '—'}</span>
        <span>Format</span><span>PNG</span>
      </div>
    </div>
  )

  const actions = (
    <>
      <ActionButton primary label="Download PNG" disabled={!image} onClick={async () => downloadBlob(await toBlob(image), 'omnikit-qr.png')} />
      <ActionButton label="Copy image" disabled={!image} onClick={async () => copyImage(await toBlob(image))} />
    </>
  )

  return <ToolFrame code={tool.code} inputs={inputs} output={output} actions={actions} error={empty ? null : error} busy={loading} />
}
