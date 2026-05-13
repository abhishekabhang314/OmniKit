import { Link } from 'react-router-dom'
import { WrenchIcon } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-16) var(--space-6)',
      gap: 'var(--space-4)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 72, height: 72,
        background: 'var(--color-surface-raised)',
        borderRadius: 24,
        color: 'var(--color-text-muted)',
      }}>
        <WrenchIcon size={36} />
      </div>
      <h1 style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em',
        margin: 0,
      }}>
        Page not found
      </h1>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        color: 'var(--color-text-muted)',
        margin: 0,
        maxWidth: 340,
        lineHeight: 1.6,
      }}>
        This tool or page doesn't exist. Head back to the homepage.
      </p>
      <Link to="/" className="btn-primary" style={{ marginTop: 4 }}>
        Back to ToolBox
      </Link>
    </div>
  )
}