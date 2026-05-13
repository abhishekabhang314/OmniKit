import { useState } from 'react'
import { Star, LayoutGrid, Wrench } from 'lucide-react'
import tools from '../registry/tools.json'
import ToolCard from '../components/ToolCard'
import CategoryCard from '../components/CategoryCard'
import SearchBar from '../components/SearchBar'

const CATEGORIES = [
  { slug: 'generators',  label: 'Generators' },
  { slug: 'converters',  label: 'Converters' },
  { slug: 'calculators', label: 'Calculators' },
  { slug: 'text',        label: 'Text Tools' },
  { slug: 'dev',         label: 'Dev Tools' },
  { slug: 'image',       label: 'Image Tools' },
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
      <div className="hero-section">
        <div className="hero-eyebrow">
          <Wrench size={12} />
          Community Built
        </div>
        <h1 className="hero-title">
          All your everyday tools,<br />
          <span className="accent">in one place.</span>
        </h1>
        <p className="hero-subtitle">
          Free, fast, open-source utility tools — no sign-up, no ads.
        </p>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Search results */}
      {search && (
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <h2 className="section-title">
            Results for "{search}"
            <span style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              marginLeft: 4,
            }}>
              ({filtered.length})
            </span>
          </h2>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-12)',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
            }}>
              No tools found for "{search}"
            </div>
          )}
        </section>
      )}

      {!search && (
        <>
          {/* Featured Tools */}
          <section style={{ marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">
              <Star size={18} className="section-icon" />
              Featured Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          {/* Browse by Category */}
          <section>
            <h2 className="section-title">
              <LayoutGrid size={18} className="section-icon" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.slug}
                  slug={cat.slug}
                  label={cat.label}
                  count={tools.filter(t => t.category === cat.slug).length}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}