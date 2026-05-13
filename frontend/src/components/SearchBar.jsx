import { Input } from '@/components/ui/input'
import { SearchIcon } from '@/components/animate-ui/icons/SearchIcon'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-placeholder)] pointer-events-none flex items-center">
        <SearchIcon size={18} />
      </div>
      <Input
        type="text"
        placeholder="Search tools..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 pl-11 pr-4 bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[var(--radius-lg)] text-[15px] shadow-sm transition-all focus-visible:ring-0 focus-visible:border-[var(--color-border-focus)] focus-visible:shadow-[var(--shadow-focus)]"
      />
    </div>
  )
}
