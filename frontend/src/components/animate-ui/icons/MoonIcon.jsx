import { motion } from 'motion/react'
import { Moon } from 'lucide-react'

export function MoonIcon({ size = 18, ...props }) {
  return (
    <motion.span
      initial={{ rotate: -30, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      exit={{ rotate: 30, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Moon size={size} {...props} />
    </motion.span>
  )
}
