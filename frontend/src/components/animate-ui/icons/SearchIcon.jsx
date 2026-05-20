import { motion } from 'motion/react'
import { Search } from 'lucide-react'

export function SearchIcon({ size = 18, className = '', ...props }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Search size={size} className={className} {...props} />
    </motion.span>
  )
}
