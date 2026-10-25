import { useLayoutEffect } from 'react'
import { setupPage, startTickers } from '@/lib/motion'

// Runs the page's scroll choreography (and live tickers) against `ref` and
// reverts it before React removes the nodes, so pin spacers never leak.
export function usePageMotion(ref, { fast = false, tickers = false, deps = [] } = {}) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const stopPage = setupPage(root, { fast })
    const stopTick = tickers ? startTickers(root) : null
    return () => {
      stopTick && stopTick()
      stopPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
