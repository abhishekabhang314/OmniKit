// Motion layer: Lenis smooth scrolling driven by the GSAP ticker, plus the
// scroll choreography, pointer effects and live "readout" tickers used across
// the site. Pages opt in through data-* attributes and call setupPage().
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const EASE = { out: 'power3.out', expoOut: 'expo.out', inOut: 'expo.inOut' }
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Smooth scroll ─────────────────────────────────────────── */

let lenis = null
let velocity = 0

export function startSmoothScroll() {
  const R = reduceMotion()
  lenis = new Lenis({ duration: 1.15, smoothWheel: !R, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', e => { ScrollTrigger.update(); velocity = e.velocity || 0 })
  const raf = t => lenis && lenis.raf(t * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToTarget(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, offset: -10, ...opts })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else document.querySelector(target)?.scrollIntoView()
}

export const lockScroll = () => lenis && lenis.stop()
export const unlockScroll = () => lenis && lenis.start()

/* ── Curtain page transition ───────────────────────────────── */

let curtain = null
let covering = true // the curtain starts down so the first page can wipe it away

export function registerCurtain(el) { curtain = el }

export function coverThen(label, done) {
  if (!curtain || reduceMotion()) { done(); return }
  const lab = curtain.querySelector('[data-curtain-label]')
  if (lab) lab.textContent = label || 'OmniKit'
  covering = true
  curtain.style.display = 'flex'
  gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE.inOut, onComplete: done })
}

function revealCurtain(tl, fast) {
  if (!curtain || !covering) return null
  covering = false
  const el = curtain
  return tl.fromTo(el, { yPercent: 0 }, {
    yPercent: -100,
    duration: reduceMotion() ? 0.01 : (fast ? 0.8 : 1.1),
    ease: EASE.inOut,
    onComplete: () => { el.style.display = 'none' },
  })
}

// Safety net: never leave the curtain down if a page fails to reveal it.
export function liftCurtain() {
  if (!curtain || !covering) return
  covering = false
  gsap.to(curtain, { yPercent: -100, duration: 0.6, ease: EASE.inOut, onComplete: () => { curtain.style.display = 'none' } })
}

/* ── Text helpers ──────────────────────────────────────────── */

const GLYPH = 'ABCDEF0123456789#%&*+=?<>'

export function scramble(el, text, dur = 900) {
  if (!el) return
  if (reduceMotion()) { el.textContent = text; return }
  cancelAnimationFrame(el._sr)
  const start = performance.now()
  const step = now => {
    const p = Math.min(1, (now - start) / dur)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      const c = text[i]
      out += (c === '-' || c === ' ' || p >= 0.2 + 0.8 * i / text.length) ? c : GLYPH[Math.random() * GLYPH.length | 0]
    }
    el.textContent = out
    if (p < 1) el._sr = requestAnimationFrame(step)
  }
  el._sr = requestAnimationFrame(step)
}

// Splits text into per-character spans inside overflow-hidden word masks.
function split(el) {
  if (el._chars) return el._chars
  const text = el.textContent.trim()
  el.setAttribute('aria-label', text)
  el.textContent = ''
  const chars = []
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span')
    w.setAttribute('aria-hidden', 'true')
    w.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.06em;margin-bottom:-0.06em'
    for (const ch of word) {
      const c = document.createElement('span')
      c.textContent = ch
      c.style.display = 'inline-block'
      c.style.willChange = 'transform'
      w.appendChild(c)
      chars.push(c)
    }
    el.appendChild(w)
    if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '))
  })
  el._chars = chars
  return chars
}

/* ── Count-up numbers ──────────────────────────────────────── */

// Tweens a number from its previous value to `to`, formatting each frame.
export function countTo(el, to, format) {
  if (!el) return
  if (!isFinite(to)) { el._to = null; el.textContent = '—'; return }
  if (el._to === to && el._fmt === format) return
  const from = el._to == null ? 0 : el._to
  el._to = to
  el._fmt = format
  if (el._tw) el._tw.kill()
  if (reduceMotion()) { el.textContent = format(to); return }
  const o = { v: from }
  el._tw = gsap.to(o, { v: to, duration: 0.9, ease: EASE.out, onUpdate: () => { el.textContent = format(o.v) } })
}

/* ── Page choreography ─────────────────────────────────────── */

export function setupPage(root, opts = {}) {
  const R = reduceMotion()
  const $ = s => root.querySelector(s)
  const $$ = s => [...root.querySelectorAll(s)]

  let wiped = null
  const ctx = gsap.context(() => {
    // Intro: curtain wipe → split headline → supporting UI
    const intro = gsap.timeline({ delay: 0.1 })
    wiped = revealCurtain(intro, opts.fast)
    $$('[data-split=intro]').forEach((el, i) => {
      const ch = split(el)
      if (!R) intro.from(ch, { yPercent: 115, duration: 1.1, ease: EASE.expoOut, stagger: 0.022 }, i === 0 ? (wiped ? '-=0.45' : 0) : '<0.09')
    })
    const ui = $$('[data-intro]')
    if (ui.length) intro.from(ui, { opacity: 0, y: R ? 0 : 16, duration: 0.8, ease: EASE.out, stagger: 0.06 }, '-=0.8')

    $$('[data-split=scroll]').forEach(el => {
      const ch = split(el)
      if (!R) gsap.from(ch, { yPercent: 115, duration: 1, ease: EASE.expoOut, stagger: 0.018, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    })

    const items = $$('[data-batch]')
    if (!R && items.length) {
      gsap.set(items, { opacity: 0, y: 48 })
      ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, stagger: 0.08, overwrite: true }) })
    }

    if (!R) $$('[data-depth]').forEach(el => {
      const d = parseFloat(el.dataset.depth) || 1
      gsap.fromTo(el, { y: 18 * d }, { y: -18 * d, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })

    $$('[data-count]').forEach(el => {
      const to = +el.dataset.count
      const padTo = +(el.dataset.pad || 0)
      const fmt = v => { const s = Math.round(v).toLocaleString('en-US'); return padTo ? s.padStart(padTo, '0') : s }
      if (R) { el.textContent = fmt(to); return }
      const o = { v: 0 }
      el.textContent = fmt(0)
      gsap.to(o, { v: to, ease: 'none', onUpdate: () => { el.textContent = fmt(o.v) }, scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 50%', scrub: 0.6 } })
    })
  }, root)

  // Velocity-reactive marquee rows
  const rows = $$('[data-marquee]').map(row => ({ el: row.firstElementChild, x: 0, dir: +(row.dataset.dir || 1) }))
  let lastDir = 1
  const marquee = (t, dt) => {
    if (Math.abs(velocity) > 0.5) lastDir = velocity > 0 ? 1 : -1
    const boost = 1 + Math.min(Math.abs(velocity) * 0.35, 8)
    rows.forEach(r => {
      const w = r.el.scrollWidth / 2
      if (!w) return
      r.x -= r.dir * lastDir * (R ? 0.25 : 0.8) * boost * (dt / 16.67)
      if (r.x <= -w) r.x += w
      if (r.x > 0) r.x -= w
      gsap.set(r.el, { x: r.x })
    })
    velocity *= 0.92
  }
  if (rows.length) gsap.ticker.add(marquee)

  // Pinned sequences only run on wide screens with motion allowed.
  const mm = gsap.matchMedia()
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const hero = $('[data-hero]')
    const inner = $('[data-hero-inner]')
    if (hero && inner) {
      ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', pin: true, pinSpacing: false })
      gsap.to(inner, { scale: 0.9, yPercent: -6, opacity: 0.12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    }

    const hs = $('[data-hscroll]')
    if (hs) {
      const track = hs.querySelector('[data-track]')
      const vp = hs.querySelector('[data-viewport]')
      gsap.set(vp, { overflow: 'hidden' })
      const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth)
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } })
      const bar = hs.querySelector('[data-hprogress]')
      if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: hs, start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true } })
      hs.querySelectorAll('[data-hcard-inner]').forEach(el => gsap.fromTo(el, { xPercent: 10 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: el.parentElement, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }))
    }

    const chs = $('[data-chapters]')
    if (chs) {
      const panels = [...chs.querySelectorAll('[data-chapter]')]
      gsap.set(chs, { height: '100vh', overflow: 'hidden' })
      gsap.set(panels, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minHeight: 0 })
      gsap.set(panels.slice(1), { opacity: 0 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: chs, start: 'top top', end: '+=' + (panels.length - 1) * 110 + '%', pin: true, scrub: 1, snap: { snapTo: 'labels', duration: { min: 0.3, max: 0.8 }, ease: 'power2.inOut' } } })
      tl.addLabel('c0')
      panels.forEach((p, i) => {
        if (!i) return
        tl.to(panels[i - 1].querySelectorAll('[data-chapter-content],[data-chapter-num]'), { yPercent: -14, opacity: 0, ease: 'power2.in', duration: 0.5, stagger: 0.05 })
          .fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, '<0.15')
          .from(p.querySelectorAll('[data-chapter-num]'), { yPercent: 35, duration: 0.7, ease: EASE.out }, '<')
          .from(p.querySelectorAll('[data-chapter-content]'), { yPercent: 14, opacity: 0, duration: 0.6, ease: EASE.out }, '<0.1')
          .addLabel('c' + i)
      })
    }
  })

  const refresh = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(refresh)
  window.addEventListener('load', refresh)

  return () => {
    window.removeEventListener('load', refresh)
    gsap.ticker.remove(marquee)
    mm.revert()
    // Reverting an unfinished wipe puts the curtain back down; let the next
    // setup (e.g. StrictMode's second mount) lift it again.
    const unfinished = wiped && wiped.progress() < 1
    ctx.revert()
    if (unfinished) covering = true
  }
}

/* ── Pointer effects (cursor, magnetic buttons, tilt cards) ── */

export function setupPointer(cursorEl) {
  const mq = window.matchMedia('(pointer: fine) and (min-width: 900px) and (prefers-reduced-motion: no-preference)')
  let off = []
  const on = (el, ev, fn) => { el.addEventListener(ev, fn); off.push(() => el.removeEventListener(ev, fn)) }

  const enable = () => {
    if (cursorEl) {
      gsap.set(cursorEl, { display: 'block' })
      const dot = cursorEl.querySelector('[data-cursor-dot]')
      const lab = cursorEl.querySelector('[data-cursor-text]')
      const xT = gsap.quickTo(cursorEl, 'x', { duration: 0.35, ease: 'power3' })
      const yT = gsap.quickTo(cursorEl, 'y', { duration: 0.35, ease: 'power3' })
      on(window, 'pointermove', e => { xT(e.clientX); yT(e.clientY) })
      on(document, 'pointerover', e => {
        const t = e.target.closest?.('a,button,input,select,textarea,[data-cursor-label]')
        const label = (t && t.dataset.cursorLabel) || ''
        gsap.to(dot, { scale: t ? (label ? 2.6 : 2) : 1, duration: 0.35, ease: EASE.out })
        lab.textContent = label
        gsap.to(lab, { opacity: label ? 1 : 0, x: label ? 0 : -6, duration: 0.25 })
      })
    }

    // Delegated so elements on newly mounted routes pick it up automatically.
    let mag = null
    let tilt = null
    const leaveMag = () => { if (mag) gsap.to(mag, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' }); mag = null }
    const leaveTilt = () => {
      if (!tilt) return
      gsap.to(tilt, { rotationX: 0, rotationY: 0, duration: 0.7, ease: EASE.out })
      tilt.style.setProperty('--spot', '0')
      tilt = null
    }
    on(document, 'pointermove', e => {
      const m = e.target.closest?.('[data-magnetic]')
      if (m !== mag) leaveMag()
      if (m) {
        mag = m
        const r = m.getBoundingClientRect()
        gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: EASE.out, overwrite: 'auto' })
      }
      const t = e.target.closest?.('[data-tilt]')
      if (t !== tilt) leaveTilt()
      if (t) {
        tilt = t
        const r = t.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        gsap.to(t, { rotationY: (px - 0.5) * 8, rotationX: (0.5 - py) * 8, transformPerspective: 900, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
        t.style.setProperty('--mx', px * 100 + '%')
        t.style.setProperty('--my', py * 100 + '%')
        t.style.setProperty('--spot', '1')
      }
    })
    on(document, 'pointerleave', () => { leaveMag(); leaveTilt() })
  }

  const disable = () => {
    off.forEach(f => f())
    off = []
    if (cursorEl) gsap.set(cursorEl, { display: 'none' })
  }

  const sync = () => { disable(); if (mq.matches) enable() }
  sync()
  mq.addEventListener('change', sync)
  return () => { mq.removeEventListener('change', sync); disable() }
}

/* ── Live readout tickers (decorative previews) ────────────── */

const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16) }))

function password(len = 16) {
  const cs = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+'
  const a = new Uint32Array(len)
  crypto.getRandomValues(a)
  return Array.from(a, v => cs[v % cs.length]).join('')
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
}

// Decorative QR: real finder/timing/alignment structure, random data modules.
function qrMatrix(seed, N = 25) {
  let s = seed % 2147483647 || 1
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  const m = Array.from({ length: N }, () => Array.from({ length: N }, () => (rnd() > 0.52 ? 1 : 0)))
  const finder = (ox, oy) => {
    for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
      const X = ox + x, Y = oy + y
      if (X < 0 || Y < 0 || X >= N || Y >= N) continue
      const d = Math.max(Math.abs(x - 3), Math.abs(y - 3))
      m[Y][X] = d === 4 ? 0 : (d === 3 || d <= 1) ? 1 : 0
    }
  }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7)
  for (let i = 8; i < N - 8; i++) { m[6][i] = m[i][6] = i % 2 ? 0 : 1 }
  const ac = N - 7
  for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) { const d = Math.max(Math.abs(x), Math.abs(y)); m[ac + y][ac + x] = d === 1 ? 0 : 1 }
  return m
}

function qrLoop(canvas) {
  const N = 25
  const ctx = canvas.getContext('2d')
  let m, order, t0, raf
  const reset = () => {
    m = qrMatrix(Math.random() * 1e9 | 0, N)
    order = []
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) order.push([x, y, x + y + Math.random() * 6])
    order.sort((a, b) => a[2] - b[2])
    t0 = performance.now()
  }
  reset()
  const draw = now => {
    const w = Math.round(canvas.clientWidth * (window.devicePixelRatio || 1))
    if (w && canvas.width !== w) { canvas.width = canvas.height = w }
    const cell = canvas.width / N
    const el = (now - t0) / 1000
    const p = reduceMotion() ? 1 : Math.min(1, el / 1.4)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = getComputedStyle(canvas).color
    const count = Math.floor(p * order.length)
    for (let k = 0; k < count; k++) {
      const [x, y] = order[k]
      if (m[y][x]) ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), Math.ceil(cell), Math.ceil(cell))
    }
    if (el > 4.2) reset()
    raf = requestAnimationFrame(draw)
  }
  raf = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(raf)
}

export function startTickers(root) {
  const q = s => root.querySelectorAll(s)
  const stops = []
  q('canvas[data-tick=qr]').forEach(c => stops.push(qrLoop(c)))
  let hue = Math.random() * 360
  const run = () => {
    q('[data-tick=uuid]').forEach(el => scramble(el, uuid(), 1000))
    q('[data-tick=pass]').forEach(el => scramble(el, password(+el.dataset.len || 16), 900))
    hue = (hue + 47) % 360
    const hex = hslToHex(hue, 78, 58)
    q('[data-tick=swatch]').forEach(el => gsap.to(el, { backgroundColor: hex, duration: 0.9, ease: 'power2.inOut' }))
    q('[data-tick=hex]').forEach(el => scramble(el, hex, 600))
    q('[data-tick=hsl]').forEach(el => { el.textContent = `hsl(${Math.round(hue)} 78% 58%)` })
  }
  run()
  const id = setInterval(run, 2600)
  stops.push(() => clearInterval(id))
  return () => stops.forEach(f => f())
}

/* ── Theme switch with a circular reveal from the pointer ──── */

export function revealTheme(e, apply) {
  if (!document.startViewTransition || reduceMotion()) { apply(); return }
  const x = e && e.clientX != null ? e.clientX : window.innerWidth / 2
  const y = e && e.clientY != null ? e.clientY : 40
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const vt = document.startViewTransition(apply)
  vt.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 750, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
  ))
}

export { gsap, ScrollTrigger }
