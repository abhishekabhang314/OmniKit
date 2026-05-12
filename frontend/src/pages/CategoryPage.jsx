import { useParams, Link } from 'react-router-dom'
import tools from '../registry/tools.json'
import ToolCard from '../components/ToolCard'

const CATEGORY_META = {
  generators: { label: 'Generators', icon: '⚡' },
  converters: { label: 'Converters', icon: '🔄' },
  calculators: { label: 'Calculators', icon: '🧮' },
  text: { label: 'Text Tools', icon: '📝' },
  dev: { label: 'Dev Tools', icon: '💻' },
  image: { label: 'Image Tools', icon: '🖼️' },
}

export default function CategoryPage() {
  const { category } = useParams()
  const meta = CATEGORY_META[category]
  const categoryTools = tools.filter(t => t.category === category)

  if (!meta) return <div className="text-center py-20 text-gray-500">Category not found.</div>

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-400 hover:text-brand-600">← Back to all tools</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {meta.icon} {meta.label}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{categoryTools.length} tools</p>
      </div>

      {categoryTools.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No tools in this category yet.{' '}
          <a href="https://github.com/YOUR_USERNAME/toolbox/blob/main/CONTRIBUTING.md"
             className="text-brand-600 hover:underline">Contribute one!</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryTools.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      )}
    </div>
  )
}