import { Link } from 'react-router-dom'
import { WrenchIcon } from 'lucide-react'
import { ToolButton } from '@/components/ui-kit'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
      <div className="flex items-center justify-center w-[72px] h-[72px] bg-[var(--color-surface-raised)] rounded-[24px] text-[var(--color-text-muted)]">
        <WrenchIcon size={36} />
      </div>
      <h1 className="font-sans text-2xl font-bold text-[var(--color-text-primary)] tracking-tight m-0">
        Page not found
      </h1>
      <p className="font-sans text-[15px] text-[var(--color-text-muted)] m-0 max-w-[340px] leading-relaxed">
        This tool or page doesn't exist. Head back to the homepage.
      </p>
      <div className="mt-1">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <ToolButton>Back to OmniKit</ToolButton>
        </Link>
      </div>
    </div>
  )
}