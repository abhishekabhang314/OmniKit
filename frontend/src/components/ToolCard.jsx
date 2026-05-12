import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link to={tool.route}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-brand-500 transition-all group">
      <div className="text-2xl mb-2">{tool.icon}</div>
      <h3 className="font-semibold text-gray-800 group-hover:text-brand-600">{tool.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
      {tool.new && (
        <span className="inline-block mt-2 text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
          New
        </span>
      )}
    </Link>
  )
}