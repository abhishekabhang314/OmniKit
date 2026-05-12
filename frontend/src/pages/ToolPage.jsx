import { useParams, Link } from 'react-router-dom'
import tools from '../registry/tools.json'

export default function ToolPage() {
  const { category, toolId } = useParams()
  const tool = tools.find(t => t.id === toolId)

  if (!tool) return <div className="text-center py-20 text-gray-500">Tool not found.</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to={`/${category}`} className="text-sm text-gray-400 hover:text-brand-600">
          ← Back to {category}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {tool.icon} {tool.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{tool.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        Tool UI coming in Phase 4.
      </div>
    </div>
  )
}