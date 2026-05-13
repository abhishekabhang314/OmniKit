import { cn } from '@/lib/utils'

/**
 * FieldGroup — responsive grid wrapper for input rows.
 * Props: cols (1|2|3), children, className
 */
export function FieldGroup({ cols = 1, children, className }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  }

  return (
    <div className={cn('grid gap-4', gridCols[cols] || 'grid-cols-1', className)}>
      {children}
    </div>
  )
}
