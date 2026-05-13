import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search tools...' }) {
  return (
    <div className="search-wrap">
      <span className="search-icon">
        <Search size={18} />
      </span>
      <input
        id="tool-search"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  )
}
