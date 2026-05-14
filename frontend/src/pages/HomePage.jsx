import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Star, LayoutGrid, Wrench } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { GradientBackground } from '@/components/animate-ui/backgrounds/GradientBackground'
import tools from '@/registry/tools.json'
import ToolCard from '@/components/ToolCard'
import CategoryCard from '@/components/CategoryCard'
import SearchBar from '@/components/SearchBar'

const CATEGORIES = [
  { slug: 'generators',  label: 'Generators' },
  { slug: 'converters',  label: 'Converters' },
  { slug: 'calculators', label: 'Calculators' },
  { slug: 'text',        label: 'Text Tools' },
  { slug: 'dev',         label: 'Dev Tools' },
  { slug: 'image',       label: 'Image Tools' },
]

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') || ''
  const [isSearching, setIsSearching] = useState(false)

  // simulate brief search loading state for demo purposes of Skeleton
  const handleSearch = (v) => {
    if (v) {
      setSearchParams({ q: v })
      setIsSearching(true)
      setTimeout(() => setIsSearching(false), 300)
    } else {
      setSearchParams({})
    }
  }

  const filtered = tools.filter(t =>
    [t.name, t.description, ...t.tags].some(s =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  )
  const featured = tools.filter(t => t.featured)

  return (
    <div>
      {/* Hero */}
      <div className="relative text-center py-16 px-6 mb-10 -mx-6 -mt-8 overflow-hidden rounded-b-3xl">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
            <Wrench size={12} />
            Community Built
          </div>
          <h1 className="font-sans text-[clamp(32px,5vw,48px)] font-bold text-[var(--color-text-primary)] tracking-tight leading-[1.15] mb-4">
            All your everyday tools,<br />
            <span className="text-[var(--color-primary)]">in one place.</span>
          </h1>
          <p className="font-sans text-base text-[var(--color-text-muted)] leading-relaxed mx-auto mb-8 max-w-[480px]">
            Free, fast, open-source utility tools — no sign-up, no ads.
          </p>
          <div className="max-w-[520px] mx-auto">
            <SearchBar value={search} onChange={handleSearch} />
          </div>
        </div>
      </div>

      {/* Search results */}
      {search && (
        <section className="mb-10">
          <h2 className="section-title">
            Results for "{search}"
            <span className="text-[13px] font-medium text-[var(--color-text-muted)] ml-1">
              ({filtered.length})
            </span>
          </h2>
          {isSearching ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-text-muted)] font-sans text-sm">
              No tools found for "{search}"
            </div>
          )}
        </section>
      )}

      {!search && (
        <>
          {/* Featured Tools */}
          <section className="mb-10">
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