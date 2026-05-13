import { Link } from 'react-router-dom'
import { Wrench, GitBranch, Sun, Moon } from 'lucide-react'
import { useThemeContext } from '../context/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useThemeContext()

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">
            <Wrench size={20} />
          </span>
          ToolBox
        </Link>

        {/* Right side actions */}
        <div className="header-actions">
          <a
            href="https://github.com/abhishekabhang314/toolbox/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ fontSize: 13 }}
          >
            Contribute
          </a>
          <a
            href="https://github.com/abhishekabhang314/toolbox"
            target="_blank"
            rel="noreferrer"
            className="btn-icon"
            aria-label="View on GitHub"
          >
            <GitBranch size={18} />
          </a>
          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}