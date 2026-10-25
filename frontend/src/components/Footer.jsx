import OkLink from '@/components/OkLink'
import { useThemeContext } from '@/context/ThemeContext'
import { categories, GITHUB_URL, CONTRIBUTING_URL, CHANGELOG_URL } from '@/lib/catalog'

export default function Footer() {
  const { theme, toggleTheme } = useThemeContext()

  return (
    <footer className="ok-footer">
      <div className="ok-footer__cols">
        {categories.map(c => (
          <div key={c.id} className="ok-footer__col">
            <OkLink to={c.href} label={c.navLabel} className="ok-label">{c.n} / {c.name}</OkLink>
            <div className="ok-footer__links">
              {c.tools.map(t => <OkLink key={t.id} to={t.href} label={t.navLabel}>{t.name}</OkLink>)}
            </div>
          </div>
        ))}
        <div className="ok-footer__col">
          <span className="ok-label">Project</span>
          <div className="ok-footer__links">
            <OkLink to={GITHUB_URL}>GitHub</OkLink>
            <OkLink to={CONTRIBUTING_URL}>Contributing guide</OkLink>
            <OkLink to={CHANGELOG_URL}>Changelog</OkLink>
          </div>
        </div>
        <div className="ok-footer__end">
          <button type="button" onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'}</button>
          <span className="ok-meta">© {new Date().getFullYear()} OmniKit contributors · MIT</span>
        </div>
      </div>
      <div className="ok-footer__word" aria-hidden="true">OmniKit</div>
    </footer>
  )
}
