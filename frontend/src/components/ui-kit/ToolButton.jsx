import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * ToolButton — full-width primary action button for tool UIs.
 * Props: loading, children, ...buttonProps
 */
export function ToolButton({ loading = false, children, className, ...props }) {
  return (
    <Button
      className={cn('btn-primary full-width h-11', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.65s linear infinite',
            marginRight: 8,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </Button>
  )
}
