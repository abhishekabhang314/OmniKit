import { Wrench } from 'lucide-react'

export default function EmptyState({ icon: Icon = Wrench, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-desc">{description}</p>}
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ marginTop: 4 }}
        >
          {action.label}
        </a>
      )}
    </div>
  )
}
