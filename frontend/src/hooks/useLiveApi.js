import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api'

// FastAPI returns `detail` as a string, or as a list of validation errors.
export function apiError(err, fallback = 'Something went wrong. Please try again.') {
  const d = err?.response?.data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg.replace(/^Value error, /, '')
  if (err?.code === 'ERR_NETWORK') return 'Could not reach the OmniKit API.'
  return fallback
}

// POSTs `body` to `path` shortly after it stops changing, so outputs update
// live as you type. Stale responses are dropped. `data` keeps the last good
// result while a new request is in flight or after an error.
export function useLiveApi(path, body, { enabled = true, delay = 250 } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: false })
  const [nonce, setNonce] = useState(0)
  const key = JSON.stringify(body)
  const seq = useRef(0)
  const immediate = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const id = ++seq.current
    const ctrl = new AbortController()
    const wait = immediate.current ? 0 : delay
    immediate.current = false
    const t = setTimeout(() => {
      setState(s => ({ ...s, loading: true }))
      api.post(path, JSON.parse(key), { signal: ctrl.signal })
        .then(res => { if (id === seq.current) setState({ data: res.data, error: null, loading: false }) })
        .catch(err => {
          if (ctrl.signal.aborted || id !== seq.current) return
          setState(s => ({ data: s.data, error: apiError(err), loading: false }))
        })
    }, wait)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [path, key, enabled, delay, nonce])

  // Re-run the same request immediately (e.g. "Regenerate").
  const refresh = () => { immediate.current = true; setNonce(n => n + 1) }

  return { ...state, refresh }
}
