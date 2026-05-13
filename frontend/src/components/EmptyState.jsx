import { Link } from 'react-router-dom'
import { ToolButton } from '@/components/ui-kit'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
      {Icon && (
        <div className="empty-state-icon flex items-center justify-center w-16 h-16 bg-[var(--color-surface-raised)] rounded-[20px] text-[var(--color-text-muted)]">
          <Icon size={32} />
        </div>
      )}
      <h3 className="empty-state-title text-lg font-bold text-[var(--color-text-primary)] m-0">
        {title}
      </h3>
      <p className="empty-state-desc text-sm text-[var(--color-text-muted)] m-0 max-w-[340px] leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action.href.startsWith('http') ? (
            <a href={action.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <ToolButton variant="outline">{action.label}</ToolButton>
            </a>
          ) : (
            <Link to={action.href} style={{ textDecoration: 'none' }}>
              <ToolButton variant="outline">{action.label}</ToolButton>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
