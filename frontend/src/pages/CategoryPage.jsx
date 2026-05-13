import { useParams } from 'react-router-dom'
import { Package } from 'lucide-react'
import tools from '../registry/tools.json'
import ToolCard from '../components/ToolCard'
import Breadcrumb from '../components/Breadcrumb'
import EmptyState from '../components/EmptyState'
import { CategoryIcon } from '../components/Icon'

const CATEGORY_META = {
  generators:  { label: 'Generators' },
  converters:  { label: 'Converters' },
  calculators: { label: 'Calculators' },
  text:        { label: 'Text Tools' },
  dev:         { label: 'Dev Tools' },
  image:       { label: 'Image Tools' },
}

export default function CategoryPage() {
  const { category } = useParams()
  const meta = CATEGORY_META[category]
  const categoryTools = tools.filter(t => t.category === category)

  if (!meta) {
    return (
      <EmptyState
        title="Category not found"
        description="This category doesn't exist. Head back to browse all tools."
        action={{ href: '/', label: 'Browse all tools' }}
      />
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <Breadcrumb to="/" label="All tools" />
      </div>

      {/* Category header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44,
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <CategoryIcon category={category} size={22} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {meta.label}
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
          {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {categoryTools.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No tools yet"
          description="This category is empty for now. Want to contribute the first tool?"
          action={{
            href: 'https://github.com/abhishekabhang314/toolbox/blob/main/CONTRIBUTING.md',
            label: 'Contribute a tool →',
          }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryTools.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      )}
    </div>
  )
}