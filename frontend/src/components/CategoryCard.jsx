import { Link } from 'react-router-dom'
import { CategoryIcon } from './Icon'

export default function CategoryCard({ slug, label, count }) {
  return (
    <Link to={`/${slug}`} className="card-category">
      <div className="card-category-icon">
        <CategoryIcon category={slug} size={22} />
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 15,
          color: 'var(--color-text-primary)',
          marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}>
          {count} tool{count !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  )
}
