import { useEffect, useState } from 'react'

const REPO = 'abhishekabhang314/OmniKit'
let cached = null

// Last page number in a GitHub `Link` header = total items at per_page=1.
const lastPage = link => {
  const m = /[?&]page=(\d+)>; rel="last"/.exec(link || '')
  return m ? +m[1] : null
}

// Live star and contributor counts for the contribute section. Stays null on
// failure (e.g. rate limiting) so the UI can show a dash instead of a fake number.
export function useRepoStats() {
  const [stats, setStats] = useState(cached)

  useEffect(() => {
    if (cached) return
    let alive = true
    Promise.all([
      fetch(`https://api.github.com/repos/${REPO}`).then(r => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=1&anon=1`).then(async r => {
        if (!r.ok) return null
        return lastPage(r.headers.get('Link')) ?? (await r.json()).length
      }),
    ])
      .then(([repo, contributors]) => {
        cached = { stars: repo ? repo.stargazers_count : null, contributors }
        if (alive) setStats(cached)
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  return stats
}
