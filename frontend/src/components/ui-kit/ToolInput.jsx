import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * ToolInput — standard labelled input for all tool UIs.
 * Props: label, id, prefix, suffix, hint, error, ...inputProps
 */
export function ToolInput({
  label,
  id,
  prefix,
  suffix,
  hint,
  error,
  className,
  textarea = false,
  ...inputProps
}) {
  return (
    <div className="tool-field-group">
      {label && (
        <Label htmlFor={id} className="field-label">
          {label}
        </Label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            position: 'absolute',
            left: 12,
            fontSize: 13,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-sans)',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            {prefix}
          </span>
        )}
        {textarea ? (
          <textarea
            id={id}
            className={cn(
              'input-field',
              prefix && 'pl-7',
              suffix && 'pr-10',
              error && 'border-[var(--color-error)] focus:border-[var(--color-error)]',
              className
            )}
            style={{ resize: 'none' }}
            {...inputProps}
          />
        ) : (
          <Input
            id={id}
            className={cn(
              'input-field h-auto py-3',
              prefix && 'pl-7',
              suffix && 'pr-10',
              error && 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]',
              className
            )}
            {...inputProps}
          />
        )}
        {suffix && (
          <span style={{
            position: 'absolute',
            right: 12,
            fontSize: 13,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-sans)',
            pointerEvents: 'none',
          }}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
