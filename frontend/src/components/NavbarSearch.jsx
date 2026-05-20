import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SearchIcon } from '@/components/animate-ui/icons/SearchIcon'
import tools from '@/registry/tools.json'

export default function NavbarSearch() {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const isExpanded = isHovered || isFocused || query.trim() !== ''
  const showDropdown = (isHovered || isFocused) && query.trim() !== ''

  const filteredTools = query.trim() === '' ? [] : tools.filter(t =>
    [t.name, t.description, ...t.tags].some(s =>
      s.toLowerCase().includes(query.toLowerCase())
    )
  )

  useEffect(() => {
    if (isHovered && inputRef.current && !isFocused && query.trim() === '') {
      // Small delay to let the width transition happen before focusing, 
      // preventing sudden jumps or horizontal scroll glitches in some browsers.
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
      return () => clearTimeout(timer)
    } else if (!isExpanded) {
      setQuery('')
    }
  }, [isHovered, isFocused, isExpanded, query])

  return (
    <div 
      className="relative flex items-center h-full z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`flex items-center transition-all duration-300 ease-in-out bg-[var(--color-surface)] border rounded-full overflow-hidden
          ${isExpanded 
            ? 'w-64 opacity-100 border-[var(--color-border)] shadow-sm' 
            : 'w-9 opacity-80 border-transparent bg-transparent hover:bg-[var(--color-surface-raised)]'
          }`}
        style={{ height: '36px' }}
      >
        <div className={`flex-shrink-0 flex items-center justify-center text-[var(--color-text-muted)] cursor-pointer ${isExpanded ? 'pl-3' : 'w-full'}`}>
          <SearchIcon size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tools..."
          className={`w-full h-full bg-transparent border-none outline-none pl-2 pr-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-placeholder)] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden animate-fadeup">
          {filteredTools.length > 0 ? (
            <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
              {filteredTools.map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/${tool.category}/${tool.id}`}
                  className="flex items-center p-2 hover:bg-[var(--color-surface-raised)] rounded-lg transition-colors"
                  onClick={() => {
                    setIsHovered(false)
                    setIsFocused(false)
                    setQuery('')
                  }}
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">{tool.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)] line-clamp-1">{tool.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">
              No tools found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
