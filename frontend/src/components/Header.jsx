import { useLocation } from 'react-router-dom'
import OkLink from '@/components/OkLink'
import { useShell } from '@/context/ShellContext'
import { useThemeContext } from '@/context/ThemeContext'
import { categories } from '@/lib/catalog'
import { SHORTCUT } from '@/lib/keys'

const HOME_SECTIONS = [
  ['#featured', '01 Featured'],
  ['#categories', '02 Categories'],
  ['#index', '03 Index'],
  ['#contribute', '04 Contribute'],
]

export default function Header() {
  const { pathname } = useLocation()
  const { openPalette } = useShell()
  const { theme, toggleTheme } = useThemeContext()
  const isHome = pathname === '/'
  const active = pathname.split('/')[1]

  return (
    <header className="ok-header">
      {isHome ? (
        <OkLink scrollTo={0} className="ok-brand" data-magnetic="">
          <Brand />
        </OkLink>
      ) : (
        <OkLink to="/" label="OmniKit — Index" className="ok-brand" data-magnetic="">
          <Brand />
        </OkLink>
      )}

      {isHome ? (
        <nav className="ok-nav" aria-label="Sections">
          {HOME_SECTIONS.map(([id, label]) => (
            <OkLink key={id} scrollTo={id}>{label}</OkLink>
          ))}
        </nav>
      ) : (
        <nav className="ok-nav" aria-label="Categories">
          {categories.map(c => (
            <OkLink key={c.id} to={c.href} label={c.navLabel} aria-current={c.id === active ? 'page' : undefined}>
              {c.n} {c.name}
            </OkLink>
          ))}
        </nav>
      )}

      <div className="ok-header__tools">
        <button type="button" className="ok-search-btn" onClick={openPalette} aria-label="Search tools">
          <span>Search</span>
          <span className="ok-kbd">{SHORTCUT}</span>
        </button>
        <button
          type="button"
          className="ok-theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          data-cursor-label={theme === 'dark' ? 'Light' : 'Dark'}
        >
          <span />
        </button>
      </div>
    </header>
  )
}

function Brand() {
  return (
    <>
      <span className="ok-brand__mark" />
      <span className="ok-brand__name">OmniKit</span>
      <span className="ok-brand__ver">v2 · OSS</span>
    </>
  )
}
