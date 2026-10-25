import registry from '@/registry/tools.json'

// Chapter order and copy for each category. A category listed in tools.json
// but missing here still renders, with a generic blurb.
const CATEGORY_META = {
  generators: { name: 'Generators', blurb: 'Make something new: scannable codes, strong keys, unique identifiers.' },
  converters: { name: 'Converters', blurb: 'The same value in a different unit or colour space.' },
  calculators: { name: 'Calculators', blurb: 'Loan payments, body mass and exact age, worked out for you.' },
}

const titleCase = s => s.charAt(0).toUpperCase() + s.slice(1)
const pad = (n, w = 2) => String(n).padStart(w, '0')

const categoryIds = [...new Set([...Object.keys(CATEGORY_META), ...registry.map(t => t.category)])]
  .filter(id => registry.some(t => t.category === id))

export const categories = categoryIds.map((id, i) => {
  const meta = CATEGORY_META[id] || { name: titleCase(id), blurb: `Every ${id} tool in the kit.` }
  return { id, n: pad(i + 1), name: meta.name, blurb: meta.blurb, href: `/${id}`, navLabel: `${pad(i + 1)} — ${meta.name}` }
})

export const tools = registry.map((t, i) => {
  const cat = categories.find(c => c.id === t.category)
  const short = t.short || t.name.replace(/ (Generator|Converter|Calculator)$/, '')
  const code = `TOOL/${pad(i + 1, 3)}`
  return {
    ...t,
    short,
    abbr: t.abbr || short.slice(0, 3).toUpperCase(),
    desc: t.description,
    code,
    href: t.route,
    catName: cat.name,
    tagLine: t.tags.map(x => `#${x}`).join('  '),
    navLabel: `${code} — ${t.name}`,
    isNew: !!t.new,
  }
})

categories.forEach(c => {
  c.tools = tools.filter(t => t.category === c.id)
  c.count = pad(c.tools.length)
})

export const toolCount = pad(tools.length)
export const categoryCount = pad(categories.length)

export const findTool = id => tools.find(t => t.id === id)
export const findCategory = id => categories.find(c => c.id === id)

export function searchTools(query) {
  const q = query.trim().toLowerCase()
  if (!q) return tools
  return tools.filter(t => `${t.name} ${t.catName} ${t.tags.join(' ')} ${t.code}`.toLowerCase().includes(q))
}

// Chapters alternate surface / accent / inverted ink, as in the design.
const CHAPTER_COLORS = [
  { bg: 'var(--bg2)', fg: 'var(--ink)' },
  { bg: 'var(--accent)', fg: 'var(--acc-ink)' },
  { bg: 'var(--ink)', fg: 'var(--bg)' },
]
export const chapterColors = i => CHAPTER_COLORS[i % CHAPTER_COLORS.length]

export const GITHUB_URL = 'https://github.com/abhishekabhang314/OmniKit'
export const CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`
export const CHANGELOG_URL = `${GITHUB_URL}/blob/main/docs/CHANGELOG.md`
export const NEW_TOOL_URL = `${GITHUB_URL}/issues/new?template=new_tool_request.md`
