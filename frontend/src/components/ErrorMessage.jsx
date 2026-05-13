import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function ErrorMessage({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="error-message flex items-start gap-2 p-3 bg-[var(--color-error-light)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] rounded-[var(--radius-md)] text-[var(--color-error)] text-[13px] font-medium leading-relaxed"
        >
          <AlertCircle size={16} className="shrink-0 mt-[1px]" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
