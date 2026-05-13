import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * ToolResult — animated result wrapper.
 * When visible switches false→true, slides in with motion.
 * Props: visible, children, className
 */
export function ToolResult({ visible, children, className }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn('tool-result-box', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
