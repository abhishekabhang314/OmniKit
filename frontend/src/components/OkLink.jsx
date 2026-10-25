import { useShell } from '@/context/ShellContext'
import { scrollToTarget } from '@/lib/motion'

// Internal link that plays the curtain transition. External URLs open in a
// new tab; `scrollTo` smooth-scrolls to an anchor on the current page.
export default function OkLink({ to, label, scrollTo, children, ...rest }) {
  const { go } = useShell()

  if (scrollTo != null) {
    const onClick = e => { e.preventDefault(); scrollToTarget(scrollTo) }
    return <a href={typeof scrollTo === 'string' ? scrollTo : '#'} onClick={onClick} {...rest}>{children}</a>
  }

  if (/^https?:/.test(to)) {
    return <a href={to} target="_blank" rel="noreferrer" {...rest}>{children}</a>
  }

  const onClick = e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    go(to, label || (typeof children === 'string' ? children : undefined))
  }
  return <a href={to} onClick={onClick} {...rest}>{children}</a>
}
