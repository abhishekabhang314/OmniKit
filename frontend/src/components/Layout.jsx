import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import { ShellContext } from '@/context/ShellContext'
import { coverThen, getLenis, liftCurtain, registerCurtain, setupPointer, startSmoothScroll, ScrollTrigger } from '@/lib/motion'
import '@/styles/shell.css'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [palette, setPalette] = useState(false)
  const cursor = useRef(null)

  // Lenis + pointer effects live for the whole session.
  useLayoutEffect(() => {
    const stopScroll = startSmoothScroll()
    const stopPointer = setupPointer(cursor.current)
    const fallback = setTimeout(liftCurtain, 5000)
    return () => { clearTimeout(fallback); stopPointer(); stopScroll() }
  }, [])

  // Back/forward navigation skips the curtain, so reset scroll here too.
  useLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true })
    ScrollTrigger.refresh()
  }, [location.pathname])

  const go = useCallback((href, label) => {
    if (href === location.pathname) { getLenis()?.scrollTo(0); return }
    coverThen(label, () => navigate(href))
  }, [location.pathname, navigate])

  const openPalette = useCallback(() => setPalette(true), [])
  const closePalette = useCallback(() => setPalette(false), [])

  useEffect(() => {
    const onKey = e => {
      const tag = document.activeElement?.tagName || ''
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(p => !p) }
      else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); setPalette(true) }
      else if (e.key === 'Escape') setPalette(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shell = useMemo(() => ({ go, openPalette }), [go, openPalette])

  return (
    <ShellContext.Provider value={shell}>
      <div className="ok-root">
        {/* A ref callback attaches before the page's layout effects run, so the
            first page can wipe the curtain away. */}
        <div ref={registerCurtain} className="ok-curtain" aria-hidden="true">
          <span data-curtain-label="">OmniKit / calibrating</span>
          <span>Index {new Date().getFullYear()}</span>
        </div>
        <div className="ok-grain" aria-hidden="true" />
        <div ref={cursor} className="ok-cursor" aria-hidden="true">
          <div className="ok-cursor__dot" data-cursor-dot="" />
          <div className="ok-cursor__text" data-cursor-text="" />
        </div>

        <Header />
        <Suspense fallback={null}>
          <Outlet key={location.pathname} />
        </Suspense>
        <Footer />

        {palette && <CommandPalette onClose={closePalette} />}
      </div>
    </ShellContext.Provider>
  )
}
