import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
      <p className="text-gray-500 mt-2">This tool or page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
        Back to ToolBox
      </Link>
    </div>
  )
}