import { Link } from 'react-router-dom'
import { ToolIcon } from './Icon'

export default function ToolCard({ tool }) {
  return (
    <Link to={tool.route} className="card-tool">
      {/* Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
        }}>
          <ToolIcon id={tool.id} size={20} />
        </div>
        {tool.new && (
          <span className="badge badge-new">New</span>
        )}
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 14,
        color: 'var(--color-text-primary)',
        lineHeight: 1.3,
      }}>
        {tool.name}
      </div>

      {/* Description */}
      <div style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--color-text-muted)',
        lineHeight: 1.5,
      }}>
        {tool.description}
      </div>
    </Link>
  )
}