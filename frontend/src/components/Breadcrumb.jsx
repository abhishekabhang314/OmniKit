import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@/components/animate-ui/icons/ArrowLeftIcon'

export default function Breadcrumb({ to, label }) {
  return (
    <Link to={to} className="breadcrumb flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors w-fit">
      <ArrowLeftIcon size={14} />
      {label}
    </Link>
  )
}
