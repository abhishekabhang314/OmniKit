import * as ProgressPrimitive from '@radix-ui/react-progress'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

function Progress({ value = 0, className, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={cn('progress-bar-track', className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
