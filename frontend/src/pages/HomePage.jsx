import { useState } from 'react'
import { Link } from 'react-router-dom'
import tools from '../registry/tools.json'
import ToolCard from '../components/ToolCard'

const CATEGORIES = [
  { slug: 'generators', label: 'Generators', icon: '⚡' },
  { slug: 'converters', label: 'Converters', icon: '🔄' },
  { slug: 'calculators', label: 'Calculators', icon: '🧮' },
  { slug: 'text', label: 'Text Tools', icon: '📝' },
  { slug: 'dev', label: 'Dev Tools', icon: '💻' },
  { slug: 'image', label: 'Image Tools', icon: '🖼️' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')

  const filtered = tools.filter(t =>
    [t.name, t.description, ...t.tags].some(s =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  )

  const featured = tools.filter(t => t.featured)

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900">🧰 ToolBox</h1>
        <p className="text-gray-500 mt-2 text-lg">All your everyday tools, in one place.</p>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-6 w-full max-w-md mx-auto block border border-gray-300 rounded-xl px-4 py-3
                     focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
      </div>

      {/* Search results */}
      {search && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Results for "{search}" ({filtered.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      {!search && (
        <>
          {/* Featured */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">⭐ Featured Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">📂 Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => {
                const count = tools.filter(t => t.category === cat.slug).length
                return (
                  <Link key={cat.slug} to={`/${cat.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md
                               hover:border-brand-500 transition-all flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{cat.label}</div>
                      <div className="text-xs text-gray-400">{count} tool{count !== 1 ? 's' : ''}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}