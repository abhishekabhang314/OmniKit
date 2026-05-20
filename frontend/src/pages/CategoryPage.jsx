import { useParams } from 'react-router-dom'
import { Package } from 'lucide-react'
import tools from '@/registry/tools.json'
import ToolCard from '@/components/ToolCard'
import Breadcrumb from '@/components/Breadcrumb'
import EmptyState from '@/components/EmptyState'
import { CategoryIcon } from '@/components/Icon'

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
      <div className="mb-5">
        <Breadcrumb to="/" label="All tools" />
      </div>

      {/* Category header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-11 h-11 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-[var(--radius-md)]">
            <CategoryIcon category={category} size={22} />
          </div>
          <h1 className="font-sans text-2xl font-bold text-[var(--color-text-primary)] tracking-tight m-0">
            {meta.label}
          </h1>
        </div>
        <p className="font-sans text-sm text-[var(--color-text-muted)] m-0">
          {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {categoryTools.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No tools yet"
          description="This category is empty for now. Want to contribute the first tool?"
          action={{
            href: 'https://github.com/abhishekabhang314/OmniKit/blob/main/CONTRIBUTING.md',
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