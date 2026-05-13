import { AnimatePresence, motion } from 'motion/react'
import { useThemeContext } from '@/context/ThemeContext'
import { MoonIcon } from '../icons/MoonIcon'
import { SunIcon } from '../icons/SunIcon'

export function ThemeToggler() {
  const { theme, toggleTheme } = useThemeContext()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast), color var(--transition-fast)',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--color-surface-raised)'
        e.currentTarget.style.color = 'var(--color-text-primary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--color-text-muted)'
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <SunIcon key="sun" size={18} />
        ) : (
          <MoonIcon key="moon" size={18} />
        )}
      </AnimatePresence>
    </button>
  )
}
