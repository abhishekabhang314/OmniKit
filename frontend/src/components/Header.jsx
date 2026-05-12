import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-600">
          🧰 ToolBox
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="https://github.com/abhishekabhang314/toolbox" target="_blank" rel="noreferrer"
             className="hover:text-brand-600 transition-colors">
            GitHub
          </a>
          <a href="https://github.com/abhishekabhang314/toolbox/blob/main/CONTRIBUTING.md"
             target="_blank" rel="noreferrer"
             className="hover:text-brand-600 transition-colors">
            Contribute
          </a>
        </nav>
      </div>
    </header>
  )
}