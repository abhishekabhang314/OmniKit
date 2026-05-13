import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

/**
 * ToolSlider — labelled range slider with value badge.
 * Props: label, id, min, max, value, onChange, showValue, unit
 */
export function ToolSlider({
  label,
  id,
  min = 0,
  max = 100,
  value,
  onChange,
  showValue = true,
  unit = '',
}) {
  return (
    <div className="tool-field-group">
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Label htmlFor={id} className="field-label" style={{ marginBottom: 0 }}>
            {label}
          </Label>
          {showValue && (
            <Badge variant="secondary" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '2px 8px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              border: 'none',
            }}>
              {value}{unit}
            </Badge>
          )}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-field"
      />
    </div>
  )
}
