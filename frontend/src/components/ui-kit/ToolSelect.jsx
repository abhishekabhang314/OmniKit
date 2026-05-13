import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * ToolSelect — standard labelled select for all tool UIs.
 * Props: label, id, options [{value, label}], ...selectProps
 */
export function ToolSelect({ label, id, options = [], className, ...selectProps }) {
  return (
    <div className="tool-field-group">
      {label && (
        <Label htmlFor={id} className="field-label">
          {label}
        </Label>
      )}
      <select
        id={id}
        className={cn('select-field', className)}
        {...selectProps}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
