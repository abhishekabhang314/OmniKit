# Phase 3 — Vite + React Frontend Foundation

> **Goal:** Scaffold the Vite + React app, install and configure Tailwind CSS and React Router, build the app shell (header, footer, layout), and wire up routing so the homepage and category pages exist — with no tools yet.

---

## Checklist

- [x] Vite + React project scaffolded
- [x] Tailwind CSS configured
- [x] React Router v6 installed and configured
- [x] App shell (layout, header, footer) built
- [x] Homepage route renders
- [x] Category page route renders (auto-generated from `tools.json`)
- [x] 404 page created
- [x] Frontend connects to backend (`/health` ping works)
- [x] `npm run build` succeeds

---

## Step 1 — Scaffold the Vite + React App

```cmd
cd frontend
npm create vite@latest . -- --template react
npm install
```

When prompted, confirm overwriting the folder.

---

## Step 2 — Install Dependencies

```cmd
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios
```

---

## Step 3 — Configure Tailwind

Edit `frontend/tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      }
    },
  },
  plugins: [],
}
```

Edit `frontend/src/index.css` — replace everything with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 4 — Environment Variables

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Create `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Step 5 — Vite Config (API Proxy)

Edit `frontend/vite.config.js` to proxy API calls during development:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

This means during dev, `/api/generators/qr-code` in React automatically hits `http://localhost:8000/api/generators/qr-code`. No CORS issues locally.

---

## Step 6 — App Router Setup

Replace `frontend/src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

Replace `frontend/src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ToolPage from './pages/ToolPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path=":category" element={<CategoryPage />} />
        <Route path=":category/:toolId" element={<ToolPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

---

## Step 7 — Shared Components

### `frontend/src/components/Layout.jsx`

```jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

### `frontend/src/components/Header.jsx`

```jsx
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-600">
          🧰 OmniKit
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="https://github.com/abhishekabhang314/OmniKit" target="_blank" rel="noreferrer"
             className="hover:text-brand-600 transition-colors">
            GitHub
          </a>
          <a href="https://github.com/abhishekabhang314/OmniKit/blob/main/CONTRIBUTING.md"
             target="_blank" rel="noreferrer"
             className="hover:text-brand-600 transition-colors">
            Contribute
          </a>
        </nav>
      </div>
    </header>
  )
}
```

### `frontend/src/components/Footer.jsx`

```jsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-center text-sm text-gray-500 py-4">
      OmniKit — open source, community built.{' '}
      <a href="https://github.com/abhishekabhang314/OmniKit"
         className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
        Contribute on GitHub
      </a>
    </footer>
  )
}
```

### `frontend/src/components/ToolCard.jsx`

```jsx
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
```

---

## Step 8 — Pages

### `frontend/src/pages/HomePage.jsx`

```jsx
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
        <h1 className="text-4xl font-bold text-gray-900">🧰 OmniKit</h1>
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
```

### `frontend/src/pages/CategoryPage.jsx`

```jsx
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
          <a href="https://github.com/abhishekabhang314/OmniKit/blob/main/CONTRIBUTING.md"
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
```

### `frontend/src/pages/ToolPage.jsx`

```jsx
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
```

### `frontend/src/pages/NotFoundPage.jsx`

```jsx
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🔧</div>
      <h1 className="text-2xl font-bold text-gray-800">Page not found</h1>
      <p className="text-gray-500 mt-2">This tool or page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
        Back to OmniKit
      </Link>
    </div>
  )
}
```

---

## Step 9 — Run the Frontend

```cmd
cd frontend
npm run dev
```

Visit `http://localhost:5173`

You should see:
- Homepage with search bar, featured tools, and category grid
- Clicking a category → category page with tool cards
- Clicking a tool card → tool page placeholder

---

## Step 10 — Verify Build

```cmd
npm run build
```

Should complete with no errors.

---

## ✅ Phase 3 Complete

When all checkboxes at the top are done, move to **[Phase 4 — First 3 Tools](PHASE_4_FIRST_TOOLS.md)**.
